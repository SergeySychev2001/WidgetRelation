import { Align, ContainerOrientation } from "../enums";
import Widget from "./Widget";

/**
 * Base class for widgets that may contain child widgets.
 * Provides helpers for orientation-based processing.
 */
export default abstract class ContainerWidget extends Widget {
  constructor(
    align: Align = Align.alClient,
    displayable: boolean = true,
    protected children: Widget[] = [],
  ) {
    super(align, displayable);
  }

  /** Returns direct children of this container. */
  public getChildren(): Widget[] {
    return this.children;
  }

  /** Sort children according to container-specific rules. */
  public abstract sortChildren(): Widget[];

  /**
   * Creates DOM element for this container according to its orientation.
   */
  protected createDOMByOrientation(
    orientation: ContainerOrientation,
    cssClass: string,
  ): HTMLDivElement {
    const element = document.createElement("div");
    element.classList.add(cssClass, this.getAlign());

    if (orientation === ContainerOrientation.center) {
      this.children.forEach(child => {
        if (element.firstChild) {
          throw new Error("More 1 element");
        }
        element.appendChild(child.createDOM());
      });
      return element;
    }

    const [start, end] =
      orientation === ContainerOrientation.vertical
        ? [Align.alTop, Align.alBottom]
        : [Align.alLeft, Align.alRight];

    for (const child of this.children) {
      switch (child.getAlign()) {
        case start:
          if (element.firstChild) {
            element.insertBefore(child.createDOM(), element.firstChild);
          } else {
            element.appendChild(child.createDOM());
          }
          break;
        case Align.alClient: {
          const firstEnd = Array.from(element.children).find(node =>
            node.classList.contains(end),
          );
          if (firstEnd) {
            element.insertBefore(child.createDOM(), firstEnd);
          } else {
            element.appendChild(child.createDOM());
          }
          break;
        }
        case end:
          element.appendChild(child.createDOM());
          break;
        default:
          throw new Error("Unexpected align");
      }
    }

    return element;
  }

  /** Sort widgets by the given orientation. */
  public static sortWidgetsByOrientation(
    widgets: Widget[],
    orientation: ContainerOrientation,
  ): Widget[] {
    if (orientation === ContainerOrientation.center) {
      return widgets;
    }

    const order =
      orientation === ContainerOrientation.vertical
        ? [Align.alTop, Align.alClient, Align.alBottom]
        : [Align.alLeft, Align.alClient, Align.alRight];

    const buckets = new Map(order.map(a => [a, [] as Widget[]]));

    widgets.forEach(w => {
      const bucket = buckets.get(w.getAlign());
      if (!bucket) {
        throw new Error("Unexpected case");
      }
      bucket.push(w);
    });

    (buckets.get(order[0]) as Widget[]).reverse();

    return order.reduce<Widget[]>((acc, a) => {
      const arr = buckets.get(a) as Widget[];
      return acc.concat(arr);
    }, []);
  }
}
