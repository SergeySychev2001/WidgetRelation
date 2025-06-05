import { Align } from "../enums";
import Widget from "./Widget";

export default abstract class ContainerWidget extends Widget {
    private children: Widget[];

    constructor(align: Align = Align.alClient, displayable: boolean = true, children: Widget[] = []) {
        super(align, displayable);
        this.children = children;
    }

    public getChildren() {
        return this.children;
    }

    // public abstract sortChildren(): Widget[];
}