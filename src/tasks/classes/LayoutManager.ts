import Widget from "./Widget";
import ContainerWidget from "./ContainerWidget";
import { Align, ContainerOrientation } from "../enums";
import BoxContainer from "./BoxContainer";
import HBoxContainer from "./HBoxContainer";
import VBoxContainer from "./VBoxContainer";
import { getOrCreate } from "../utils";

export default class LayoutManager {
    private widgetRelations: Map<Widget, WidgetRelations> = new Map();

    public getWidgetRelations() {
        return this.widgetRelations;
    }

    private widgetIsSimpleContainer(containerWidget: ContainerWidget): boolean {
        return containerWidget instanceof BoxContainer;
    }

    private widgetIsHorizontalContainer(containerWidget: ContainerWidget): boolean {
        return containerWidget instanceof HBoxContainer;
    }

    private widgetIsVerticalContainer(containerWidget: ContainerWidget): boolean {
        return containerWidget instanceof VBoxContainer;
    }

    public createWidgetRelationsByWidget(widget: Widget) {
        if (widget instanceof ContainerWidget) {
            if (this.widgetIsSimpleContainer(widget)) {
                if (widget.getChildren().length) this.widgetRelations.set(widget.getChildren()[0], new WidgetRelations());
            } else if (this.widgetIsHorizontalContainer(widget)) {
                const hBoxContainer: HBoxContainer = widget as HBoxContainer;
                const sortedChildren = hBoxContainer.sortChildren();
                for (let i = 0; i < sortedChildren.length; i++) {
                    this.createWidgetRelationsByWidget(sortedChildren[i]);
                    if (i > 0) {
                        this.createRelationsBetweenNeighbours(sortedChildren[i - 1], sortedChildren[i], ContainerOrientation.horizontal);
                    }
                }
            } else if (this.widgetIsVerticalContainer(widget)) {
                const vBoxContainer: VBoxContainer = widget as VBoxContainer;
                const sortedChildren = vBoxContainer.sortChildren();
                for (let i = 0; i < sortedChildren.length; i++) {
                    this.createWidgetRelationsByWidget(sortedChildren[i]);
                    if (i > 0) this.createRelationsBetweenNeighbours(sortedChildren[i - 1], sortedChildren[i], ContainerOrientation.vertical);
                }
            } else {
                throw new Error("Enxpected case");
            }
        } else {
            this.widgetRelations.set(widget, new WidgetRelations());
        }
    }

    public createWidgetRelationsByWidgets(widgets: Widget[], orientation: ContainerOrientation) {
        switch (orientation) {
            case ContainerOrientation.center:
                if (widgets.length) this.widgetRelations.set(widgets[0], new WidgetRelations());
                break;
            case ContainerOrientation.horizontal:
            case ContainerOrientation.vertical:
                const sortedChildren = ContainerWidget.sortWidgetsByOrientation(widgets, orientation);
                for (let i = 0; i < sortedChildren.length; i++) {
                    this.createWidgetRelationsByWidget(sortedChildren[i]);
                    if (i > 0) {
                        this.createRelationsBetweenNeighbours(sortedChildren[i - 1], sortedChildren[i], orientation);
                    }
                }
                break;
            default: throw new Error("Enxpected case");
        }
    }

