import {RemoteSelectionItem} from "./RemoteSelectionItem";
import {RealTimeObject, ElementReference} from "@convergence/convergence";
import ViewOptions = Backbone.ViewOptions;

export interface RemoteSelectionOptions extends ViewOptions<any> {
  reference: ElementReference,
  color: string;
  paper: joint.dia.Paper;
}

export class RemoteSelection extends joint.mvc.View<any> {

  get tagName(): string {return 'div';}
  get className(): string {return 'remote-selection';}

  private _items: RemoteSelectionItem[];

  constructor(options: RemoteSelectionOptions) {
    super(options);
  }

  init(): void {
    // We have to do this here because init is called before the constructor
    // super call returns.
    this._onClear = this._onClear.bind(this);
    this._onSet = this._onSet.bind(this);
    this._onDisposed = this._onDisposed.bind(this);

    this._items = [];

    this.$el.appendTo(this.options.paper.el);
    this.$el.empty();

    this.options.reference.on("set", this._onSet);
    this.options.reference.on("clear", this._onClear);
    this.options.reference.on("disposed", this._onDisposed);

    this._setCells(this.options.reference.values());
  }

  public remove(): RemoteSelection {
    this.options.reference.off("set", this._onSet);
    this.options.reference.on("clear", this._onClear);
    this.options.reference.on("disposed", this._onDisposed);

    this.$el.remove();
    return this;
  }

  private _onSet(event) {
    this._setCells(event.src.values())
  }

  private _onClear() {
    this._clear();
  }

  private _onDisposed() {
    this.remove();
  }

  private _setCells(cellModels: RealTimeObject): void {
    this._clear();
    cellModels.forEach(cellModel => {
      const cell = this.options.paper.model.getCell(cellModel.path().pop());
      this._items.push(new RemoteSelectionItem({
        paper: this.options.paper,
        parent: this.$el,
        cell: cell,
        color: this.options.color
      }));
    });
  }

  private _clear(): void {
    this._items.forEach(item => item.remove());
    this._items = [];
    this.$el.empty();
  }
}
