import { App } from "../app/App";
import { get_element_by_query_selector } from "../utils/dom";

export class Music {
    public elements: MusicElements;
    public props: MusicProperties;
    public listeners: MusicListeners;

    public constructor(
        public app: App
    ) {
        this.elements = new MusicElements(this);
        this.props = new MusicProperties(this);
        this.listeners = new MusicListeners(this);
    }

}

class MusicProperties {
    public on: boolean = false;
    public volume: number = 70;

    public constructor(
        public feature: Music
    ) {
        this.volume = Number.parseInt(this.feature.elements.music_volume.value);
    }
}

class MusicElements {
    public music_toggle: HTMLButtonElement;
    public music_toggle_state: HTMLSpanElement;
    public music_volume: HTMLInputElement;
    public music: HTMLAudioElement;

    public constructor(
        public feature: Music
    ) {
        this.music_toggle = get_element_by_query_selector(document, '#music-toggle', HTMLButtonElement);
        this.music_toggle_state = get_element_by_query_selector(this.music_toggle, '.state', HTMLSpanElement);
        this.music_volume = get_element_by_query_selector(document, '#music-volume', HTMLInputElement);
        this.music = get_element_by_query_selector(document, '#music', HTMLAudioElement);
    }
}

class MusicListeners {
    public constructor(
        public feature: Music
    ) {
        this.feature.elements.music_toggle.addEventListener('click', this.on_music_toggle);
        this.feature.elements.music_volume.addEventListener('input', this.on_music_volume_change);
    }

    protected on_music_volume_change = () => {
        this.feature.props.volume = Number.parseInt(this.feature.elements.music_volume.value);
        this.feature.elements.music.volume = this.feature.props.volume / 100;
    }

    protected on_music_toggle = () => {
        this.feature.props.on = !this.feature.props.on;
        if (this.feature.props.on) {
            this.feature.elements.music.play();
            this.feature.elements.music_toggle_state.innerText = "On";
        } else {
            this.feature.elements.music.pause();
            this.feature.elements.music_toggle_state.innerText = "Off";
        }
    }
}