    private findEdgesWidgets(widget: Widget, align: Align): Widget[] {
        const widgets: Widget[] = [];
        if (widget instanceof ContainerWidget) {
            if (this.widgetIsSimpleContainer(widget)) {
                if (widget.getChildren().length > 0) widgets.push(widget.getChildren()[0]);
            } else {
                switch (align) {
                    case Align.alTop:
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alLeft).flatMap(i => this.findEdgesWidgets(i, align)));
                        if (widget.getChildren().findIndex(i => i.getAlign() === Align.alTop) > -1) {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alTop).flatMap(i => this.findEdgesWidgets(i, align)));
                        } else {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alClient).flatMap(i => this.findEdgesWidgets(i, align)));
                        }
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alRight).flatMap(i => this.findEdgesWidgets(i, align)));
                        break;
                    case Align.alRight:
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alTop).flatMap(i => this.findEdgesWidgets(i, align)));
                        if (widget.getChildren().findIndex(i => i.getAlign() === Align.alRight) > -1) {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alRight).flatMap(i => this.findEdgesWidgets(i, align)));
                        } else {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alClient).flatMap(i => this.findEdgesWidgets(i, align)));
                        }
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alBottom).flatMap(i => this.findEdgesWidgets(i, align)));
                        break;
                    case Align.alBottom:
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alLeft).flatMap(i => this.findEdgesWidgets(i, align)));
                        if (widget.getChildren().findIndex(i => i.getAlign() === Align.alBottom) > -1) {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alBottom).flatMap(i => this.findEdgesWidgets(i, align)));
                        } else {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alClient).flatMap(i => this.findEdgesWidgets(i, align)));
                        }
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alRight).flatMap(i => this.findEdgesWidgets(i, align)));
                        break;
                    case Align.alLeft:
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alTop).flatMap(i => this.findEdgesWidgets(i, align)));
                        if (widget.getChildren().findIndex(i => i.getAlign() === Align.alLeft) > -1) {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alLeft).flatMap(i => this.findEdgesWidgets(i, align)));
                        } else {
                            widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alClient).flatMap(i => this.findEdgesWidgets(i, align)));
                        }
                        widgets.push(...widget.getChildren().filter(i => i.getAlign() === Align.alBottom).flatMap(i => this.findEdgesWidgets(i, align)));
                        break;
                    default: throw new Error("Enxpected case");
                }
            }
        } else {
            widgets.push(widget);
        }
        return widgets;
    }

    private createRelationsBetweenNeighbours(widget: Widget, nextWidget: Widget, orientation: ContainerOrientation) {
        if (orientation === ContainerOrientation.center) throw new Error("Enxpected case");
        const topOrLeftNeghbours = this.findEdgesWidgets(widget, orientation === ContainerOrientation.vertical ? Align.alBottom : Align.alRight);
        const bottomOrRightNeghbours = this.findEdgesWidgets(nextWidget, orientation === ContainerOrientation.vertical ? Align.alTop : Align.alLeft);
        for (let i = 0; i < topOrLeftNeghbours.length; i++) {
            for (let j = 0; j < bottomOrRightNeghbours.length; j++) {
                if (orientation === ContainerOrientation.vertical) {
                    getOrCreate(this.widgetRelations, topOrLeftNeghbours[i], () => new WidgetRelations()).getBottomRelations().push(bottomOrRightNeghbours[j]);
                    getOrCreate(this.widgetRelations, bottomOrRightNeghbours[j], () => new WidgetRelations()).getTopRelations().push(topOrLeftNeghbours[i]);
                } else {
                    getOrCreate(this.widgetRelations, topOrLeftNeghbours[i], () => new WidgetRelations()).getRightRelations().push(bottomOrRightNeghbours[j]);
                    getOrCreate(this.widgetRelations, bottomOrRightNeghbours[j], () => new WidgetRelations()).getLeftRelations().push(topOrLeftNeghbours[i]);
                }
            }
        }

    }

    // private clear() {
    //     this.widgetRelations = new Map();
    // }
}

class WidgetRelations {
    private topRelations: Widget[];
    private rightRelations: Widget[];
    private bottomRelations: Widget[];
    private leftRelations: Widget[];

    constructor() {
        this.topRelations = [];
        this.rightRelations = [];
        this.bottomRelations = [];
        this.leftRelations = [];
    }

    public getTopRelations() {
        return this.topRelations;
    }

    public getRightRelations() {
        return this.rightRelations;
    }

    public getBottomRelations() {
        return this.bottomRelations;
    }

    public getLeftRelations() {
        return this.leftRelations;
    }
}