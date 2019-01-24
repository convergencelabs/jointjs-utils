import {ColorAssigner} from "@convergence/color-assigner";
import {Activity} from "@convergence/convergence";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";

const defaultColors: string[] = ['mediumseagreen', 'cornflowerblue', 'mediumpurple', 'coral', 'gold', 'plum', 'lightseagreen',
  'mediumorchid', 'aquamarine', 'lightskyblue', 'violet', 'teal', 'lightsalmon', 'orange',
  'royalblue', 'rosybrown', 'crimson', 'khaki', 'mediumvioletred', 'peachpuff', 'firebrick',
  'palevioletred', 'slateblue', 'chocolate', 'darksalmon', 'forestgreen', 'deeppink', 'indianred',
  'darkmagenta', 'lightcoral', 'sandybrown', 'orangered', 'darkseagreen', 'burlywood', 'steelblue',
  'blueviolet', 'hotpink', 'tomato'];


export class ActivityColorManager {

  private _colorAssigner: ColorAssigner;
  private _disposed: boolean;
  private _joinedSubscription: Subscription;
  private _leftSubscription: Subscription;

  constructor(activity: Activity, colors?: string[]) {
    if (!(activity instanceof Activity)) {
      throw new Error("Activity must be defined, and be an instance of a Convergence Activity.");
    }

    colors = colors || defaultColors;

    this._colorAssigner = new ColorAssigner(colors);

    this._joinedSubscription = activity.events()
      .pipe(filter(e => e.name === "session_joined"))
      .subscribe(e => this._addSession(e.sessionId));

    this._leftSubscription = activity.events()
      .pipe(filter(e => e.name === "session_left"))
      .subscribe(e => this._removeSession(e.sessionId));

    this._disposed = false;
  }

  public isDisposed(): boolean {
    return this._disposed;
  }

  public dispose(): void {
    this._disposed = true;
    this._joinedSubscription.unsubscribe();
    this._leftSubscription.unsubscribe();
  }

  public color(sessionId): string {
    return this._colorAssigner.getColorAsHex(sessionId);
  }

  private _addSession(sessionId): void {
    this._colorAssigner.getColor(sessionId);
  }

  private _removeSession(sessionId): void {
    this._colorAssigner.releaseColor(sessionId);
  }
}
