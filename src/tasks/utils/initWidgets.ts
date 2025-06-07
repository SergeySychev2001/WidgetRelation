import { ContainerWidget, HBoxContainer, VBoxContainer } from "../containers";
import { Align, Orientation } from "../enums";
import { Frame, VFrame } from "../frames";
import { Widget } from "../widgets";

const initWidgetsFunc = {
  classic: () => {
    const rootWidget = new VFrame(Align.alClient, true, [
      new VBoxContainer(Align.alClient, true, [
        new HBoxContainer(Align.alTop, true, [
          new HBoxContainer(Align.alLeft, true, [
            new Widget(Align.alLeft, true),
            new Widget(Align.alLeft, true),
            new Widget(Align.alLeft, true),
          ]),
          new Widget(Align.alClient, true),
          new HBoxContainer(Align.alLeft, true, [
            new Widget(Align.alRight, true),
            new Widget(Align.alRight, true),
            new Widget(Align.alRight, true),
          ]),
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
                ]),
              ]),
              new Widget(Align.alClient, true),
              new Widget(Align.alBottom, true),
            ]),
            new VBoxContainer(Align.alLeft, true, [
              new HBoxContainer(Align.alClient, true, [
                new Widget(Align.alClient, true),
                new VBoxContainer(Align.alRight, true, [
                  new Widget(Align.alTop, true),
                  new Widget(Align.alClient, true),
                ]),
              ]),
              new Widget(Align.alBottom, true),
              new Widget(Align.alBottom, true),
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
                ]),
              ]),
              new Widget(Align.alClient, true),
              new Widget(Align.alBottom, true),
            ]),
            new VBoxContainer(Align.alLeft, true, [
              new HBoxContainer(Align.alClient, true, [
                new Widget(Align.alClient, true),
                new VBoxContainer(Align.alRight, true, [
                  new Widget(Align.alTop, true),
                  new Widget(Align.alClient, true),
                ]),
              ]),
              new Widget(Align.alBottom, true),
              new Widget(Align.alBottom, true),
            ]),
          ]),
        ]),
      ]),
    ]);
    return rootWidget;
  },
  random: (maxDepth = 3) => {
    function getRandomAlign(containerWidget: ContainerWidget | null) {
      const withClient = containerWidget ? containerWidget.getChildren().find(i => i.getAlign() === Align.alClient) : false;
      let alignArr: Align[] = [];
      switch (containerWidget?.getOrientation()) {
        case Orientation.vertical:
          alignArr = [Align.alTop, Align.alBottom];
          break;
        case Orientation.horizontal:
          alignArr = [Align.alLeft, Align.alRight]
          break;
        case Orientation.center:
          alignArr = []
          break;
        default:
          alignArr = [
            Align.alTop,
            Align.alLeft,
            Align.alRight,
            Align.alBottom,
          ];
          break;
      }
      if (withClient) alignArr.push(Align.alClient);
      return alignArr[Math.floor(Math.random() * alignArr.length)];
    }

    const getRandomContainer = (align: Align) =>
      Math.random() > 0.5
        ? new VBoxContainer(align, true)
        : new HBoxContainer(align, true);

    function generateRandomStructure(
      currentDepth = 0,
      parentContainer: ContainerWidget | null = null
    ) {
      const numChildren = Math.floor(Math.random() * 5) + 1;
      const rootContainer = getRandomContainer(getRandomAlign(parentContainer));

      for (let i = 0; i < numChildren; i++) {
        if (currentDepth < maxDepth && Math.random() > 0.3) {
          rootContainer
            .getChildren()
            .push(generateRandomStructure(currentDepth + 1, rootContainer));
        } else {
          rootContainer
            .getChildren()
            .push(new Widget(getRandomAlign(rootContainer), true));
        }
      }

      return rootContainer;
    }

    return new Frame(Align.alClient, true, [generateRandomStructure()]);
  },
};

export { initWidgetsFunc };
