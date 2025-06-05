import Widget from "./Widget";
import ContainerWidget from "./ContainerWidget";
import { Align, ContainerOrientation } from "../enums";
import BoxContainer from "./BoxContainer";
import HBoxContainer from "./HBoxContainer";
import VBoxContainer from "./VBoxContainer";
import { getOrCreate } from "../utils";

/**
 * Builds relations between widgets so that each widget knows
 * its neighbors in all four directions.
 */
export default class LayoutManager {
  private widgetRelations: Map<Widget, WidgetRelations> = new Map();

  public getWidgetRelations(): Map<Widget, WidgetRelations> {
    return this.widgetRelations;
  }

  private getOrientation(container: ContainerWidget): ContainerOrientation {
    if (container instanceof BoxContainer) {
      return ContainerOrientation.center;
    }
    if (container instanceof HBoxContainer) {
      return ContainerOrientation.horizontal;
    }
    if (container instanceof VBoxContainer) {
      return ContainerOrientation.vertical;
    }
    throw new Error("Unexpected case");
  }

  public createWidgetRelationsByWidget(widget: Widget): void {
    if (widget instanceof ContainerWidget) {
      const orientation = this.getOrientation(widget);
      const children = widget.getChildren();

      if (orientation === ContainerOrientation.center) {
        if (children.length) {
          this.widgetRelations.set(children[0], new WidgetRelations());
        }
        return;
      }

      const sortedChildren = ContainerWidget.sortWidgetsByOrientation(
        children,
        orientation,
      );

      sortedChildren.forEach((child, idx) => {
        this.createWidgetRelationsByWidget(child);
        if (idx > 0) {
          this.createRelationsBetweenNeighbours(
            sortedChildren[idx - 1],
            child,
            orientation,
          );
        }
      });
    } else {
      this.widgetRelations.set(widget, new WidgetRelations());
    }
  }

  public createWidgetRelationsByWidgets(
    widgets: Widget[],
    orientation: ContainerOrientation,
  ): void {
    switch (orientation) {
      case ContainerOrientation.center:
        if (widgets.length) {
          this.widgetRelations.set(widgets[0], new WidgetRelations());
        }
        break;
      case ContainerOrientation.horizontal:
      case ContainerOrientation.vertical: {
        const sortedChildren = ContainerWidget.sortWidgetsByOrientation(
          widgets,
          orientation,
        );
        sortedChildren.forEach((child, idx) => {
          this.createWidgetRelationsByWidget(child);
          if (idx > 0) {
            this.createRelationsBetweenNeighbours(
              sortedChildren[idx - 1],
              child,
              orientation,
            );
          }
        });
        break;
      }
      default:
        throw new Error("Enxpected case");
    }
  }

  private findEdgesWidgets(widget: Widget, align: Align): Widget[] {
    if (!(widget instanceof ContainerWidget)) {
      return [widget];
    }

    if (widget instanceof BoxContainer) {
      return widget.getChildren().length
        ? this.findEdgesWidgets(widget.getChildren()[0], align)
        : [];
    }

    const children = widget.getChildren();
    const [start, end] =
      align === Align.alTop || align === Align.alBottom
        ? [Align.alLeft, Align.alRight]
        : [Align.alTop, Align.alBottom];

    const aligned = children.filter(c => c.getAlign() === align);
    const center = children.filter(c => c.getAlign() === Align.alClient);
    const startSide = children.filter(c => c.getAlign() === start);
    const endSide = children.filter(c => c.getAlign() === end);

    const fromStart = startSide.reduce<Widget[]>(
      (acc, c) => acc.concat(this.findEdgesWidgets(c, align)),
      [],
    );
    const midSource = aligned.length > 0 ? aligned : center;
    const middle = midSource.reduce<Widget[]>(
      (acc, c) => acc.concat(this.findEdgesWidgets(c, align)),
      [],
    );
    const fromEnd = endSide.reduce<Widget[]>(
      (acc, c) => acc.concat(this.findEdgesWidgets(c, align)),
      [],
    );
    return [...fromStart, ...middle, ...fromEnd];
  }

  private createRelationsBetweenNeighbours(
    widget: Widget,
    nextWidget: Widget,
    orientation: ContainerOrientation,
  ): void {
    if (orientation === ContainerOrientation.center) {
      throw new Error("Enxpected case");
    }

    const topOrLeftNeighbours = this.findEdgesWidgets(
      widget,
      orientation === ContainerOrientation.vertical ? Align.alBottom : Align.alRight,
    );
    const bottomOrRightNeighbours = this.findEdgesWidgets(
      nextWidget,
      orientation === ContainerOrientation.vertical ? Align.alTop : Align.alLeft,
    );

    topOrLeftNeighbours.forEach(left => {
      bottomOrRightNeighbours.forEach(right => {
        if (orientation === ContainerOrientation.vertical) {
          getOrCreate(this.widgetRelations, left, () => new WidgetRelations())
            .getBottomRelations()
            .push(right);
          getOrCreate(this.widgetRelations, right, () => new WidgetRelations())
            .getTopRelations()
            .push(left);
        } else {
          getOrCreate(this.widgetRelations, left, () => new WidgetRelations())
            .getRightRelations()
            .push(right);
          getOrCreate(this.widgetRelations, right, () => new WidgetRelations())
            .getLeftRelations()
            .push(left);
        }
      });
    });
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
