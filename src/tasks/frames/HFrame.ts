import { ContainerOrientation } from "../enums";
import Frame from "./Frame";

export default class HFrame extends Frame {
  protected getOrientation(): ContainerOrientation {
    return ContainerOrientation.horizontal;
  }
}
