import { HBoxContainer, VBoxContainer, Widget } from "../classes";
import { Align } from "../enums";

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

export { initWidgetsFunc }