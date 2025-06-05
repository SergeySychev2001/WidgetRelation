import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";

export default class VBoxContainer extends ContainerWidget {
  public createDOM = (): HTMLDivElement => {
    const el = document.createElement("div");
    el.classList.add(CssClasses.CONTAINER);
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
