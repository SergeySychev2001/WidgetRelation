import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { ContainerOrientation } from "../enums";

/** Horizontal container widget. */
export default class HBoxContainer extends ContainerWidget {
  public getOrientation(): ContainerOrientation {
    return ContainerOrientation.horizontal;
  }

  public createDOM(): HTMLDivElement {
    return super.createDOM([CssClasses.CONTAINER_H]);
  }
}
