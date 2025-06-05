import { Align, ContainerOrientation } from "../enums";
import Widget from "../widgets/Widget";

/**
 * Base class for widgets that may contain child widgets.
 * Provides helpers for orientation-based processing.
 */
export default abstract class ContainerWidget extends Widget {
  constructor(
    align: Align = Align.alClient,
    displayable: boolean = true,
    protected children: Widget[] = []
  ) {
    super(align, displayable);
  }

  /** Returns direct children of this container. */
  public getChildren(): Widget[] {
    return this.children;
  }

  public abstract getOrientation(): ContainerOrientation;

  /**
   * Creates DOM element for this container according to its orientation.
   */
  public createDOM(cssClass: string[] = []): HTMLDivElement {
    const element = document.createElement("div");
    element.classList.add(...cssClass, this.getAlign());

    if (this.getOrientation() === ContainerOrientation.center) {
      this.children.forEach((child) => {
        if (element.firstChild) {
          throw new Error("More 1 element");
        }
        element.appendChild(child.createDOM());
      });
      return element;
    }

    const [start, end] =
      this.getOrientation() === ContainerOrientation.vertical
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
          const firstEnd = Array.from(element.children).find((node) =>
            node.classList.contains(end)
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
  public static sortWidgetsByOrientation(container: ContainerWidget): Widget[] {
    if (container.getOrientation() === ContainerOrientation.center) {
      return container.getChildren();
    }

    // Определяем порядок сортировки в зависимости от ориентации
    const order =
      container.getOrientation() === ContainerOrientation.vertical
        ? [Align.alTop, Align.alClient, Align.alBottom]
        : [Align.alLeft, Align.alClient, Align.alRight];

    // Группируем виджеты по align-у
    const grouped: Record<string, Widget[]> = {
      [order[0]]: [],
      [order[1]]: [],
      [order[2]]: [],
    };

    for (const widget of container.getChildren()) {
      const align = widget.getAlign();
      if (!(align in grouped)) {
        throw new Error(`Unexpected align: ${align}`);
      }
      grouped[align].push(widget);
    }

    // Переворачиваем первый бакет
    grouped[order[0]].reverse();

    // Собираем итоговый массив
    return order.flatMap((align) => grouped[align]);
  }
}
