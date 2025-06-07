import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { Orientation } from "../enums";

/** Vertical container widget. */
export default class VBoxContainer extends ContainerWidget {
  public getOrientation(): Orientation {
    return Orientation.vertical;
  }

  public createDOM(): HTMLDivElement {
    return super.createDOM([CssClasses.CONTAINER_V]);
  }
}
