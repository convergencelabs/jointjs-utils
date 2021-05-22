import {
  ObjectRemoveEvent,
  ObjectSetEvent,
  ObjectSetValueEvent,
  RealTimeModel,
  RealTimeObject
} from "@convergence/convergence";
import {CellAdapter} from "./CellAdapter";
import {DataConverter} from "./DataConverter";
import * as joint from "jointjs";

/**
 * The GraphAdapter class connects a JointJS Graph to a Convergence RealTimeModel.
 */
export class GraphAdapter {
  private readonly _graphObject: RealTimeObject;
  private readonly _graph: joint.dia.Graph;
  private _remote: boolean;
  private _cellsModel: RealTimeObject;
  private _cellAdapters: {[key: string]: CellAdapter};
  private _bound: boolean;

  /**
   * Constructs a new GraphAdapter from a supplied object. A new JointJS Graph will be
   * created.
   *
   * @param object
   *   The Convergence RealTimeObject to bind to, or a RealTimeModel whose
   *   root element will be bound to.
   *
   * @returns
   *   A new graph adapter bound to a new graph.
   */
  static create(object: RealTimeObject | RealTimeModel): GraphAdapter {
    const graph = new joint.dia.Graph;
    return new GraphAdapter(graph, object);
  }

  /**
   * Constructs a new GraphAdapter with the supplied JointJS graph and
   * Convergence RealTimeObject. If the object passed in is a RealTimeModel,
   * the graph will be bound to the root object.
   *
   * @param graph
   *   The JointJS Graph
   *
   * @param object
   *   The Convergence RealTimeObject to bind to, or a RealTimeModel whose
   *   root element will be bound to.
   */
  constructor(graph: joint.dia.Graph, object: RealTimeObject | RealTimeModel) {
    if (object instanceof RealTimeModel) {
      this._graphObject = object.root();
    } else {
      this._graphObject = object;
    }

    this._graph = graph;
    this._remote = false;
    this._cellsModel = null;
    this._cellAdapters = {};
    this._bound = false;

    this._onLocalCellAdded = this._onLocalCellAdded.bind(this);
    this._onRemoteCellAdded = this._onRemoteCellAdded.bind(this);
    this._onLocalCellRemoved = this._onLocalCellRemoved.bind(this);
    this._onRemoteCellRemoved = this._onRemoteCellRemoved.bind(this);
    this._onLocalCellsReset = this._onLocalCellsReset.bind(this);
    this._onRemoteCellsSet = this._onRemoteCellsSet.bind(this);
    this._addCellAdapter = this._addCellAdapter.bind(this);
    this._graphDetached = this._graphDetached.bind(this);
  }

  /**
   * Gets the JointJS Graph being used by this adapter.
   *
   * @returns
   *   the JointJS Graph being used by this adapter.
   */
  public graph(): any {
    return this._graph;
  }

  /**
   * Gets the Convergence RealTimeModel being used by this adapter.
   *
   * @returns {RealTimeObject}
   *   the JointJS Graph being used by this adapter.
   */
  public graphObject(): RealTimeObject {
    return this._graphObject;
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

    const data: any = this._graphObject.value();
    this._graph.fromJSON(DataConverter.modelDataToGraphJson(data));
    this._cellsModel = this._graphObject.elementAt("cells") as RealTimeObject;

    this._bindAllCells();

    this._graph.on("add", this._onLocalCellAdded);
    this._graph.on("remove", this._onLocalCellRemoved);
    this._graph.on("reset", this._onLocalCellsReset);

    this._cellsModel.on(RealTimeObject.Events.SET, this._onRemoteCellAdded);
    this._cellsModel.on(RealTimeObject.Events.REMOVE, this._onRemoteCellRemoved);
    this._cellsModel.on(RealTimeObject.Events.VALUE, this._onRemoteCellsSet);

    this._graphObject.on(RealTimeObject.Events.DETACHED, this._graphDetached);
    this._graphObject.on(RealTimeObject.Events.SET, this._remoteGraphSet);
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
    this._graph.off("reset", this._onLocalCellsReset);

    this._cellsModel.off(RealTimeObject.Events.SET, this._onRemoteCellAdded);
    this._cellsModel.off(RealTimeObject.Events.REMOVE, this._onRemoteCellRemoved);
    this._cellsModel.off(RealTimeObject.Events.VALUE, this._onRemoteCellsSet);

    this._unbindAllCells();

    this._graphObject.off(RealTimeObject.Events.DETACHED, this._graphDetached);
    this._graphObject.off(RealTimeObject.Events.SET, this._remoteGraphSet);

    this._bound = false;
  }

  private _onLocalCellAdded(cell: any): void {
    if (!this._remote) {
      this._cellsModel.set(cell.id, cell.toJSON());
      this._addCellAdapter(cell);
    }
  };

  private _onRemoteCellAdded(event: ObjectSetEvent): void {
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

  private _onRemoteCellRemoved(event: ObjectRemoveEvent): void {
    this._remote = true;
    const key = event.key;
    const cell = this._graph.getCell(key);
    this._removeCellAdapter(cell);
    cell.remove();
    this._remote = false;
  };

  private _onLocalCellsReset(event: any): void {
    if (!this._remote) {
      this._unbindAllCells();

      const cells: {[key: string]: any} = {};
      event.models.forEach(cell => {
        cells[cell.id] = cell.toJSON();
      });
      this._cellsModel.value(cells);

      this._bindAllCells();
    }
  };

  private _onRemoteCellsSet(event: ObjectSetValueEvent): void {
    this._remote = true;
    this._unbindAllCells();

    const cellsData = event.element.value();
    const cells: any[] = [];
    Object.keys(cellsData).forEach(id => {
      cells.push(cellsData[id]);
    });
    this._graph.resetCells(cells);

    this._bindAllCells();
    this._remote = false;
  }

  private _bindAllCells(): void {
    this._graph.getCells().forEach(this._addCellAdapter);
  }

  private _unbindAllCells(): void {
    Object.keys(this._cellAdapters).forEach(cellId => {
      this._cellAdapters[cellId].unbind();
    });

    this._cellAdapters = {};
  }

  private _graphDetached(): void {
    if (this.isBound()) {
      console.error("Graph object was detach whiled adapter was bound. Unbinding.");
      this.unbind();
    }
  }

  private _remoteGraphSet(_: ObjectSetEvent): void {
    console.log("graph set")
    this.unbind();
    this.bind();
  }

  private _addCellAdapter(cell: any): void {
    const cellModel = this._cellsModel.get(cell.id) as RealTimeObject;
    let adapter: CellAdapter = new CellAdapter(cell, cellModel);
    adapter.bind();
    this._cellAdapters[cell.id] = adapter;
  }

  private _removeCellAdapter(cell: any): void {
    const adapter = this._cellAdapters[cell.id];
    adapter.unbind();
    delete this._cellAdapters[cell.id];
  }
}
