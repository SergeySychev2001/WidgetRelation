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
        el.style.marginTop = `${this.getSpacing().get(Align.alTop) || 0}px`;
        el.style.marginRight = `${this.getSpacing().get(Align.alRight) || 0}px`;
        el.style.marginBottom = `${this.getSpacing().get(Align.alBottom) || 0}px`;
        el.style.marginLeft = `${this.getSpacing().get(Align.alLeft) || 0}px`;
        el.id = this.getIndex().toString();
        el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
        return el;
    };
}