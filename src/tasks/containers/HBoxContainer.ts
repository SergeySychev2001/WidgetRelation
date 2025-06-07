import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { Orientation } from "../enums";

/** Horizontal container widget. */
export default class HBoxContainer extends ContainerWidget {
  public getOrientation(): Orientation {
    return Orientation.horizontal;
  }

  public createDOM(): HTMLDivElement {
    return super.createDOM([CssClasses.CONTAINER_H]);
  }
}
