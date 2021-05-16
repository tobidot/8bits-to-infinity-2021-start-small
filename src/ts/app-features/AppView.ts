import { Unit } from "../app-models/Unit";
import { App } from "../app/App";
import { PointInterface } from "../utils/shapes";
import { GamePlay } from "./GamePlay";

export class AppView {

    public props: AppViewProperties;

    constructor(
        public app: App
    ) {
        this.props = new AppViewProperties(this);
        requestAnimationFrame(this.update);
    }

    public update = () => {
        const context = this.app.properties.context;
        this.props.cell_width = 800 / this.app.features.map.props.width;
        this.props.cell_height = 600 / this.app.features.map.props.height;
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);

        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillStyle = "white";
        context.font = "18px monospace";
        this.app.properties.units.forEach(this.draw_unit);

        requestAnimationFrame(this.update);
    }

    public draw_unit = (unit: Unit) => {
        if (unit.dead && unit.animation !== "dying") return;
        let { x, y } = this.unit_render_position(unit);
        this.app.properties.context.save();
        this.app.properties.context.translate(x, y);
        this.apply_animation(unit);
        this.app.properties.context.fillText(GamePlay.CONSTS.TYPE_SET[unit.type], 0, 0);
        this.app.properties.context.restore();
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
        this.app.properties.context.scale(scale, scale);
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
        this.app.properties.context.translate(translate_x, translate_y);
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

class AppViewProperties {
    public cell_width: number = 10;
    public cell_height: number = 10;

    public constructor(
        public feature: AppView
    ) { }
}