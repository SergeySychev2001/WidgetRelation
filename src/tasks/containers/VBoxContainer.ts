import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { ContainerOrientation } from "../enums";

/** Vertical container widget. */
export default class VBoxContainer extends ContainerWidget {
  public getOrientation(): ContainerOrientation {
    return ContainerOrientation.vertical;
  }

  public createDOM(): HTMLDivElement {
    return super.createDOM([CssClasses.CONTAINER_V]);
  }
}
