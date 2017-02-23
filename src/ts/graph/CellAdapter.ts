import {RealTimeObject} from "@convergence/convergence";
import {CellValueAdapter} from "./CellValueAdapter";
import {CellAttributesAdapter} from "./CellAttributesAdapter";
import * as joint from "jointjs";

/**
 * Connects a JointJS Cell to a RealTimeObject.
 */
export abstract class CellAdapter {

  private _cell: joint.dia.Cell;
  private _cellModel: RealTimeObject;
  private _cellAttributesAdapter: CellAttributesAdapter;
  private _cellValueAdapters: CellValueAdapter[];

  /**
   * Creates a new CellAdapter. The Cell and RealTimeObject are not connected
   * until bind() is called.
   *
   * @param cell
   *   The JointJS Cell to bind to.
   *
   * @param cellModel
   *   The corresponding RealTimeObject in the RealTimeModel.
   */
  constructor(cell: joint.dia.Cell, cellModel: RealTimeObject) {
    this._cell = cell;
    this._cellModel = cellModel;
    this._cellAttributesAdapter = null;
    this._cellValueAdapters = [];
  }

  /**
   * Sets up the two way data binding between the Cell and RealTimeObject.
   */
  public bind(): void {
    this._cellAttributesAdapter = new CellAttributesAdapter(this._cell, this._cellModel);
    this._cellAttributesAdapter.bind();
  }

  /**
   * Discontinues the two-way data binding between the Cell and RealTimeObject.
   */
  public unbind(): void {
    if (this._cellAttributesAdapter !== null) {
      this._cellAttributesAdapter.unbind();
      this._cellAttributesAdapter = null;
    }

    this._cellValueAdapters.forEach(cellValueAdapter => cellValueAdapter.unbind());
    this._cellValueAdapters = [];
  }

  protected _bindValue(eventName: string, propName: string): void {
    const cellValueAdapter: CellValueAdapter = new CellValueAdapter(this._cell, this._cellModel, eventName, propName);
    cellValueAdapter.bind();
    this._cellValueAdapters.push(cellValueAdapter);
  }
}
