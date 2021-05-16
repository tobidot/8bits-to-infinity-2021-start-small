import { App } from "../app/App";
import { get_element_by_query_selector } from "../utils/dom";

export class LevelSelect {
    public elements: LevelSelectElements;
    public props: LevelSelectProperties;
    public logic: LevelSelectLogic;
    public listeners: LevelSelectListeners;

    public constructor(
        public app: App
    ) {
        this.elements = new LevelSelectElements(this);
        this.props = new LevelSelectProperties(this);
        this.logic = new LevelSelectLogic(this);
        this.listeners = new LevelSelectListeners(this);
    }

    public load(level: number) {
        this.logic.load_level(level);
    }

    public reload() {
        this.logic.reload_level();
    }
}

class LevelSelectElements {
    public set: HTMLElement;
    public random_level: HTMLButtonElement;
    public select_level: HTMLButtonElement;
    public close_popup: HTMLButtonElement;
    public popup: HTMLElement;

    public constructor(
        public feature: LevelSelect
    ) {
        this.set = get_element_by_query_selector(document, '#set', HTMLElement);
        this.select_level = get_element_by_query_selector(document, '#select-level', HTMLButtonElement);
        this.popup = get_element_by_query_selector(document, '#level-select-popup');
        this.close_popup = get_element_by_query_selector(this.popup, '.close-button', HTMLButtonElement);
        this.random_level = get_element_by_query_selector(document, '#new-random-level', HTMLButtonElement);
    }
}

class LevelSelectProperties {
    public selected_level: number | null = null;
    public level_width: number = 3;
    public level_height: number = 3;
    public level_map: string = ".........";
    public level_set: string = ".";

    public constructor(
        public feature: LevelSelect
    ) {

    }

}

class LevelSelectLogic {
    public constructor(
        public feature: LevelSelect
    ) {

    }

    public load_random_level() {
        const width = 20;
        const height = 15;
        const set = "123456789";
        const map = [...new Array(width * height)].map(() => {
            return set.charAt(Math.floor(Math.random() * set.length));
        }).join('');
        this.feature.props.selected_level = null;
        this.feature.props.level_width = width;
        this.feature.props.level_height = height;
        this.feature.props.level_map = map;
        this.feature.props.level_set = set;

        this.feature.elements.popup.classList.add('js-hidden');
        this.reload_level();
    }

    public load_level(level: number) {
        if (level === 0) return this.load_random_level();
        const query_selector = '[data-level="' + level.toString() + '"]';
        if (this.feature.elements.popup.querySelector(query_selector) === null) return this.load_random_level();
        const level_element = get_element_by_query_selector(this.feature.elements.popup, query_selector);
        const width = Number.parseInt(level_element.getAttribute('data-width') ?? '');
        const height = Number.parseInt(level_element.getAttribute('data-height') ?? '');
        const map = get_element_by_query_selector(level_element, '.map').innerText.replaceAll(/\s/g, '').toUpperCase();
        const set = get_element_by_query_selector(level_element, '.set').innerText.replaceAll(/\s/g, '').toUpperCase();
        this.feature.props.selected_level = level;
        this.feature.props.level_width = width;
        this.feature.props.level_height = height;
        this.feature.props.level_map = map;
        this.feature.props.level_set = set;

        this.feature.elements.popup.classList.add('js-hidden');
        this.reload_level();
    }

    public reload_level() {
        this.feature.app.features.gameplay.props.game_over = false;
        this.feature.app.props.units = [];
        this.feature.app.features.map.clear();
        this.feature.app.features.gameplay.props.moves = 0;
        this.feature.app.features.gameplay.props.score = 0;
        this.feature.app.features.map.props.width = this.feature.props.level_width;
        this.feature.app.features.map.props.height = this.feature.props.level_height;
        const set = this.feature.app.features.gameplay.props.current_set = this.feature.props.level_set.split('');
        this.feature.elements.set.innerHTML = [[...set], [...set]].map((set) => {
            return "<div class='set__instance'>" + set.map((symbol) => {
                return "<span>" + symbol + "</span>";
            }).join('') + "</div>";
        }).join('');
        this.feature.props.level_map.split('').forEach((value: string, index: number) => {
            const unit_type = this.feature.app.features.gameplay.props.current_set.indexOf(value);
            const x = index % this.feature.props.level_width;
            const y = Math.floor(index / this.feature.props.level_width);
            this.feature.app.features.map.create_unit_at(unit_type, { x, y });
        });
        this.feature.app.features.gameplay.check_and_strike();
    }
}

class LevelSelectListeners {
    public constructor(
        public feature: LevelSelect
    ) {
        this.feature.elements.popup.addEventListener('click', this.on_select_level);
        this.feature.elements.select_level.addEventListener('click', this.on_open_popup);
        this.feature.elements.close_popup.addEventListener('click', this.on_close_popup);
        this.feature.elements.random_level.addEventListener('click', this.on_new_random_level);
        window.addEventListener('keydown', this.on_key_down);
    }

    protected on_key_down = (event: KeyboardEvent) => {
        if (event.key === "Escape") this.feature.logic.reload_level();

        if (event.key === "Enter") {
            if (this.feature.props.selected_level === null) {
                this.feature.logic.load_random_level();
            } else {
                this.feature.load(this.feature.props.selected_level + 1);
            }
        }
    }

    protected on_new_random_level = () => {
        this.feature.load(0);
    }

    protected on_select_level = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.hasAttribute('data-level')) return;
        const level = Number.parseInt(target.getAttribute('data-level') ?? '');
        this.feature.load(level);
    }

    protected on_open_popup = () => {
        this.feature.elements.popup.classList.remove('js-hidden');
    }

    protected on_close_popup = () => {
        this.feature.elements.popup.classList.add('js-hidden');
    }
}