export type UnitAnimations = "none" | "idle" | "dying";

export class Unit {
    public static next_id = 0;
    public id: number = Unit.next_id++;
    public x: number = 0;
    public y: number = 0;
    public dead: boolean = false;
    public type: number = 0;
    public matching_neighbours: number = 0;

    public animation: UnitAnimations = "none";
    public animation_progress: number = 0;

    public constructor() {

    }

    public start_animation(name: UnitAnimations) {
        this.animation = name;
        this.animation_progress = 0;
    }
}