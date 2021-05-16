import { Unit } from "../app-models/Unit";
import { App } from "../app/App";
import { PointInterface } from "../utils/shapes";

export class AppMap {
    public props: AppMapProperties;
    public logic: AppMapLogic;


    public constructor(
        public app: App,
    ) {
        this.props = new AppMapProperties(this);
        this.logic = new AppMapLogic(this);
    }

    public get_stencil(top_left: { left: number; top: number; }, width: number, height: number): Array<Unit | PointInterface> {
        const { top, left } = top_left;
        const buffer: Array<Unit | PointInterface> = [...new Array(width * height)];
        let i = 0;
        for (let y = top; y < top + height; ++y) {
            for (let x = left; x < left + width; ++x) {
                const point = { x, y };
                buffer[i++] = this.logic.get(point) ?? point;
            }
        }
        return buffer;
    }

    public move(unit: Unit, target: PointInterface) {
        const old = this.logic.get(unit);
        if (old === unit) this.logic.set(unit, null);
        this.logic.set(target, unit);
    }


    public kill(field: PointInterface) {
        const old = this.logic.get(field);
        if (old === null) return;
        old.dead = true;
        old.start_animation("dying");
        this.logic.set(field, null);
    }

    public create_unit_at(unit_type: number, target: PointInterface) {
        let unit = new Unit();
        unit.type = unit_type;
        unit.x = target.x;
        unit.y = target.y;
        this.logic.set(target, unit);
        this.app.properties.units.push(unit);
    }

    public for_each(callback: (unit: Unit | PointInterface) => Unit | null): void {
        for (let x = 0; x < this.props.width; ++x) {
            for (let y = 0; y < this.props.height; ++y) {
                const point = { x, y };
                this.logic.set(point, callback(this.logic.get(point) ?? point));
            }
        }
    }
}

class AppMapProperties {
    public width: number = 10;
    public height: number = 5;
    public map: Map<string, Unit | null> = new Map();

    public constructor(
        public feature: AppMap
    ) {

    }
}

class AppMapLogic {

    public constructor(
        public feature: AppMap
    ) {

    }

    public get(point: PointInterface): Unit | null {
        const hash = this.serialize(point);
        return this.feature.props.map.get(hash) ?? null;
    }

    public set(point: PointInterface, unit: Unit | null): void {
        const hash = this.serialize(point);
        this.feature.props.map.set(hash, unit);
    }

    protected serialize(point: PointInterface): string {
        return `${point.x}_${point.y}`;
    }
}
