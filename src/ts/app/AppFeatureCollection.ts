import { AppMap } from "../app-features/AppMap";
import { AppView } from "../app-features/AppView";
import { GamePlay } from "../app-features/GamePlay";
import { LevelSelect } from "../app-features/LevelSelect";
import { Music } from "../app-features/Music";
import { Sound } from "../app-features/Sound";

export interface AppFeatureCollection {
    view: AppView;
    map: AppMap;
    gameplay: GamePlay;
    music: Music;
    sound: Sound;
    levels: LevelSelect;
}