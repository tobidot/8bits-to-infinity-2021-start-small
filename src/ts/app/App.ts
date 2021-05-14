import { AppView } from "../app-features/AppView";
import { Unit } from "../app-models/Unit";
import { AppElements } from "./AppElements";
import { AppFeatureCollection } from "./AppFeatureCollection";
import { AppPropertyCollection, default_properties } from "./AppPropertyCollection";

export class App {
    public elements: AppElements;
    public properties: AppPropertyCollection;
    public features: AppFeatureCollection;

    constructor() {
        this.elements = new AppElements(this);
        this.properties = default_properties(this.elements);
        this.features = {
            view: new AppView(this),
        };

        let x: Unit;
        this.properties.units.push(x = new Unit());
        this.properties.units.push(x = new Unit());
        x.x = 1;
        this.properties.units.push(x = new Unit());
        x.y = 1;
    }
}

