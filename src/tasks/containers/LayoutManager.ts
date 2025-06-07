import Widget from "../widgets/Widget";
import ContainerWidget from "./ContainerWidget";
import { Align, Orientation, CssClasses } from "../enums";
import { Frame } from "../frames";
import { Header, ToolBar } from "../widgets";

export default class LayoutManager {
  private widget: Widget;
  private widgetRelations: Map<Widget, {
    parent: ContainerWidget,
    relations: WidgetRelations
  }> = new Map();

  constructor(widget: Widget) {
    this.widget = widget;
    this.widgetHighlighter();
  }

  public getWidgetRelations() {
    return this.widgetRelations;
  }

  public updateLayout() {
    this.clear();

    if (this.widget instanceof Frame) {
      this.initWidgetRelations(this.widget.getChildren()[0] as ContainerWidget);
      this.createWidgetRelationsByWidget(this.widget.getChildren()[0]);
    } else {
      this.initWidgetRelations(this.widget as ContainerWidget);
      this.createWidgetRelationsByWidget(this.widget);
    }
    this.createBorders();
  }

  public initWidgetRelations(containerWidget: ContainerWidget) {
    //TODO Добавить тут проврку на один alClient
    containerWidget.getChildren().forEach(i => {
      if (i instanceof ContainerWidget) {
        this.initWidgetRelations(i);
      } else {
        this.widgetRelations.set(i, { parent: containerWidget, relations: new WidgetRelations() })
      }
    })
  }

  // // Создание границ
  public createBorders() {
    for (const [widget] of this.widgetRelations) {
      if (widget instanceof ToolBar) {
        this.createBorderForToolBar(widget);
      } else if (widget instanceof Header) {
        this.createBorderForHeader(widget);
      }
    }
  }

  private createBorderForToolBar(toolbar: ToolBar) {
    if (toolbar.getOrientation() === Orientation.vertical) {
      const findedWidgetRelations = this.widgetRelations.get(toolbar);
      if (findedWidgetRelations) {
        this.checkWidgetIsOnceChildForParent(toolbar);
        if (findedWidgetRelations.relations.getLeftRelations().length) {
          findedWidgetRelations.parent.getBorders().set(Align.alLeft, true);
        }
        if (findedWidgetRelations.relations.getRightRelations().length) {
          findedWidgetRelations.parent.getBorders().set(Align.alRight, true);
        }
      }
    }
  }

  private createBorderForHeader(header: Header) {
    const findedWidgetRelations = this.widgetRelations.get(header);
    if (findedWidgetRelations) {
      this.checkWidgetIsOnceChildForParent(header);
      if (findedWidgetRelations.relations.getTopRelations().length) {
        findedWidgetRelations.parent.getBorders().set(Align.alTop, true);
      }
      if (findedWidgetRelations.relations.getBottomRelations().length) {
        findedWidgetRelations.parent.getBorders().set(Align.alBottom, true);
      }
    }
  }

  public checkWidgetIsOnceChildForParent(widget: Widget) {
    if (this.widgetRelations.get(widget)!.parent.getChildren().length > 1) {
      throw new Error("checkWidgetIsOnceChildForParent: More 1 child");
    }
  }

  // Создание связей
  public createWidgetRelationsByWidget(widget: Widget): void {
    if (
      widget instanceof ContainerWidget &&
      widget.getOrientation() !== Orientation.center
    ) {
      const sortedChildren = ContainerWidget.sortWidgetsByOrientation(widget);
      sortedChildren.forEach((child, idx) => {
        this.createWidgetRelationsByWidget(child);
        if (idx > 0) {
          this.createRelationsBetweenNeighbours(
            sortedChildren[idx - 1],
            sortedChildren[idx],
            widget.getOrientation()
          );
        }
      });
    }
  }

  private findEdgesWidgets(widget: Widget, align: Align): Widget[] {
    if (!(widget instanceof ContainerWidget)) {
      return [widget];
    }

    if (widget.getOrientation() === Orientation.center) {
      return widget.getChildren()[0]
        ? this.findEdgesWidgets(widget.getChildren()[0], align)
        : [];
    }

    const sortedChildren = ContainerWidget.sortWidgetsByOrientation(widget);

    const [start, end] =
      align === Align.alTop || align === Align.alBottom
        ? [Align.alLeft, Align.alRight]
        : [Align.alTop, Align.alBottom];

    const startSide = sortedChildren.filter((c) => c.getAlign() === start);
    const endSide = sortedChildren.filter((c) => c.getAlign() === end);

    const fromStart = startSide.reduce<Widget[]>(
      (acc, c) => acc.concat(this.findEdgesWidgets(c, align)),
      []
    );
    const al = this.getFirstAlignedWidgetByAlign(sortedChildren, align);
    const aligned = al ? this.findEdgesWidgets(al, align) : [];
    const fromEnd = endSide.reduce<Widget[]>(
      (acc, c) => acc.concat(this.findEdgesWidgets(c, align)),
      []
    );

    const edgeWidgets: Widget[] = [];
    edgeWidgets.push(...fromStart);
    edgeWidgets.push(...aligned);
    edgeWidgets.push(...fromEnd);
    return edgeWidgets;
  }

