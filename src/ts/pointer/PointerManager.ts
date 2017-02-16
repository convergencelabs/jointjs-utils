import {Activity} from "@convergence/convergence";
import {Subscription} from "rxjs";
import {RemotePointer} from "./RemotePointer";
import {rateLimit, RateLimitedFunction} from "../util/rateLimit";
import {ActivityColorManager} from "../util/ActivityColorManager";

declare const V: any;

export class PointerManager {

  private _paper: any;
  private _activity: Activity;
  private _colorManager: ActivityColorManager;
  private _remotePointers = {};
  private _activitySubscription: Subscription;
  private _mouseMoveCallback: RateLimitedFunction;
  private _scale: any;
  private _cursorSvgUrl: string;

  constructor(paper, activity, colorManager, cursorSvgUrl) {
    this._paper = paper;
    this._activity = activity;
    this._colorManager = colorManager;
    this._remotePointers = {};
    this._activitySubscription = null;
    this._mouseMoveCallback = null;
    this._cursorSvgUrl = cursorSvgUrl;

    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onScaleUpdated = this._onScaleUpdated.bind(this);

    this._init();
  }

  private _init(): void {
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
    this._scale = V(this._paper.viewport).scale();

    this._mouseMoveCallback = rateLimit(this._onMouseMove, 40, true);
    this._paper.$el.mousemove(this._mouseMoveCallback.func);
    this._paper.$el.mouseleave(this._onMouseLeave);
  }

  public dispose(): void {
    if (this._activitySubscription !== null) {
      this._activitySubscription.unsubscribe();
      this._activitySubscription = null;
    }

    this._paper.off("scale", this._onScaleUpdated);
    this._paper.$el.off("mousemove", this._mouseMoveCallback.func);
    this._paper.$el.off("mouseleave", this._onMouseLeave);
  }

  private _onScaleUpdated(e): void {
    this._scale = V(this._paper.viewport).scale()
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

  private _onMouseLeave(e): void {
    this._mouseMoveCallback.clear();
    this._activity.removeState("pointer");
  }

  private _onMouseMove(e): void {
    const parentOffset = this._paper.$el.offset();
    const relX = (e.pageX - parentOffset.left) / this._scale.sx;
    const relY = (e.pageY - parentOffset.top) / this._scale.sy;

    this._activity.setState("pointer", {x: relX, y: relY});
  }

  private _addRemotePointer(participant): void {
    const color = this._colorManager.color(participant.sessionId);
    const remotePointer = new RemotePointer({paper: this._paper, color: color, cursorSvgUrl: this._cursorSvgUrl});
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
