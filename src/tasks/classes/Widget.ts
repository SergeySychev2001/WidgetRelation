import { Align } from "../enums";
import CssClasses from "../enums/CssClasses";

export default class Widget {
    private static INDEX: number = 0;
    private align: Align;
    private displayable: boolean;

    constructor(align: Align = Align.alClient, displayable: boolean = true) {
        this.align = align;
        this.displayable = displayable;
    }

    public isDisplayable(): boolean {
        return this.displayable;
    }

    public getAlign() {
        return this.align;
    }

    public setAlign(align: Align) {
        this.align = align;
    }

    public createDOM = (): HTMLDivElement => {
        const el = document.createElement('div');
        el.classList.add(CssClasses.WIDGET);
        el.classList.add(this.getAlign());
        el.innerText = `id: ${++Widget.INDEX}; al: ${this.getAlign()}`;
        return el;
    }
}