import {RealTimeObject} from "@convergence/convergence";
import {CellValueAdapter} from "./CellValueAdapter";
import {CellAttributesAdapter} from "./CellAttributesAdapter";

export class CellAdapter {

  private _cell: any;
  private _cellModel: RealTimeObject;
  private _cellAttributesAdapter: CellAttributesAdapter;
  private _cellValueAdapters: CellValueAdapter[];

  constructor(cell, cellModel) {
    this._cell = cell;
    this._cellModel = cellModel;
    this._cellAttributesAdapter = null;
    this._cellValueAdapters = [];
  }

  public bind(): void {
    this._cellAttributesAdapter = new CellAttributesAdapter(this._cell, this._cellModel);
    this._cellAttributesAdapter.bind();

    // Links
    if (this._cell.isLink()) {
      // TODO, the vertices is actually an array. We should handle this separately for granular edits.
      this._bindValue("change:vertices", "vertices");
      this._bindValue("change:target", "target");
      this._bindValue("change:source", "source");
      this._bindValue("change:router", "router");
      this._bindValue("change:labels", "labels");
      this._bindValue("change:connector", "connector");
    }

    // Elements
    if (!this._cell.isLink()) {
      this._bindValue("change:position", "position");
      this._bindValue("change:size", "size");
      this._bindValue("change:angle", "angle");
    }
  }

  public unbind(): void {
    if (this._cellAttributesAdapter !== null) {
      this._cellAttributesAdapter.unbind();
      this._cellAttributesAdapter = null;
    }

    this._cellValueAdapters.forEach(cellValueAdapter => cellValueAdapter.unbind());
    this._cellValueAdapters = [];
  }

  private _bindValue(eventName: string, propName: string): void {
    const cellValueAdapter: CellValueAdapter = new CellValueAdapter(this._cell, this._cellModel, eventName, propName);
    cellValueAdapter.bind();
    this._cellValueAdapters.push(cellValueAdapter);
  }
}
