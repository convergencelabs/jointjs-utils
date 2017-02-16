import {RealTimeModel, RealTimeObject} from "@convergence/convergence";
import {CellAdapter} from "./CellAdapter";
import {DataConverter} from "./DataConverter";

export class GraphAdapter {
  private _model: RealTimeModel;
  private _graph: any;
  private _remote: boolean;
  private _cellsModel: RealTimeObject;
  private _cellAdapters: {[key: string]: CellAdapter};

  constructor(graph: any, model: RealTimeModel) {
    this._model = model;
    this._graph = graph;
    this._remote = false;
    this._cellsModel = null;
    this._cellAdapters = {};

    this._onLocalCellAdded = this._onLocalCellAdded.bind(this);
    this._onRemoteCellAdded = this._onRemoteCellAdded.bind(this);
    this._onLocalCellRemoved = this._onLocalCellRemoved.bind(this);
    this._onRemoteCellRemoved = this._onRemoteCellRemoved.bind(this);
    this._addCellAdapter = this._addCellAdapter.bind(this);
  }

  public bind(): void {
    const data: any = this._model.root().value();
    this._graph.fromJSON(DataConverter.modelDataToGraphJson(data));
    this._cellsModel = this._model.elementAt("cells") as RealTimeObject;

    this._graph.getCells().forEach(this._addCellAdapter);

    this._graph.on("add", this._onLocalCellAdded);
    this._graph.on("remove", this._onLocalCellRemoved);

    this._cellsModel.on("set", this._onRemoteCellAdded);
    this._cellsModel.on("remove", this._onRemoteCellRemoved);
  }

  public unbind(): void {
    this._graph.off("add", this._onLocalCellAdded);
    this._graph.off("remove", this._onLocalCellRemoved);

    this._cellsModel.off("set", this._onRemoteCellAdded);
    this._cellsModel.off("remove", this._onRemoteCellRemoved);

    Object.keys(this._cellAdapters).forEach(cellId => {
      this._cellAdapters[cellId].unbind();
    });

    this._cellAdapters = {};
  }

  private _onLocalCellAdded(cell: any): void {
    if (!this._remote) {
      this._cellsModel.set(cell.id, cell.toJSON());
      this._addCellAdapter(cell);
    }
  };

  private _onRemoteCellAdded(event): void {
    this._remote = true;
    const id = event.key;
    const newCellData = event.value.value();
    this._graph.addCell(newCellData);
    const newCell = this._graph.getCell(id);
    this._addCellAdapter(newCell);
    this._remote = false;
  };

  private _onLocalCellRemoved(cell: any): void {
    if (!this._remote) {
      this._cellsModel.remove(cell.id);
      this._removeCellAdapter(cell);
    }
  };

  private _onRemoteCellRemoved(event): void {
    this._remote = true;
    const key = event.key;
    const cell = this._graph.getCell(key);
    this._removeCellAdapter(cell);
    cell.remove();
    this._remote = false;
  };

  private _addCellAdapter(cell: any): void {
    const cellModel = this._cellsModel.get(cell.id);
    const adapter = new CellAdapter(cell, cellModel);
    adapter.bind();
    this._cellAdapters[cell.id] = adapter;
  };

  private _removeCellAdapter(cell: any): void {
    const adapter = this._cellAdapters[cell.id];
    adapter.unbind();
    delete this._cellAdapters[cell.id];
  }
}
