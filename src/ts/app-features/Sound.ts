import { App } from "../app/App";
import { get_element_by_query_selector } from "../utils/dom";

export class Sound {
    public elements: SoundElements;
    public props: SoundProperties;
    public listeners: SoundListeners;

    public constructor(
        public app: App
    ) {
        this.elements = new SoundElements(this);
        this.props = new SoundProperties(this);
        this.listeners = new SoundListeners(this);
    }

    public play(sound_name: string) {
        if (!this.props.sound_on) return;
        switch (sound_name) {
            case "over":
                this.elements.sound_over.currentTime = 0;
                this.elements.sound_over.play();
                break;
            case "win":
                this.elements.sound_win.currentTime = 0;
                this.elements.sound_win.play();
                break;
            case "select":
                this.elements.sound_select.currentTime = 0;
                this.elements.sound_select.play();
                break;
            default:
                throw new Error("Sound not found");
        }
    }
}

class SoundProperties {
    public music_on: boolean = false;
    public sound_on: boolean = true;
    public volume: number = 70;

    public constructor(
        public feature: Sound
    ) {
        this.volume = Number.parseInt(this.feature.elements.sound_volume.value);
    }
}

class SoundElements {
    public sound_toggle: HTMLButtonElement;
    public sound_toggle_state: HTMLSpanElement;
    public sound_volume: HTMLInputElement;

    public sound_win: HTMLAudioElement;
    public sound_select: HTMLAudioElement;
    public sound_over: HTMLAudioElement;

    public constructor(
        public feature: Sound
    ) {
        this.sound_toggle = get_element_by_query_selector(document, '#sound-toggle', HTMLButtonElement);
        this.sound_toggle_state = get_element_by_query_selector(this.sound_toggle, '.state', HTMLSpanElement);
        this.sound_volume = get_element_by_query_selector(document, '#sound-volume', HTMLInputElement);
        this.sound_win = get_element_by_query_selector(document, '#sound-win', HTMLAudioElement);
        this.sound_select = get_element_by_query_selector(document, '#sound-select', HTMLAudioElement);
        this.sound_over = get_element_by_query_selector(document, '#sound-over', HTMLAudioElement);
    }
}

class SoundListeners {
    public constructor(
        public feature: Sound
    ) {
        this.feature.elements.sound_toggle.addEventListener('click', this.on_sound_toggle);
        this.feature.elements.sound_volume.addEventListener('input', this.on_sound_volume_change);
    }

    protected on_sound_volume_change = () => {
        this.feature.props.volume = Number.parseInt(this.feature.elements.sound_volume.value);
        const volume = this.feature.props.volume / 100;
        this.feature.elements.sound_win.volume = volume;
        this.feature.elements.sound_select.volume = volume;
        this.feature.elements.sound_over.volume = volume;
        // this.feature.elements.sound_win.volume = this.feature.props.volume / 100;
    }

    protected on_sound_toggle = () => {
        this.feature.props.sound_on = !this.feature.props.sound_on;
        if (this.feature.props.sound_on) {
            this.feature.elements.sound_toggle_state.innerText = "On";
        } else {
            this.feature.elements.sound_toggle_state.innerText = "Off";
        }
    }
}