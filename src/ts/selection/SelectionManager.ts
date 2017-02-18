import {RemoteSelection} from "./RemoteSelection";
import {RealTimeModel, LocalElementReference, RemoteReferenceCreatedEvent} from "@convergence/convergence";
import {ActivityColorManager} from "../util/ActivityColorManager";

export class SelectionManager {

  private _model: RealTimeModel;
  private _selectionReference: LocalElementReference;
  private _paper: any;
  private _colorManager: ActivityColorManager;

  constructor(paper: any, model: RealTimeModel, colorManager: ActivityColorManager) {
    this._model = model;
    this._selectionReference = null;
    this._paper = paper;
    this._colorManager = colorManager;

    this._selectionReference = this._model.elementReference("selection");
    this._selectionReference.share();

    this._model.references({key: "selection"}).forEach(ref => this._processReference(ref));
    this._model.on("reference", (event: RemoteReferenceCreatedEvent) => {
      this._processReference(event.reference);
    });
  }

  dispose(): void {
    this._model.off("reference", this._handleReferenceCreated);
  }

  private _handleReferenceCreated(event): void {
    this._processReference(event.reference)
  }

  public setSelectedCells(selectedCells): void {
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

  private _processReference(reference): void {
    if (!reference.isLocal()) {
      const color: string = this._colorManager.color(reference.sessionId());
      new RemoteSelection({reference: reference, color: color, paper: this._paper});
    }
  }
}
