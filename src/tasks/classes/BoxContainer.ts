import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";

export default class BoxContainer extends ContainerWidget {
    public sortChildren = () => {
        return this.getChildren();
    }
    public createDOM = (): HTMLDivElement => {
        const el = document.createElement("div");
        el.classList.add(CssClasses.CONTAINER);
        el.classList.add(this.getAlign());

        for (const child of this.getChildren()) {
            if (el.firstChild) throw new Error("More 1 element");
            el.appendChild(child.createDOM());
        }

        return el;
    };
}