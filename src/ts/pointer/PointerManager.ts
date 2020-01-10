import {Activity} from "@convergence/convergence";
import {Subscription} from "rxjs";
import {RemotePointer, StyleCallback} from "./RemotePointer";
import {rateLimit, RateLimitedFunction} from "../util/rateLimit";
import {ActivityColorManager} from "../util/";
import * as joint from "jointjs";

/**
 * The PointerManager implements shared pointers attached to a Paper and
 * communicated via a Convergence Activity.
 */
export class PointerManager {

  private readonly _paper: joint.dia.Paper;
  private _activity: Activity;
  private _colorManager: ActivityColorManager;
  private readonly _remotePointers = {};
  private _activitySubscription: Subscription;
  private _mouseMoveCallback: RateLimitedFunction<(eventObject: JQuery.Event) => any>;
  private _scale: {sx: number, sy: number};
  private readonly _cursorSvgUrl: string;
  private _disposed: boolean;
  private readonly _styleCallback: StyleCallback;

  /**
   * Constructs a new PointerManager.
   *
   * @param paper
   *   The paper to source local mouse events from and on which to render
   *   remote pointers.
   *
   * @param activity
   *   The activity that is used to broadcast and receive pointer locations.
   *
   * @param colorManager
   *   The ActivityColorManager that will be used to obtain the colors of the pointers.
   *
   * @param cursorSvgUrl
   *   The url of the svg data to use to render the remote cursors.
   *
   * @param styleCallback
   *   A callback to set the style of cursors.
   */
  constructor(paper: joint.dia.Paper,
              activity: Activity,
              colorManager: ActivityColorManager,
              cursorSvgUrl: string,
              styleCallback?: StyleCallback) {
    this._paper = paper;
    this._activity = activity;
    this._colorManager = colorManager;
    this._remotePointers = {};
    this._activitySubscription = null;
    this._mouseMoveCallback = null;
    this._cursorSvgUrl = cursorSvgUrl;
    this._styleCallback = styleCallback;

    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onScaleUpdated = this._onScaleUpdated.bind(this);

    this._disposed = false;

    // Initialize any existing participants.
    this._activity.participants().forEach((participant) => {
      if (!participant.local) {
        this._addRemotePointer(participant);
      }
    });

    // Process the activity events
    this._activitySubscription = this._activity.events().subscribe(e => {
      if (e.local) {
        return;
      }

      switch(e.name) {
        case "session_joined":
          this._onSessionJoined(e);
          break;
        case "session_left":
          this._onSessionLeft(e);
          break;
        case "state_set":
          this._onStateSet(e);
          break;
        case "state_removed":
          this._onStateRemoved(e);
          break;
      }
    });

    // Listen to events from the paper
    this._paper.on("scale", this._onScaleUpdated);
    this._onScaleUpdated();

    this._mouseMoveCallback = rateLimit(this._onMouseMove, 40, true);
    this._paper.$el.on("mousemove", this._mouseMoveCallback.func);
    this._paper.$el.on("mouseleave", this._onMouseLeave);
  }

  /**
   * Disposes this PointerManager. All remote pointers will be removed. Local
   * pointer events will not longer be sent. After calling dispose, this
   * instance is essentially useless.
   */
  public dispose(): void {
    if (this._disposed) {
      return;
    }

    if (this._activitySubscription !== null) {
      this._activitySubscription.unsubscribe();
      this._activitySubscription = null;
    }

    this._paper.off("scale", this._onScaleUpdated);
    this._paper.$el.off("mousemove", this._mouseMoveCallback.func);
    this._paper.$el.off("mouseleave", this._onMouseLeave);

    Object.keys(this._remotePointers).forEach(key => {
      this._remotePointers[key].remove();
    });

    this._disposed = true;
  }

  /**
   * Determines if the PointerManager is disposed.
   *
   * @returns {boolean}
   *   True if the PointerManager is disposed, false otherwise.
   */
  public isDisposed(): boolean {
    return this._disposed;
  }

  private _onScaleUpdated(): void {
    // TODO in a recent version of JointJS, the scale might exist on the Paper.
    this._scale = joint.V(this._paper.viewport).scale();
  }

  private _onSessionJoined(e): void {
    this._addRemotePointer(e.participant);
  }

  private _onSessionLeft(e): void {
    const sessionId = e.sessionId;
    this._remotePointers[sessionId].remove();
    delete this._remotePointers[sessionId];
  }

  private _onStateSet(e): void {
    if (e.key === "pointer") {
      this._remotePointers[e.sessionId].show();
      this._remotePointers[e.sessionId].position(e.value.x, e.value.y);
    }
  }

  private _onStateRemoved(e): void {
    if (e.key === "pointer") {
      this._remotePointers[e.sessionId].hide();
    }
  }

  private _onMouseLeave(_: JQuery.Event): void {
    this._mouseMoveCallback.clear();
    this._activity.removeState("pointer");
  }

  private _onMouseMove(e: JQuery.Event): void {
    const parentOffset = this._paper.$el.offset();
    const relX = (e.pageX - parentOffset.left) / this._scale.sx;
    const relY = (e.pageY - parentOffset.top) / this._scale.sy;

    this._activity.setState("pointer", {x: relX, y: relY});
  }

  private _addRemotePointer(participant): void {
    const color = this._colorManager.color(participant.sessionId);
    const remotePointer = new RemotePointer({paper: this._paper, color: color, cursorSvgUrl: this._cursorSvgUrl, styleCallback: this._styleCallback});
    remotePointer.render();
    const coords = participant.state.get("pointer");
    if (coords) {
      remotePointer.position(coords.x, coords.y);
      remotePointer.show();
    } else {
      remotePointer.hide();
    }

    this._remotePointers[participant.sessionId] = remotePointer;
  }
}
