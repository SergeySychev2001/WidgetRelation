import { Align, CssClasses } from "../enums";
import Widget from "./Widget"

export default class Header extends Widget {
    public createDOM(): HTMLDivElement {
        const el = document.createElement("div");
        el.classList.add(CssClasses.WIDGET, CssClasses.HEADER, this.getAlign());
        el.style.marginTop = `${this.getSpacing().get(Align.alTop) || 0}px`;
        el.style.marginRight = `${this.getSpacing().get(Align.alRight) || 0}px`;
        el.style.marginBottom = `${this.getSpacing().get(Align.alBottom) || 0}px`;
        el.style.marginLeft = `${this.getSpacing().get(Align.alLeft) || 0}px`;
        el.id = this.getIndex().toString();
        el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
        return el;
    };
}