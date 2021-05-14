import { Unit } from "../app-models/Unit";
import { App } from "../app/App";
import { default_properties } from "../app/AppPropertyCollection";

export class AppView {
    constructor(
        public app: App
    ) {
        requestAnimationFrame(this.update);
    }

    public update = () => {
        const context = this.app.properties.context;
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
        const w = 40;
        const h = 30;
        let x = (unit.x + 0.5) / w * 800;
        let y = (unit.y + 0.5) / h * 600;
        this.app.properties.context.fillText(unit.letter, x, y);
    }
}