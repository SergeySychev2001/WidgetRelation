import { LayoutManager } from "../containers";
import { Align, Orientation, CssClasses } from "../enums";
import { Widget } from "../widgets";

export default class Frame extends Widget {
  private layoutManager: LayoutManager;
  private children: Widget[];

  constructor(
    align: Align = Align.alClient,
    displayable: boolean = true,
    children: Widget[] = []
  ) {
    super(align, displayable);
    this.children = children;
    this.layoutManager = new LayoutManager();
  }

  public getChildren() {
    return this.children;
  }

  public getLayoutManager() {
    return this.layoutManager;
  }

  public updateLayout() {
    this.layoutManager.clear();
    this.layoutManager.createWidgetRelationsByWidget(this.children[0]);
  }

  protected getOrientation(): Orientation {
    return Orientation.center;
  }

  public createDOM(): HTMLDivElement {
    const el = document.createElement("div");
    switch (this.getOrientation()) {
      case Orientation.center:
        el.classList.add(CssClasses.FRAME);
        break;
      case Orientation.vertical:
        el.classList.add(CssClasses.FRAME_V);
        break;
      case Orientation.horizontal:
        el.classList.add(CssClasses.FRAME_H);
        break;
      default:
        throw new Error("Unexpected case");
    }
    if (!this.isDisplayable()) {
      el.classList.add(CssClasses.DISABLED);
    }

    if (this.getOrientation() === Orientation.center) {
      this.children.forEach((child) => {
        if (el.firstChild) {
          throw new Error("More 1 element");
        }
        el.appendChild(child.createDOM());
      });
      return el;
    } else {
      const [start, end] =
        this.getOrientation() === Orientation.vertical
          ? [Align.alTop, Align.alBottom]
          : [Align.alLeft, Align.alRight];

      for (const child of this.children) {
        switch (child.getAlign()) {
          case start:
            if (el.firstChild) {
              el.insertBefore(child.createDOM(), el.firstChild);
            } else {
              el.appendChild(child.createDOM());
            }
            break;
          case Align.alClient: {
            const firstEnd = Array.from(el.children).find((node) =>
              node.classList.contains(end)
            );
            if (firstEnd) {
              el.insertBefore(child.createDOM(), firstEnd);
            } else {
              el.appendChild(child.createDOM());
            }
            break;
          }
          case end:
            el.appendChild(child.createDOM());
            break;
          default:
            throw new Error("Unexpected align");
        }
      }

      return el;
    }
  }
}
