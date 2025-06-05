import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";

export default class VBoxContainer extends ContainerWidget {

    // public sortChildren(): Widget[] {
    //     const topChildren: Widget[] = [];
    //     const centerChildren: Widget[] = [];
    //     const bottomChildren: Widget[] = [];

    //     this.getChildren().forEach(i => {
    //         switch (i.getAlign()) {
    //             case Align.alTop:
    //                 topChildren.push(i);
    //                 break;
    //             case Align.alClient:
    //                 centerChildren.push(i);
    //                 break;
    //             case Align.alBottom:
    //                 bottomChildren.push(i);
    //                 break;
    //             default: throw new Error("Unexpected case");
    //         }
    //     });

    //     return [...topChildren, ...centerChildren, ...bottomChildren];
    // }

    public createDOM = (): HTMLDivElement => {
        const el = document.createElement('div');
        el.classList.add(CssClasses.CONTAINER);
        el.classList.add(CssClasses.CONTAINER_V);
        el.classList.add(this.getAlign());
        this.getChildren().forEach(i => {
            switch (i.getAlign()) {
                case Align.alTop:
                    if (el.firstChild) {
                        el.insertBefore(i.createDOM(), el.firstChild);
                    } else {
                        el.appendChild(i.createDOM());
                    }
                    break;
                case Align.alClient:
                    let firstBottomChild: HTMLElement | null = null;

                    for (let i = 0; i < el.childNodes.length; i++) {
                        const child = el.childNodes.item(i);
                        if (!(child instanceof HTMLElement)) throw new Error("Invalid Type");
                        if (child.classList.contains(Align.alBottom)) {
                            console.log(firstBottomChild)
                            firstBottomChild = child;
                            break;
                        }
                    }

                    if (firstBottomChild) {
                        el.insertBefore(i.createDOM(), firstBottomChild);
                    } else {
                        el.appendChild(i.createDOM());
                    }

                    break;
                case Align.alBottom:
                    el.appendChild(i.createDOM());
                    break;
                default: throw new Error("Unexpected case");
            }
        });
        return el;
    }

}