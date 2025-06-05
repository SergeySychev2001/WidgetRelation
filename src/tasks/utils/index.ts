import { HBoxContainer, VBoxContainer, Widget, LayoutManager } from "../classes";
import { Align, ContainerOrientation } from "../enums";

const initWidgetsFunc = {
    classic: () => {
        const rootWidget = new VBoxContainer(Align.alClient, true, [
            new HBoxContainer(Align.alTop, true, [
                new Widget(Align.alClient, true),
                new Widget(Align.alRight, true),
            ]),
            new VBoxContainer(Align.alClient, true, [
                new Widget(Align.alTop, true),
                new HBoxContainer(Align.alBottom, true, [
                    new VBoxContainer(Align.alLeft, true, [
                        new HBoxContainer(Align.alTop, true, [
                            new Widget(Align.alClient, true),
                            new VBoxContainer(Align.alRight, true, [
                                new Widget(Align.alTop, true),
                                new Widget(Align.alClient, true),
                            ])
                        ]),
                        new Widget(Align.alClient, true),
                        new Widget(Align.alBottom, true)
                    ]),
                    new VBoxContainer(Align.alLeft, true, [
                        new HBoxContainer(Align.alClient, true, [
                            new Widget(Align.alClient, true),
                            new VBoxContainer(Align.alRight, true, [
                                new Widget(Align.alTop, true),
                                new Widget(Align.alClient, true),
                            ])
                        ]),
                        new Widget(Align.alBottom, true),
                        new Widget(Align.alBottom, true)
                    ]),
                ]),
            ]),
            new Widget(Align.alBottom, true),
            new VBoxContainer(Align.alClient, true, [
                new Widget(Align.alTop, true),
                new HBoxContainer(Align.alBottom, true, [
                    new VBoxContainer(Align.alLeft, true, [
                        new HBoxContainer(Align.alTop, true, [
                            new Widget(Align.alClient, true),
                            new VBoxContainer(Align.alRight, true, [
                                new Widget(Align.alTop, true),
                                new Widget(Align.alClient, true),
                            ])
                        ]),
                        new Widget(Align.alClient, true),
                        new Widget(Align.alBottom, true)
                    ]),
                    new VBoxContainer(Align.alLeft, true, [
                        new HBoxContainer(Align.alClient, true, [
                            new Widget(Align.alClient, true),
                            new VBoxContainer(Align.alRight, true, [
                                new Widget(Align.alTop, true),
                                new Widget(Align.alClient, true),
                            ])
                        ]),
                        new Widget(Align.alBottom, true),
                        new Widget(Align.alBottom, true)
                    ]),
                ]),
            ]),
        ]);
        return rootWidget;
    }
}

const updateLayoutByWidget = (widget: Widget) => {
    const layoutManager = new LayoutManager();
    layoutManager.createWidgetRelationsByWidget(widget)
    console.log(layoutManager.getWidgetRelations())
}

const updateLayoutByWidgets = (widgets: Widget[], orientation: ContainerOrientation) => {
    const layoutManager = new LayoutManager();
    layoutManager.createWidgetRelationsByWidgets(widgets, orientation)
    console.log(layoutManager.getWidgetRelations())
}

export { initWidgetsFunc, updateLayoutByWidget, updateLayoutByWidgets }
export * from './helpers';