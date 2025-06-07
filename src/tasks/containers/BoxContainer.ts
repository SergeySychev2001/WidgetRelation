import CssClasses from "../enums/CssClasses";
import ContainerWidget from "./ContainerWidget";
import { Orientation } from "../enums";

/** Single child container without orientation. */
export default class BoxContainer extends ContainerWidget {
  public getOrientation(): Orientation {
    return Orientation.center;
  }

  public createDOM(): HTMLDivElement {
    return super.createDOM([CssClasses.CONTAINER]);
  }
}
