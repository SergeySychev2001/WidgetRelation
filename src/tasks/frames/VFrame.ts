import { ContainerOrientation } from "../enums";
import Frame from "./Frame";

export default class VFrame extends Frame {
  protected getOrientation(): ContainerOrientation {
    return ContainerOrientation.vertical;
  }
}
