import { App } from "./ts/app/App";

declare global {
    interface Window {
        app: App,
    }
}

window.app = new App();