import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import Widget from "./Widget";

export default class VBoxContainer extends ContainerWidget {
  public sortChildren = (): Widget[] => {
    const topChildren: Widget[] = [];
    const centerChildren: Widget[] = [];
    const bottomChildren: Widget[] = [];

    for (let i = 0; i < this.getChildren().length; i++) {
      switch (this.getChildren()[i].getAlign()) {
        case Align.alTop:
          topChildren.push(this.getChildren()[i]);
          break;
        case Align.alClient:
          centerChildren.push(this.getChildren()[i]);
          break;
        case Align.alBottom:
          bottomChildren.push(this.getChildren()[i]);
          break;
        default: throw new Error("Unexpected case");
      }
    }

    return [...topChildren.reverse(), ...centerChildren, ...bottomChildren];
  }

  public createDOM = (): HTMLDivElement => {
    const el = document.createElement("div");
    el.classList.add(CssClasses.CONTAINER_V);
    el.classList.add(this.getAlign());

    for (const child of this.getChildren()) {
      switch (child.getAlign()) {
        case Align.alTop:
          if (el.firstChild) {
            el.insertBefore(child.createDOM(), el.firstChild);
          } else {
            el.appendChild(child.createDOM());
          }
          break;
        case Align.alClient: {
          let firstBottom: HTMLElement | null = null;
          for (const node of Array.from(el.children)) {
            if (node.classList.contains(Align.alBottom)) {
              firstBottom = node as HTMLElement;
              break;
            }
          }
          if (firstBottom) {
            el.insertBefore(child.createDOM(), firstBottom);
          } else {
            el.appendChild(child.createDOM());
          }
          break;
        }
        case Align.alBottom:
          el.appendChild(child.createDOM());
          break;
        default:
          throw new Error("Unexpected align");
      }
    }

    return el;
  };
}
