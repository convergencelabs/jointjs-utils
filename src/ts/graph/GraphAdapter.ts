import {RealTimeModel, RealTimeObject} from "@convergence/convergence";
import {CellAdapter} from "./CellAdapter";
import {DataConverter} from "./DataConverter";
import {LinkAdapter} from "./LinkAdapter";
import {ElementAdapter} from "./ElementAdapter";
import * as joint from "jointjs";

/**
 * The GraphAdapter class connects a JointJS Graph to a Convergence RealTimeModel.
 */
export class GraphAdapter {
  private _model: RealTimeModel;
  private _graph: joint.dia.Graph;
  private _remote: boolean;
  private _cellsModel: RealTimeObject;
  private _cellAdapters: {[key: string]: CellAdapter};
  private _bound: boolean;

  /**
   * Constructs a new GraphAdapter from a supplied model. A new JointJS Graph will be
   * created.
   *
   * @param model
   * @returns {GraphAdapter}
   */
  static create(model: RealTimeModel): GraphAdapter {
    const graph = new joint.dia.Graph;
    return new GraphAdapter(graph, model);
  }

  /**
   * Constructs a new GraphAdapter with the supplied JointJS graph and
   * Convergence RealTimeModel.
   *
   * @param graph
   *   The JointJS Graph
   *
   * @param model
   *   The Convergence RealTimeModel
   */
  constructor(graph: joint.dia.Graph, model: RealTimeModel) {
    this._model = model;
    this._graph = graph;
    this._remote = false;
    this._cellsModel = null;
    this._cellAdapters = {};
    this._bound = false;

    this._onLocalCellAdded = this._onLocalCellAdded.bind(this);
    this._onRemoteCellAdded = this._onRemoteCellAdded.bind(this);
    this._onLocalCellRemoved = this._onLocalCellRemoved.bind(this);
    this._onRemoteCellRemoved = this._onRemoteCellRemoved.bind(this);
    this._addCellAdapter = this._addCellAdapter.bind(this);
  }

  /**
   * Gets the JointJS Graph being used by this adapter.
   *
   * @returns {*}
   *   the JointJS Graph being used by this adapter.
   */
  public graph(): any {
    return this._graph;
  }

  /**
   * Gets the Convergence RealTimeModel being used by this adapter.
   *
   * @returns {RealTimeModel}
   *   the JointJS Graph being used by this adapter.
   */
  public model(): RealTimeModel {
    return this._model;
  }

  /**
   * Determines if the adapter is currently bound.
   *
   * @returns {boolean} true if the graph is currently bound, false otherwise.
   */
  public isBound(): boolean {
    return this._bound;
  }

  /**
   * Set the data in the JointJS Graph from the current data in the RealTimeModel and
   * then creates a two-way binding between the Graph and RealTimeModel. This method
   * can only be called when the adapter is not bound (e.g. isBound() returns false).
   * After the method is called isBound() will return true.
   */
  public bind(): void {
    if (this._bound) {
      return;
    }

    this._bound = true;

    const data: any = this._model.root().value();
    this._graph.fromJSON(DataConverter.modelDataToGraphJson(data));
    this._cellsModel = this._model.elementAt("cells") as RealTimeObject;

    this._graph.getCells().forEach(this._addCellAdapter);

    this._graph.on("add", this._onLocalCellAdded);
    this._graph.on("remove", this._onLocalCellRemoved);

    this._cellsModel.on("set", this._onRemoteCellAdded);
    this._cellsModel.on("remove", this._onRemoteCellRemoved);
  }

  /**
   * Disconnects the Graph and RealTimeModel. This method should only be called if
   * the adapter is bound (e.g. isBound() returns true). After this method is called
   * the graph and model will not remain synchronized and isBound() will return false.
   */
  public unbind(): void {
    if (!this._bound) {
      return;
    }

    this._graph.off("add", this._onLocalCellAdded);
    this._graph.off("remove", this._onLocalCellRemoved);

    this._cellsModel.off("set", this._onRemoteCellAdded);
    this._cellsModel.off("remove", this._onRemoteCellRemoved);

    Object.keys(this._cellAdapters).forEach(cellId => {
      this._cellAdapters[cellId].unbind();
    });

    this._cellAdapters = {};

    this._bound = false;
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
    const cellModel = this._cellsModel.get(cell.id) as RealTimeObject;
    let adapter: CellAdapter = null;
    if (cell instanceof joint.dia.Link) {
      adapter = new LinkAdapter(cell, cellModel);
    } else if (cell instanceof joint.dia.Element) {
      adapter = new ElementAdapter(cell, cellModel);
    }
    adapter.bind();
    this._cellAdapters[cell.id] = adapter;
  };

  private _removeCellAdapter(cell: any): void {
    const adapter = this._cellAdapters[cell.id];
    adapter.unbind();
    delete this._cellAdapters[cell.id];
  }
}
