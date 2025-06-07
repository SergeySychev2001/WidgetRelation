import { CssClasses } from "../enums";
import Widget from "./Widget"

export default class Header extends Widget {
    public createDOM(): HTMLDivElement {
        const el = document.createElement("div");
        el.classList.add(CssClasses.WIDGET, CssClasses.HEADER, this.getAlign());
        el.id = this.getIndex().toString();
        el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
        return el;
    };
}