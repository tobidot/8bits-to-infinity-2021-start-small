import { AppView } from "../app-features/AppView";
import { AppViewTarget } from "../app-properties/AppViewTarget";
import { Units } from "../app-properties/Units";
import { thorw_expression } from "../utils/flow";
import { App } from "./App";
import { AppElements } from "./AppElements";

export interface AppPropertyCollection extends
    AppViewTarget,
    Units {
}

export function default_properties(elements: AppElements): AppPropertyCollection {
    return {
        context: elements.canvas.getContext("2d") ?? thorw_expression("unable to get context"),
        units: [],
    };
}
