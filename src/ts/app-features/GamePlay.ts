import { Unit } from "../app-models/Unit";
import { App } from "../app/App";
import { get_element_by_query_selector } from "../utils/dom";
import { PointInterface } from "../utils/shapes";

export class GamePlay {
    public elements: GamePlayElements;
    public props: GamePlayProperties;
    public logic: GamePlayLogic;
    public listeners: GamePlayListeners;

    public constructor(
        public app: App
    ) {
        this.elements = new GamePlayElements(this);
        this.props = new GamePlayProperties(this);
        this.logic = new GamePlayLogic(this);
        this.listeners = new GamePlayListeners(this);
    }

    public grow(type: number) {
        if (this.props.game_over) return;
        this.props.moves++;
        this.logic.grow(type);
        this.check_and_strike();
    }

    public check_and_strike() {
        this.logic.update_matching_count();
        this.logic.strike();
        if (this.logic.is_game_over()) {
            this.props.game_over = true;
            this.app.features.sound.play('over');
        }
    }
}

class GamePlayListeners {
    public constructor(
        public feature: GamePlay
    ) {
        window.addEventListener('keydown', this.on_key_down);
        requestAnimationFrame(this.update);
    }

    protected on_key_down = (event: KeyboardEvent) => {
        const letter = event.key.toUpperCase();
        if (!this.feature.props.current_set.includes(letter)) return;
        this.feature.grow(this.feature.props.current_set.indexOf(letter));
    }

    protected update = () => {
        // let noise_factor = 0;
        this.feature.app.props.units.forEach((unit) => {
            if (unit.dead && unit.animation === "none") {
                const index = this.feature.app.props.units.indexOf(unit);
                this.feature.app.props.units.splice(index, 1);
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

class GamePlayElements {
    public constructor(
        public feature: GamePlay
    ) {

    }
}
class GamePlayProperties {
    public current_set: Array<string> = ['.'];
    public game_over: boolean = false;
    public score: number = 0;
    public moves: number = 0;

    public constructor(
        public feature: GamePlay
    ) {

    }
}

class GamePlayLogic {
    protected match_buffer: Array<Array<PointInterface> | null> = [];

    public constructor(
        public feature: GamePlay
    ) {

    }

    public restart() {
        this.feature.app.props.units = [];
        for (let x = 0; x < 40; ++x) {
            for (let y = 0; y < 30; ++y) {
                this.feature.app.features.map.create_unit_at(Math.floor(Math.random() * this.feature.props.current_set.length), { x, y });
            }
        }
        this.feature.app.features.gameplay.logic.update_matching_count();
    }

    public grow(type: number) {
        this.feature.app.features.map.for_each((unit: Unit | PointInterface): Unit | null => {
            if (!(unit instanceof Unit)) return null;
            if (type === unit.type) {
                unit.type = (type + 1) % this.feature.props.current_set.length;
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
                        if (field instanceof Unit) {
                            this.feature.props.score++;
                        }
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

    public is_game_over(): boolean {
        const sum_stencil = (sum: number, next: PointInterface | Unit): number => {
            return sum + (next instanceof Unit ? 1 : 0);
        };
        for (let y = 0; y < this.feature.app.features.map.props.height; ++y) {
            for (let x = 0; x < this.feature.app.features.map.props.width; ++x) {
                let units: number = this.feature.app.features.map.get_stencil({ left: x - 1, top: y - 1 }, 3, 3).reduce(sum_stencil, 0);
                if (units === 9) {
                    return false;
                }
            }
        }
        return true;
    }
}