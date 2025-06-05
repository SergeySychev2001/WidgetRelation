import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";

/** Basic widget element. */
export default class Widget {
  private static INDEX = 0;
  private align: Align;
  private displayable: boolean;
  private index: number;

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

  /** Creates DOM representation of widget. */
  public createDOM = (): HTMLDivElement => {
    const el = document.createElement("div");
    el.classList.add(CssClasses.WIDGET, this.getAlign());
    if (!this.displayable) {
      el.classList.add(CssClasses.DISABLED);
    }
    el.innerText = `id: ${this.getIndex()}; al: ${this.getAlign()}`;
    return el;
  };
}