  // Надо найти первый попавшийся виджет по центральной оси
  private getFirstAlignedWidgetByAlign(sortedChildren: Widget[], align: Align): Widget | null {
    let reverseAlign: Align;
    switch (align) {
      case Align.alTop:
        reverseAlign = Align.alBottom;
        break
      case Align.alRight:
        reverseAlign = Align.alLeft;
        break
      case Align.alBottom:
        reverseAlign = Align.alTop;
        break
      case Align.alLeft:
        reverseAlign = Align.alRight;
        break
    }
    align === Align.alTop
      ? Align.alBottom
      : align === Align.alRight
        ? Align.alLeft
        : align === Align.alBottom
          ? Align.alTop
          : align === Align.alLeft && Align.alRight;

    const aligned = sortedChildren.filter((c) => c.getAlign() === align);
    const center = sortedChildren.filter((c) => c.getAlign() === Align.alClient);
    const reversed = sortedChildren.filter((c) => c.getAlign() === reverseAlign);

    switch (align) {
      case Align.alTop:
      case Align.alLeft:
        if (aligned.length) {
          return aligned[0];
        } else if (center.length) {
          return center[0];
        } else if (reversed.length) {
          return reversed[0];
        }
        break;
      case Align.alBottom:
      case Align.alRight:
        if (aligned.length) {
          return aligned[aligned.length - 1];
        } else if (center.length) {
          return center[center.length - 1];
        } else if (reversed.length) {
          return reversed[reversed.length - 1];
        }
        break;
    }
    return null;
  }

  private createRelationsBetweenNeighbours(
    widget: Widget,
    nextWidget: Widget,
    orientation: Orientation
  ): void {
    if (orientation === Orientation.center) {
      throw new Error("Enxpected case");
    }

    const topOrLeftNeighbours = this.findEdgesWidgets(
      widget,
      orientation === Orientation.vertical
        ? Align.alBottom
        : Align.alRight
    );
    const bottomOrRightNeighbours = this.findEdgesWidgets(
      nextWidget,
      orientation === Orientation.vertical ? Align.alTop : Align.alLeft
    );

    if (topOrLeftNeighbours.length && bottomOrRightNeighbours.length) {
      topOrLeftNeighbours.forEach((a) => {
        bottomOrRightNeighbours.forEach((b) => {
          if (orientation === Orientation.vertical) {
            this.widgetRelations.get(a)?.relations.getBottomRelations()
              .push(b);
            this.widgetRelations.get(b)?.relations.getTopRelations()
              .push(a);
          } else {
            this.widgetRelations.get(a)?.relations.getRightRelations()
              .push(b);
            this.widgetRelations.get(b)?.relations.getLeftRelations()
              .push(a);
          }
        });
      });
    }
  }

  public clear() {
    for (const [_, meta] of this.widgetRelations) {
      meta.parent.initBorders();
    }
    this.widgetRelations.clear();
  }

  private widgetHighlighter() {
    let primaryElem: HTMLElement | null = null;
    let secondaryElems: HTMLElement[] = [];

    const getWidgetFromWidgetRelations = (id: string) => {
      for (const [widget] of this.widgetRelations) {
        if (widget.getIndex().toString() === id) {
          return widget;
        }
      }
      return null;
    };

    const mouseOverHandler = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target && target.classList.contains(CssClasses.WIDGET)) {
        primaryElem = target as HTMLElement;
        const widget = getWidgetFromWidgetRelations(target.id);
        if (widget) {
          this.widgetRelations
            .get(widget)?.relations
            ?.getTopRelations()
            .forEach((i) => {
              const el = document.getElementById(i.getIndex().toString());
              if (el) secondaryElems.push(el as HTMLElement);
            });
          this.widgetRelations
            .get(widget)?.relations
            ?.getRightRelations()
            .forEach((i) => {
              const el = document.getElementById(i.getIndex().toString());
              if (el) secondaryElems.push(el as HTMLElement);
            });
          this.widgetRelations
            .get(widget)?.relations
            ?.getBottomRelations()
            .forEach((i) => {
              const el = document.getElementById(i.getIndex().toString());
              if (el) secondaryElems.push(el as HTMLElement);
            });
          this.widgetRelations
            .get(widget)?.relations
            ?.getLeftRelations()
            .forEach((i) => {
              const el = document.getElementById(i.getIndex().toString());
              if (el) secondaryElems.push(el as HTMLElement);
            });
        }
        if (primaryElem) primaryElem.classList.add(CssClasses.ACTIVE);
        secondaryElems.forEach((i) => i.classList.add(CssClasses.SUBACTIVE));
      }
    };

    const mouseOutHandler = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target === primaryElem) {
        primaryElem.classList.remove(CssClasses.ACTIVE);
        secondaryElems.forEach((i) => i.classList.remove(CssClasses.SUBACTIVE));
        primaryElem = null;
        secondaryElems = [];
      }
    };

    document.addEventListener("mouseover", mouseOverHandler);
    document.addEventListener("mouseout", mouseOutHandler);
  }
}

/** Stores relations to neighbouring widgets. */
class WidgetRelations {
  private topRelations: Widget[] = [];
  private rightRelations: Widget[] = [];
  private bottomRelations: Widget[] = [];
  private leftRelations: Widget[] = [];

  public getTopRelations(): Widget[] {
    return this.topRelations;
  }

  public getRightRelations(): Widget[] {
    return this.rightRelations;
  }

  public getBottomRelations(): Widget[] {
    return this.bottomRelations;
  }

  public getLeftRelations(): Widget[] {
    return this.leftRelations;
  }
}
