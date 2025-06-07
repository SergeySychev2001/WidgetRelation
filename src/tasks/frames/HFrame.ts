import { Orientation } from "../enums";
import Frame from "./Frame";

export default class HFrame extends Frame {
  protected getOrientation(): Orientation {
    return Orientation.horizontal;
  }
}
