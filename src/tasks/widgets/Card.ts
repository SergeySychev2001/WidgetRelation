import { CssClasses } from "../enums";
import Widget from "./Widget"

export default class Card extends Widget {
    public createDOM(): HTMLDivElement {
        const el = document.createElement("div");
        el.classList.add(CssClasses.WIDGET, CssClasses.CARD, this.getAlign());
        el.id = this.getIndex().toString();
        el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
        return el;
    };
}