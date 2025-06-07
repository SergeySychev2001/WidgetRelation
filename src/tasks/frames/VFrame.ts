import { Orientation } from "../enums";
import Frame from "./Frame";

export default class VFrame extends Frame {
  protected getOrientation(): Orientation {
    return Orientation.vertical;
  }
}
