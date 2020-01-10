import {ObjectSetEvent, RealTimeObject} from "@convergence/convergence";
import {CellValueAdapter} from "./CellValueAdapter";
import {CellAttributesAdapter} from "./CellAttributesAdapter";
import * as joint from "jointjs";

/**
 * Connects a JointJS Cell to a RealTimeObject.
 */
export class CellAdapter {

  private readonly _cell: joint.dia.Cell;
  private readonly _cellModel: RealTimeObject;
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
    // The properties on the model themselves can only be set at the root via backbone. However
    // the "attrs" property can be mutated with more granularity. So we handle the "attrs" with
    // a special class, and handle all other properties here.

    this._cellAttributesAdapter = new CellAttributesAdapter(this._cell, this._cellModel);
    this._cellAttributesAdapter.bind();

    this._cell
      .keys()
      .filter(k => k != "attrs")
      .forEach(key => this._bindValue(key));

    // Listen for new local properties.
    this._cell.on("change", (model) => {
      Object.keys(model.changed)
        .filter(key => key !== "attrs" && !this._cellModel.hasKey(key))
        .forEach(key => {
          // This is a new local property added via jointjs. We must add it to the
          // real time model, so it syncs out.
          const value = this._cell.get(key);
          if (value !== undefined) {
            this._cellModel.set(key, value);
          }
          this._bindValue(key);
        });
    });

    // Listen for new remote properties.
    this._cellModel.on(RealTimeObject.Events.SET, (e: ObjectSetEvent) => {
      const key = e.key;
      if (key !== "attrs" && !this._cell.has(key)) {
        // A new remote property has come in via the real time model. We need to add it
        // to the cell and the bind.
        const value = e.element.get(key).value();
        this._cell.set(key, value);
        this._bindValue(key);
      }
    });
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

  protected _bindValue(propName: string): void {
    const cellValueAdapter: CellValueAdapter = new CellValueAdapter(this._cell, this._cellModel, propName);
    cellValueAdapter.bind();
    this._cellValueAdapters.push(cellValueAdapter);
  }
}
