import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";

/** Basic widget element. */
export default class Widget {
  private static INDEX = 0;
  private align: Align;
  private displayable: boolean;
  private index: number;
  private spacing: Map<Align, number> = new Map();

  constructor(align: Align = Align.alClient, displayable: boolean = true) {
    this.align = align;
    this.displayable = displayable;
    this.index = ++Widget.INDEX;
  }

  /** Indicates whether this widget should be displayed. */
  public isDisplayable(): boolean {
    return this.displayable;
  }

  /** Returns alignment of this widget inside its parent. */
  public getAlign(): Align {
    return this.align;
  }

  /** Sets widget alignment. */
  public setAlign(align: Align): void {
    this.align = align;
  }

  /** Returns widget identifier. */
  public getIndex(): number {
    return this.index;
  }

  public getSpacing() {
    return this.spacing;
  }

  public setSpacing(spacing: Map<Align, number>) {
    this.spacing = spacing;
  }

  /** Creates DOM representation of widget. */
  public createDOM(): HTMLDivElement {
    const el = document.createElement("div");
    el.classList.add(CssClasses.WIDGET, this.getAlign());
    if (!this.displayable) {
      el.classList.add(CssClasses.DISABLED);
    }
    el.style.marginTop = `${this.getSpacing().get(Align.alTop) || 0}px`;
    el.style.marginRight = `${this.getSpacing().get(Align.alRight) || 0}px`;
    el.style.marginBottom = `${this.getSpacing().get(Align.alBottom) || 0}px`;
    el.style.marginLeft = `${this.getSpacing().get(Align.alLeft) || 0}px`;
    el.id = this.getIndex().toString();
    el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
    return el;
  };
}
