import { App } from "../app/App";

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
}

class LevelSelectElements {
    public constructor(
        public feature: LevelSelect
    ) {

    }
}

class LevelSelectProperties {
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

}

class LevelSelectListeners {
    public constructor(
        public feature: LevelSelect
    ) {

    }

}