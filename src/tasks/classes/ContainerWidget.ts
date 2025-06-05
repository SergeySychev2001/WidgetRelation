import { Align, ContainerOrientation } from "../enums";
import Widget from "./Widget";

export default abstract class ContainerWidget extends Widget {
  private children: Widget[];

  constructor(
    align: Align = Align.alClient,
    displayable: boolean = true,
    children: Widget[] = [],
  ) {
    super(align, displayable);
    this.children = children;
  }

  public getChildren() {
    return this.children;
  }

  public abstract sortChildren(): void;

  public static sortWidgetsByOrientation(widgets: Widget[], orientation: ContainerOrientation) {
    if (orientation === ContainerOrientation.vertical) {
      const topChildren: Widget[] = [];
      const centerChildren: Widget[] = [];
      const bottomChildren: Widget[] = [];

      for (let i = 0; i < widgets.length; i++) {
        switch (widgets[i].getAlign()) {
          case Align.alTop:
            topChildren.push(widgets[i]);
            break;
          case Align.alClient:
            centerChildren.push(widgets[i]);
            break;
          case Align.alBottom:
            bottomChildren.push(widgets[i]);
            break;
          default: throw new Error("Unexpected case");
        }
      }

      return [...topChildren.reverse(), ...centerChildren, ...bottomChildren];
    } else if (orientation === ContainerOrientation.horizontal) {
      const leftChildren: Widget[] = [];
      const centerChildren: Widget[] = [];
      const rightChildren: Widget[] = [];

      for (let i = 0; i < widgets.length; i++) {
        switch (widgets[i].getAlign()) {
          case Align.alLeft:
            leftChildren.push(widgets[i]);
            break;
          case Align.alClient:
            centerChildren.push(widgets[i]);
            break;
          case Align.alRight:
            rightChildren.push(widgets[i]);
            break;
          default: throw new Error("Unexpected case");
        }
      }

      return [...leftChildren.reverse(), ...centerChildren, ...rightChildren];
    } else if (orientation === ContainerOrientation.center) {
      return widgets;
    } else {
      throw new Error("Enxpected case");
    }
  }
}
