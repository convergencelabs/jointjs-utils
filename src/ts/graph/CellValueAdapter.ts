import {RealTimeObject, RealTimeElement, ObjectRemoveEvent, ObjectSetEvent} from "@convergence/convergence";
import * as joint from "jointjs";

export class CellValueAdapter {

  private _remote: boolean;
  private _cell: joint.dia.Cell;
  private _cellModel: RealTimeObject;
  private readonly _eventName: string;
  private readonly _propertyName: string;
  private _valueElement: RealTimeElement;

  constructor(cell: joint.dia.Cell, cellModel: RealTimeObject, propertyName: string) {
    this._remote = false;
    this._cell = cell;
    this._cellModel = cellModel;
    this._eventName = `change:${propertyName}`;
    this._propertyName = propertyName;
    this._valueElement = null;

    this._onLocalGraphEvent = this._onLocalGraphEvent.bind(this);
    this._onRemotePropertySet = this._onRemotePropertySet.bind(this);
    this._onRemotePropertyRemoved = this._onRemotePropertyRemoved.bind(this);
    this._onRemoteValue = this._onRemoteValue.bind(this);
  }

  public bind(): void {
    // The model already has the property set, so we can bind to it now.
    // If this is not true, we will create and listen to the model now.
    // If the property is not there, we will bind to it lazily when the
    // first event comes in from the graph or when a remote user adds
    // the property.  Both of these are below.
    if (this._cellModel.hasKey(this._propertyName)) {
      this._bindToValueElement();
    }

    // A remote property is set, and it the property we are binding to.
    // We will both bind to the model and then set the value of the cell
    // property in the graph.
    this._cellModel.on("set", this._onRemotePropertySet);

    // If this property is removed, stop listening to the model.
    this._cellModel.on("remove", this._onRemotePropertyRemoved);

    // Bind to the events from the graph for this property.
    this._bindToGraphCell();
  }

  public unbind(): void {
    this._cellModel.off("set", this._onRemotePropertySet);
    this._cellModel.off("remove", this._onRemotePropertyRemoved);
    this._unbindToValueElement();
    this._unbindFromGraphCell();
  }

  private _bindToValueElement(): void {
    this._valueElement = this._cellModel.get(this._propertyName);
    // TODO validate this element exists.
    this._valueElement.on("value", this._onRemoteValue);
  }

  private _unbindToValueElement(): void {
    if (this._valueElement !== null) {
      this._valueElement.off("value", this._onRemoteValue);
      this._valueElement = null;
    }
  }

  private _bindToGraphCell(): void {
    this._cell.on(this._eventName, this._onLocalGraphEvent);
  }

  private _unbindFromGraphCell(): void {
    this._cell.off(this._eventName, this._onLocalGraphEvent);
  }

  private _onLocalGraphEvent(_: any, value: any): void {
    if (this._remote) {
      return;
    }

    if (this._cellModel.hasKey(this._propertyName)) {
      // The cell model already has this property so we want to
      // updated the existing sub element in the model.
      if (value === undefined) {
        // JointJS sets this to undefined when it is removed.
        this._cellModel.remove(this._propertyName);
      } else {
        this._cellModel.get(this._propertyName).value(value);
      }
    } else if (value !== undefined) {
      // This is the first time the property is being set so
      // we need to set the property in the parent, which will
      // create the sub element. We need to then bind to it.
      // This happens for parts of the cell that are only
      // optionally there. They don't yet exist in the graph
      // model or the RealTimeModel, so we are lazily binding
      // to them here, when they are set.
      this._cellModel.set(this._propertyName, value);
      this._bindToValueElement();
    }
  };

  private _onRemotePropertySet(event: ObjectSetEvent): void {
    if (event.key === this._propertyName) {
      this._unbindToValueElement();
      this._setCellValue(event.value.value());
      this._bindToValueElement();
    }
  };

  private _onRemotePropertyRemoved(event: ObjectRemoveEvent): void {
    if (event.key === this._propertyName) {
      this._unbindToValueElement();
    }
  };

  private _onRemoteValue(event): void {
    this._remote = true;
    this._setCellValue(event.element.value());
    this._remote = false;
  };

  private _setCellValue(value: any): void {
    this._cell.set(this._propertyName, value);
  };
}
