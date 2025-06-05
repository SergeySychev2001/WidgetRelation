import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import Widget from "./Widget";
import { ContainerOrientation } from "../enums";

/** Horizontal container widget. */
export default class HBoxContainer extends ContainerWidget {
  public sortChildren = (): Widget[] =>
    ContainerWidget.sortWidgetsByOrientation(
      this.getChildren(),
      ContainerOrientation.horizontal,
    );

  public createDOM = (): HTMLDivElement =>
    this.createDOMByOrientation(
      ContainerOrientation.horizontal,
      CssClasses.CONTAINER_H,
    );
}
