import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import Widget from "./Widget";

export default class HBoxContainer extends ContainerWidget {
  public sortChildren = (): Widget[] => {
    const leftChildren: Widget[] = [];
    const centerChildren: Widget[] = [];
    const rightChildren: Widget[] = [];

    for (let i = 0; i < this.getChildren().length; i++) {
      switch (this.getChildren()[i].getAlign()) {
        case Align.alLeft:
          leftChildren.push(this.getChildren()[i]);
          break;
        case Align.alClient:
          centerChildren.push(this.getChildren()[i]);
          break;
        case Align.alRight:
          rightChildren.push(this.getChildren()[i]);
          break;
        default: throw new Error("Unexpected case");
      }
    }

    return [...leftChildren.reverse(), ...centerChildren, ...rightChildren];
  }

  public createDOM = (): HTMLDivElement => {
    const el = document.createElement("div");
    el.classList.add(CssClasses.CONTAINER_H);
    el.classList.add(this.getAlign());

    for (const child of this.getChildren()) {
      switch (child.getAlign()) {
        case Align.alLeft:
          if (el.firstChild) {
            el.insertBefore(child.createDOM(), el.firstChild);
          } else {
            el.appendChild(child.createDOM());
          }
          break;
        case Align.alClient: {
          let firstRight: HTMLElement | null = null;
          for (const node of Array.from(el.children)) {
            if (node.classList.contains(Align.alRight)) {
              firstRight = node as HTMLElement;
              break;
            }
          }
          if (firstRight) {
            el.insertBefore(child.createDOM(), firstRight);
          } else {
            el.appendChild(child.createDOM());
          }
          break;
        }
        case Align.alRight:
          el.appendChild(child.createDOM());
          break;
        default:
          throw new Error("Unexpected align");
      }
    }

    return el;
  };
}
