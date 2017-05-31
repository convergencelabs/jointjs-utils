import {RealTimeObject} from "@convergence/convergence";
import {CellAdapter} from "./CellAdapter";
import * as joint from "jointjs";

/**
 * Connects a JointJS Link to a RealTimeObject.
 */
export class LinkAdapter extends CellAdapter {

  /**
   * Constructs a new LinkAdapter
   * @param cell
   *   The Joint JS Link.
   *
   * @param cellModel
   *   The RealTimeObject corresponding to the Link.
   */
  constructor(link: joint.dia.Link, cellModel: RealTimeObject) {
    super(link, cellModel);
  }

  public bind(): void {
    super.bind();

    // TODO, the vertices is actually an array. We should handle this separately for granular edits.
    this._bindValue("change:router", "router");
    this._bindValue("change:connector", "connector");
    this._bindValue("change:source", "source");
    this._bindValue("change:target", "target");
    this._bindValue("change:z", "z");
    this._bindValue("change:vertices", "vertices");
    this._bindValue("change:labels", "labels");
  }

  public unbind(): void {
    super.unbind();
  }
}
