import {RemoteSelectionItem} from "./RemoteSelectionItem";
import {ElementReference, RealTimeObject} from "@convergence/convergence";
import * as joint from "jointjs";
import {ReferenceSetEvent} from "@convergence/convergence/typings/model/reference/events";
import ViewOptions = Backbone.ViewOptions;

export interface RemoteSelectionOptions extends ViewOptions<any> {
  reference: ElementReference,
  color: string;
  paper: joint.dia.Paper;
}

export class RemoteSelection extends joint.mvc.View<any> {

  private _items: RemoteSelectionItem[];

  constructor(options: RemoteSelectionOptions) {
    super({...options, tagName: 'div', className: 'remote-selection'});
  }

  init(): void {
    // We have to do this here because init is called before the constructor
    // super call returns.
    this._onClear = this._onClear.bind(this);
    this._onSet = this._onSet.bind(this);
    this._onDisposed = this._onDisposed.bind(this);

    this._items = [];

    this.$el.appendTo((this as any).options.paper.el);
    this.$el.empty();

    (this as any).options.reference.on("set", this._onSet);
    (this as any).options.reference.on("clear", this._onClear);
    (this as any).options.reference.on("disposed", this._onDisposed);

    this._setCells((this as any).options.reference.values());
  }

  public remove(): RemoteSelection {
    (this as any).options.reference.off("set", this._onSet);
    (this as any).options.reference.on("clear", this._onClear);
    (this as any).options.reference.on("disposed", this._onDisposed);

    this.$el.remove();
    return this;
  }

  private _onSet(event: ReferenceSetEvent<RealTimeObject[]>) {
    const src = event.src as ElementReference;
    const values = src.values() as RealTimeObject[];
    this._setCells(values)
  }

  private _onClear() {
    this._clear();
  }

  private _onDisposed() {
    this.remove();
  }

  private _setCells(cellModels: RealTimeObject[]): void {
    this._clear();
    cellModels.forEach(cellModel => {
      const cell = (this as any).options.paper.model.getCell(cellModel.path().pop());
      this._items.push(new RemoteSelectionItem({
        paper: (this as any).options.paper,
        parent: this.$el,
        cell: cell,
        color: (this as any).options.color
      }));
    });
  }

  private _clear(): void {
    this._items.forEach(item => item.remove());
    this._items = [];
    this.$el.empty();
  }
}
