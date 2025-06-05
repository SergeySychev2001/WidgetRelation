import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";

export default class HBoxContainer extends ContainerWidget {
  public createDOM = (): HTMLDivElement => {
    const el = document.createElement("div");
    el.classList.add(CssClasses.CONTAINER);
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
