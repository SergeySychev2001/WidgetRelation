import { Align, CssClasses, Orientation } from "../enums";
import Widget from "../widgets/Widget";

/**
 * Base class for widgets that may contain child widgets.
 * Provides helpers for orientation-based processing.
 */
export default abstract class ContainerWidget extends Widget {
  private borders: Map<Align, boolean> = new Map();

  constructor(
    align: Align = Align.alClient,
    displayable: boolean = true,
    protected children: Widget[] = []
  ) {
    super(align, displayable);
    this.initBorders();
  }

  /** Returns direct children of this container. */
  public getChildren(): Widget[] {
    return this.children;
  }

  public getBorders() {
    return this.borders;
  }

  public initBorders() {
    this.borders.set(Align.alTop, false);
    this.borders.set(Align.alRight, false);
    this.borders.set(Align.alBottom, false);
    this.borders.set(Align.alLeft, false);
  }

  public abstract getOrientation(): Orientation;

  /**
   * Creates DOM element for this container according to its orientation.
   */
  public createDOM(cssClass: string[] = []): HTMLDivElement {
    const element = document.createElement("div");
    element.classList.add(...cssClass, this.getAlign());

    element.classList.add(CssClasses.CONTAINER_BORDER);
    if (this.getBorders().get(Align.alTop)) element.classList.add(CssClasses.CONTAINER_BORDER_TOP);
    if (this.getBorders().get(Align.alRight)) element.classList.add(CssClasses.CONTAINER_BORDER_RIGHT);
    if (this.getBorders().get(Align.alBottom)) element.classList.add(CssClasses.CONTAINER_BORDER_BOTTOM);
    if (this.getBorders().get(Align.alLeft)) element.classList.add(CssClasses.CONTAINER_BORDER_LEFT);

    if (this.getOrientation() === Orientation.center) {
      this.children.forEach((child) => {
        if (element.firstChild) {
          throw new Error("More 1 element");
        }
        element.appendChild(child.createDOM());
      });
      return element;
    }

    const [start, end] =
      this.getOrientation() === Orientation.vertical
        ? [Align.alTop, Align.alBottom]
        : [Align.alLeft, Align.alRight];

    for (const child of this.children) {
      if (child.isDisplayable()) {
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
    }

    return element;
  }

  /** Sort widgets by the given orientation. */
  public static sortWidgetsByOrientation(container: ContainerWidget): Widget[] {
    if (container.getOrientation() === Orientation.center) {
      return container.getChildren().filter(i => i.isDisplayable());
    }

    // Определяем порядок сортировки в зависимости от ориентации
    const order =
      container.getOrientation() === Orientation.vertical
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
      if (widget.isDisplayable()) grouped[align].push(widget);
    }

    // Переворачиваем первый бакет
    grouped[order[0]].reverse();

    // Собираем итоговый массив
    return order.flatMap((align) => grouped[align]);
  }
}
