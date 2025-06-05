import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { ContainerOrientation } from "../enums";

/** Single child container without orientation. */
export default class BoxContainer extends ContainerWidget {
  public getOrientation(): ContainerOrientation {
    return ContainerOrientation.center;
  }

  public createDOM(): HTMLDivElement {
    return super.createDOM([CssClasses.CONTAINER]);
  }
}
