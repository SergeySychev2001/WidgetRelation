import { Align, CssClasses, Orientation } from "../enums";
import Widget from "./Widget"

export default class ToolBar extends Widget {
    private orientation: Orientation;

    constructor(align: Align = Align.alClient, displayable: boolean = true, orientation: Orientation) {
        super(align, displayable);
        this.orientation = orientation;
    }

    public getOrientation() {
        return this.orientation;
    }

    public createDOM(): HTMLDivElement {
        const el = document.createElement("div");
        el.classList.add(CssClasses.WIDGET, CssClasses.TOOLBAR, this.getAlign());
        el.id = this.getIndex().toString();
        el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
        return el;
    };
}