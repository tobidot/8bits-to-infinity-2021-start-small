import { App } from "./App";
import { get_element_by_query_selector } from "../utils/dom";

export class AppElements {
    public canvas: HTMLCanvasElement;

    public constructor(
        public app: App
    ) {
        this.canvas = get_element_by_query_selector(document, '#app', HTMLCanvasElement);
    }
}