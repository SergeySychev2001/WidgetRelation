import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";

export default class HBoxContainer extends ContainerWidget {

    public createDOM = (): HTMLDivElement => {
        const el = document.createElement('div');
        el.classList.add(CssClasses.CONTAINER);
        el.classList.add(CssClasses.CONTAINER_H);
        el.classList.add(this.getAlign());
        this.getChildren().forEach(i => {
            switch (i.getAlign()) {
                case Align.alLeft:
                    if (el.firstChild) {
                        el.insertBefore(i.createDOM(), el.firstChild);
                    } else {
                        el.appendChild(i.createDOM());
                    }
                    break;
                case Align.alClient:
                    let firstRightChild: HTMLElement | null = null;

                    for (let i = 0; i < el.childNodes.length; i++) {
                        const child = el.childNodes.item(i);
                        if (!(child instanceof HTMLElement)) throw new Error("Invalid Type");
                        if (child.classList.contains(Align.alRight)) {
                            firstRightChild = child;
                            break;
                        }
                    }

                    if (firstRightChild) {
                        el.insertBefore(i.createDOM(), firstRightChild);
                    } else {
                        el.appendChild(i.createDOM());
                    }

                    break;
                case Align.alRight:
                    el.appendChild(i.createDOM());
                    break;
                default: throw new Error("Unexpected case");
            }
        });
        return el;
    }

}