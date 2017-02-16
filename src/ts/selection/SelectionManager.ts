import {RemoteSelection} from "./RemoteSelection";
import {RealTimeModel, LocalElementReference} from "@convergence/convergence";
import {ActivityColorManager} from "../util/ActivityColorManager";

export class SelectionManager {

  private _model: RealTimeModel;
  private _selectionReference: LocalElementReference;
  private _paper: any;
  private _selection: any;
  private _colorManager: ActivityColorManager;

  constructor(model: RealTimeModel, paper: any, selection: any, colorManager: ActivityColorManager) {
    this._model = model;
    this._selectionReference = null;
    this._paper = paper;
    this._selection = selection;
    this._colorManager = colorManager;

    this._selectionReference = this._model.elementReference("selection");
    this._selectionReference.share();

    this._model.references({key: "selection"}).forEach(ref => this._processReference(ref));
    this._model.on("reference", this._handleReferenceCreated);

    this._selection.collection.on("reset add remove", this._handleSelectionChanged, this);
    this._handleSelectionChanged();

    this._handleReferenceCreated = this._handleReferenceCreated.bind(this);
  }

  dispose(): void {
    this._model.off("reference", this._handleReferenceCreated);
    this._selection.collection.off("reset add remove", this._handleSelectionChanged, this);
  }

  private _handleReferenceCreated(event): void {
    this._processReference(event.reference)
  }

  private _handleSelectionChanged(): void {
    const cellModels = this._selection.collection.map(function (cell) {
      return this._model.elementAt(["cells", cell.id]);
    }, this);
    this._selectionReference.set(cellModels);
  }

  private _processReference(reference): void {
    if (!reference.isLocal()) {
      const color: string = this._colorManager.color(reference.sessionId());
      new RemoteSelection({reference: reference, color: color, paper: this._paper});
    }
  }
}
