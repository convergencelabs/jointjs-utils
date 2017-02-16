import * as ColorAssigner from "@convergence/color-assigner";
import {Activity} from "@convergence/convergence";

const defaultColors: string[] = ['mediumseagreen', 'cornflowerblue', 'mediumpurple', 'coral', 'gold', 'plum', 'lightseagreen',
  'mediumorchid', 'aquamarine', 'lightskyblue', 'violet', 'teal', 'lightsalmon', 'orange',
  'royalblue', 'rosybrown', 'crimson', 'khaki', 'mediumvioletred', 'peachpuff', 'firebrick',
  'palevioletred', 'slateblue', 'chocolate', 'darksalmon', 'forestgreen', 'deeppink', 'indianred',
  'darkmagenta', 'lightcoral', 'sandybrown', 'orangered', 'darkseagreen', 'burlywood', 'steelblue',
  'blueviolet', 'hotpink', 'tomato'];

// TODO This could be moved to it's own module as it is useful across many applications.
export class ActivityColorManager {

  private _colorAssigner: ColorAssigner;

  constructor(activity: Activity, colors?: string[]) {
    colors = colors || defaultColors;

    this._colorAssigner = new ColorAssigner(colors);

    activity.events()
      .filter(e => e.name === "session_joined")
      .subscribe(e => this._addSession(e.sessionId));

    activity.events()
      .filter(e => e.name === "session_left")
      .subscribe(e => this._removeSession(e.sessionId));
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
