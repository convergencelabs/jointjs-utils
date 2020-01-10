import {RemoteSelection} from "./RemoteSelection";
import {
  ElementReference,
  LocalElementReference,
  RealTimeModel,
  RemoteReferenceCreatedEvent
} from "@convergence/convergence";
import {ActivityColorManager} from "../util/";
import {GraphAdapter} from "../graph/";
import * as joint from "jointjs";

/**
 * The SelectionManager provides remote selection awareness rendering remote
 * selections to a paper. The class depends on a GraphAdapter that has bound
 * a Graph to a RealTimeModel. The model (graph) of the Paper to render the
 * selections on must be the same graph as in the GraphAdapter.
 */
export class SelectionManager {

  private _model: RealTimeModel;
  private _selectionReference: LocalElementReference;
  private readonly _paper: joint.dia.Paper;
  private _colorManager: ActivityColorManager;
  private _disposed: boolean;
  private _remoteSelections: {[key: string]: RemoteSelection};

  /**
   * Creates a new SelectionManager.
   *
   * @param paper
   *   Remote selections are rendered on this paper.  The paper's model (graph) must be
   *   the same graph that the graphAdapter is bound to.
   *
   * @param graphAdapter
   *   A GraphAdapter that binds a graph to a RealTimeModel. The GraphAdapter must be bound.
   *
   * @param colorManager
   *   Manages the colors of the remote selections.
   */
  constructor(paper: any, graphAdapter: GraphAdapter, colorManager: ActivityColorManager) {
    if (paper.options.model !== graphAdapter.graph()) {
      throw new Error("The supplied paper and graphAdapter must have the same graph.");
    }

    if (!graphAdapter.isBound()) {
      throw new Error("The graphAdapter must be bound.");
    }

    this._remoteSelections = {};
    this._model = graphAdapter.graphObject().model();
    this._paper = paper;
    this._colorManager = colorManager;

    this._selectionReference = this._model.elementReference("selection");
    this._selectionReference.share();

    this._model.references({key: "selection"}).forEach(ref => this._processReference(ref));
    this._model.on("reference", (event: RemoteReferenceCreatedEvent) => {
      this._processReference(event.reference);
    });

    this._disposed = false;
  }

  /**
   * Determines if the SelectionManager is disposed.
   *
   * @returns {boolean}
   *   True if the SelectionManager is disposed, false otherwise.
   */
  public isDisposed(): boolean {
    return this._disposed;
  }

  /**
   * Disposes of this SelectionManager. After dispose is called, local
   * selections will not be sent out and remote selections will not be
   * rendered.
   */
  public dispose(): void {
    if (this._disposed) {
      return;
    }

    this._model.off("reference", this._handleReferenceCreated);
    Object.keys(this._remoteSelections).forEach(k => {
      this._remoteSelections[k].remove();
    });

    this._remoteSelections = {};
    this._disposed = true;
  }

  public setSelectedCells(selectedCells: null | joint.dia.Cell | joint.dia.Cell[]): void {
    if (this._disposed) {
      return;
    }

    if (selectedCells === null) {
      selectedCells = [];
    }

    if (!Array.isArray(selectedCells)) {
      selectedCells = [selectedCells];
    }

    const cellModels = selectedCells.map(cell => {
      return this._model.elementAt(["cells", cell.id]);
    });
    this._selectionReference.set(cellModels);
  }

  private _handleReferenceCreated(event: RemoteReferenceCreatedEvent): void {
    this._processReference(event.reference)
  }

  private _processReference(reference: ElementReference): void {
    if (!reference.isLocal()) {
      const color: string = this._colorManager.color(reference.sessionId());
      this._remoteSelections[reference.sessionId()] = new RemoteSelection({
        reference: reference,
        color: color,
        paper: this._paper
      });
      reference.on("disposed", () => {
        delete this._remoteSelections[reference.sessionId()];
      });
    }
  }
}
