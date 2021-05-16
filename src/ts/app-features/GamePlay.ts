import { Unit } from "../app-models/Unit";
import { App } from "../app/App";
import { get_element_by_query_selector } from "../utils/dom";
import { PointInterface } from "../utils/shapes";

export class GamePlay {
    public static CONSTS = {
        TYPE_SET: ["A", "B", "C", "D"],
    };
    public listeners: GamePlayListeners;
    public logic: GamePlayLogic;

    public constructor(
        public app: App
    ) {
        this.listeners = new GamePlayListeners(this);
        this.logic = new GamePlayLogic(this);
    }

    public grow(type: number) {
        this.logic.grow(type);
        this.logic.update_matching_count();
        this.logic.strike();
    }
}

class GamePlayListeners {
    public constructor(
        public feature: GamePlay
    ) {
        window.addEventListener('keydown', this.on_key_down);
        get_element_by_query_selector(document, '#new-random-level', HTMLButtonElement).addEventListener(
            'click', this.on_new_random_level
        );
        requestAnimationFrame(this.update);
    }

    protected on_new_random_level = () => {
        this.feature.logic.restart();
    }

    protected on_key_down = (event: KeyboardEvent) => {
        const letter = event.key.toUpperCase();
        if (!GamePlay.CONSTS.TYPE_SET.includes(letter)) return;
        this.feature.grow(GamePlay.CONSTS.TYPE_SET.indexOf(letter));
    }

    protected update = () => {
        // let noise_factor = 0;
        this.feature.app.properties.units.forEach((unit) => {
            if (unit.dead && unit.animation === "none") {
                const index = this.feature.app.properties.units.indexOf(unit);
                this.feature.app.properties.units.splice(index, 1);
            }
            if (unit.dead) return;
            // maybe trigger idle animation
            if (unit.animation === "none" && Math.random() * 100000 < Math.pow(unit.matching_neighbours, 4)) {
                unit.start_animation("idle");
            }
        });
        requestAnimationFrame(this.update);
    }
}

class GamePlayLogic {
    protected match_buffer: Array<Array<PointInterface> | null> = [];

    public constructor(
        public feature: GamePlay
    ) {

    }

    public restart() {
        this.feature.app.properties.units = [];
        for (let x = 0; x < 40; ++x) {
            for (let y = 0; y < 30; ++y) {
                this.feature.app.features.map.create_unit_at(Math.floor(Math.random() * GamePlay.CONSTS.TYPE_SET.length), { x, y });
            }
        }
        this.feature.app.features.gameplay.logic.update_matching_count();
    }

    public grow(type: number) {
        this.feature.app.features.map.for_each((unit: Unit | PointInterface): Unit | null => {
            if (!(unit instanceof Unit)) return null;
            if (type === unit.type) {
                unit.type = (type + 1) % GamePlay.CONSTS.TYPE_SET.length;
            }
            return unit;
        });
    }

    public update_matching_count() {
        let buffer_index = 0;
        for (let y = 0; y < this.feature.app.features.map.props.height; ++y) {
            for (let x = 0; x < this.feature.app.features.map.props.width; ++x) {
                let stencil = this.feature.app.features.map.get_stencil({ left: x - 1, top: y - 1 }, 3, 3);
                const center = stencil[4];
                if (!(center instanceof Unit)) {
                    this.match_buffer[buffer_index++] = null;
                    continue;
                };
                // count how many neighbours match the center
                const matches = stencil.reduce((sum, field) => {
                    return (field instanceof Unit && field.type === center.type)
                        ? sum + 1
                        : sum;
                }, 0);
                center.matching_neighbours = matches;
                this.match_buffer[buffer_index++] = (matches === 9) ? stencil : null;
            }
        }
    }

    public strike() {
        let hits = 0;
        let buffer_index = 0;
        for (let y = 0; y < this.feature.app.features.map.props.height; ++y) {
            for (let x = 0; x < this.feature.app.features.map.props.width; ++x) {
                const stencil = this.match_buffer[buffer_index++];
                if (stencil) {
                    hits++;
                    stencil.forEach((field) => {
                        this.feature.app.features.map.kill(field);
                    });
                }
            }
        }
        if (hits > 0) {
            this.feature.app.features.sound.play("win");
        } else {
            this.feature.app.features.sound.play("select")
        }
    }
}