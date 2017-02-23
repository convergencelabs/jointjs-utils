import {RealTimeObject} from "@convergence/convergence";
import {CellAdapter} from "./CellAdapter";
import * as joint from "jointjs";

/**
 * Connects a JointJS Element to a RealTimeObject
 */
export class ElementAdapter extends CellAdapter {

  /**
   * Constructs a new ElementAdapter
   *
   * @param element
   *   The JointJS element.
   *
   * @param cellModel
   *   The RealTimeObject corresponding to the Element in the RealTimeModel.
   */
  constructor(element: joint.dia.Element, cellModel: RealTimeObject) {
    super(element, cellModel);
  }

  public bind(): void {
    super.bind();

    this._bindValue("change:position", "position");
    this._bindValue("change:size", "size");
    this._bindValue("change:angle", "angle");
  }

  public unbind(): void {
    super.unbind();
  }
}
