import { Unit } from "../app-models/Unit";
import { App } from "../app/App";
import { get_element_by_query_selector } from "../utils/dom";
import { PointInterface } from "../utils/shapes";
import { GamePlay } from "./GamePlay";

export class AppView {

    public elements: AppViewElements;
    public props: AppViewProperties;
    public game_over_timestamp: number = performance.now();

    constructor(
        public app: App
    ) {
        this.elements = new AppViewElements(this);
        this.props = new AppViewProperties(this);
        requestAnimationFrame(this.update);
    }

    public update = () => {
        const context = this.app.props.context;
        this.props.cell_width = 800 / this.app.features.map.props.width;
        this.props.cell_height = 600 / this.app.features.map.props.height;
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);

        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillStyle = "white";
        context.font = "18px monospace";
        this.app.props.units.forEach(this.draw_unit);

        if (this.app.features.gameplay.props.game_over) {
            const delta = Math.min(1, (performance.now() - this.game_over_timestamp - 175) / 500);
            const t = delta * delta;
            this.app.props.context.textAlign = "center";
            this.app.props.context.textBaseline = "middle";
            this.app.props.context.translate(400, 300);
            this.app.props.context.rotate(0.14);
            this.app.props.context.font = "64px serif";
            const scale = 3 - t * 2;
            this.app.props.context.scale(scale, scale);
            this.app.props.context.fillText('Board finished!', 0, 0);
            this.app.props.context.resetTransform();
            this.app.props.context.font = "32px serif";
            this.app.props.context.fillText('Enter: next level', 400, 500);
            this.app.props.context.fillText('Escape: try again', 400, 530);
        } else {
            this.game_over_timestamp = performance.now();
        }

        const score = this.app.features.gameplay.props.score.toString();
        if (score !== this.elements.score.innerText.trim()) {
            this.elements.score.innerText = score;
        }
        const moves = this.app.features.gameplay.props.moves.toString();
        if (moves !== this.elements.moves.innerText.trim()) {
            this.elements.moves.innerText = moves;
        }

        requestAnimationFrame(this.update);
    }

    public draw_unit = (unit: Unit) => {
        if (unit.dead && unit.animation !== "dying") return;
        let { x, y } = this.unit_render_position(unit);
        this.app.props.context.save();
        this.app.props.context.translate(x, y);
        this.apply_animation(unit);
        this.app.props.context.scale(this.props.cell_width / 30, this.props.cell_height / 22.5);
        this.app.props.context.fillText(this.app.features.gameplay.props.current_set[unit.type], 0, 0);
        this.app.props.context.restore();
        // this.app.properties.context.resetTransform();
    }

    public apply_animation(unit: Unit): void {
        switch (unit.animation) {
            case "idle":
                this.apply_idle_animation(unit);
                return;
            case "dying":
                this.apply_dying_animation(unit);
                return;
            case "none":
                return;
            default:
                throw new Error("Undefined animation");
        }
    }

    public apply_idle_animation(unit: Unit) {
        const t = unit.animation_progress / 120;
        const scale = 1 + t * (t - 1) * -1;
        this.app.props.context.scale(scale, scale);
        unit.animation_progress++;
        if (unit.animation_progress > 120) {
            unit.animation = "none";
        }
    }

    public apply_dying_animation(unit: Unit) {
        const t = unit.animation_progress / 120;
        const jump_weight = t * (t - 1) * (t - 1) * 8;
        const center_weight = t;
        const render_position = this.unit_render_position(unit);
        const jump_dx = 80;
        const jump_dy = -200;
        const center_dx = 400 - render_position.x;
        const center_dy = 600 - render_position.y;
        const translate_x = jump_dx * jump_weight + center_dx * center_weight;
        const translate_y = jump_dy * jump_weight + center_dy * center_weight;
        this.app.props.context.translate(translate_x, translate_y);
        unit.animation_progress++;
        if (unit.animation_progress > 120) {
            unit.animation = "none";
        }
    }

    public unit_render_position(unit: PointInterface): PointInterface {
        return {
            x: (unit.x + 0.5) * this.props.cell_width,
            y: (unit.y + 0.5) * this.props.cell_height
        };
    }
}


class AppViewElements {
    public moves: HTMLElement;
    public score: HTMLElement;

    public constructor(
        public feature: AppView
    ) {
        this.moves = get_element_by_query_selector(document, '#moves');
        this.score = get_element_by_query_selector(document, '#score');
    }
}
class AppViewProperties {
    public cell_width: number = 10;
    public cell_height: number = 10;

    public constructor(
        public feature: AppView
    ) { }
}