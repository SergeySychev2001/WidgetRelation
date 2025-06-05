import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import Widget from "./Widget";
import { ContainerOrientation } from "../enums";

/** Vertical container widget. */
export default class VBoxContainer extends ContainerWidget {
  public sortChildren = (): Widget[] =>
    ContainerWidget.sortWidgetsByOrientation(
      this.getChildren(),
      ContainerOrientation.vertical,
    );

  public createDOM = (): HTMLDivElement =>
    this.createDOMByOrientation(
      ContainerOrientation.vertical,
      CssClasses.CONTAINER_V,
    );
}
