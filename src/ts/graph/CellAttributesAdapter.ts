import {RealTimeObject} from "@convergence/convergence";

// TODO The attributes are basically just getting replaced. We should see if it is a string attribute
// or boolean, etc, and perhaps do something smarter.  For example we can't do character by character
// edits on the label of a cell right now. We actually just send the whole string over every time
// some one types something.

export class CellAttributesAdapter {

  private _remote: boolean;
  private _cell: any;
  private _cellModel: RealTimeObject;

  constructor(cell: any, cellModel: RealTimeObject) {
    this._remote = false;
    this._cell = cell;
    this._cellModel = cellModel;
  }

  public bind(): void {
    // All Cells
    this._cell.on("change:attrs", this._onLocalAttributeChanged);
    this._cellModel.get("attrs").on("model_changed", this._onRemoteAttributeChanged);
  }

  public unbind(): void {
    this._cell.off("change:attrs", this._onLocalAttributeChanged);
    this._cellModel.get("attrs").off("model_changed", this._onRemoteAttributeChanged);
  }

  private _onLocalAttributeChanged = (cell, attrs, details) => {
    if (!this._remote && details.propertyPath !== undefined) {
      const path = details.propertyPath.split("/");
      if (typeof this._cellModel.elementAt(path) === "undefined") {
        this._createAttributePathAndValue(path, details.propertyValue);
      } else {
        this._cellModel.elementAt(path).value(details.propertyValue);
      }
    }
  };

  private _onRemoteAttributeChanged = (event) => {
    this._remote = true;
    const propertyPath = event.relativePath.join("/");
    this._cell.attr(propertyPath, event.childEvent.src.value());
    this._remote = false;
  };

  private _createAttributePathAndValue(path, value) {
    let cur: RealTimeObject = this._cellModel;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!cur.hasKey(key)) {
        cur.set(key, {});
      }
      cur = cur.get(key) as RealTimeObject;
    }
    cur.set(path[path.length - 1], value);
  }
}
