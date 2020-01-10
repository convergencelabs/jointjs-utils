import {
  ArraySetValueEvent,
  BooleanSetValueEvent, DateSetValueEvent, NumberSetValueEvent,
  ObjectSetEvent, ObjectSetValueEvent, RealTimeArray, RealTimeContainerElement, RealTimeObject,
  StringSetValueEvent
} from "@convergence/convergence";
import * as joint from "jointjs";

// TODO The attributes are basically just getting replaced. We should see if it is a string attribute
// or boolean, etc, and perhaps do something smarter.  For example we can't do character by character
// edits on the label of a cell right now. We actually just send the whole string over every time
// some one types something.

export class CellAttributesAdapter {

  private _remote: boolean;
  private _cell: joint.dia.Cell;
  private readonly _cellModel: RealTimeObject;

  constructor(cell: joint.dia.Cell, cellModel: RealTimeObject) {
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
      if (this._cellModel.elementAt(path).type() === "undefined") {
        this._setAttributeValue(path, details.propertyValue);
      } else {
        this._cellModel.elementAt(path).value(details.propertyValue);
      }
    }
  };

  private _onRemoteAttributeChanged = (event) => {
    this._remote = true;

    const path = event.relativePath.slice(0);
    const childEvent = event.childEvent;

    if (childEvent instanceof ObjectSetEvent) {
      const value = childEvent.value.value();
      path.push(childEvent.key);
      this._cell.attr(path, value);
    } else if (childEvent instanceof StringSetValueEvent ||
      childEvent instanceof BooleanSetValueEvent ||
      childEvent instanceof NumberSetValueEvent ||
      childEvent instanceof DateSetValueEvent ||
      childEvent instanceof ObjectSetValueEvent ||
      childEvent instanceof ArraySetValueEvent
    ) {
      const value = childEvent.element.value();
      this._cell.attr(path, value);
    }

    this._remote = false;
  };


  private _setAttributeValue(path, value) {
    let curObject: RealTimeContainerElement<any> = this._cellModel;
    let curPath = path.slice(0);

    while (curPath.length > 1) {
      const pathSegment = curPath[0];
      if (curObject.elementAt(pathSegment).type() === "undefined") {
        break;
      } else {
        curPath.shift();
        curObject = curObject.elementAt(pathSegment) as any as RealTimeContainerElement<any>;
      }
    }

    const prop = curPath.shift();
    const val = this.createValue(curPath, value);

    if (curObject instanceof RealTimeObject) {
      curObject.set(prop, val);
    } else if (curObject instanceof RealTimeArray) {
      curObject.set(prop, val);
    }
  }

  private createValue(path, value): any {
    let v;

    if (path.length === 0) {
      v = value;
    } else {
      const pathSegment = path.shift();

      if (isNaN(pathSegment)) {
        v = {};
      } else {
        v = [];
      }

      v[pathSegment] = this.createValue(path, value);
    }

    return v;
  }
}
