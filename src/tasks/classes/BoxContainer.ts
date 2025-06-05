import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { ContainerOrientation } from "../enums";
import Widget from "./Widget";

/** Single child container without orientation. */
export default class BoxContainer extends ContainerWidget {
  public sortChildren = (): Widget[] => this.getChildren();

  public createDOM = (): HTMLDivElement =>
    this.createDOMByOrientation(
      ContainerOrientation.center,
      CssClasses.CONTAINER,
    );
}
