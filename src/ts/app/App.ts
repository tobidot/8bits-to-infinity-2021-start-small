import { AppMap } from "../app-features/AppMap";
import { AppView } from "../app-features/AppView";
import { GamePlay } from "../app-features/GamePlay";
import { Music } from "../app-features/Music";
import { Sound } from "../app-features/Sound";
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
            map: new AppMap(this),
            gameplay: new GamePlay(this),
            music: new Music(this),
            sound: new Sound(this),
        };
        this.features.gameplay.logic.restart();

    }
}

