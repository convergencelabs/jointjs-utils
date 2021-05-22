import $ from 'jquery';
import * as joint from "jointjs";

export type StyleCallback = (svgDoc: Document, color: string) => void;

/**
 * Defines the options for the {RemotePointer} class.
 */
export interface RemotePointerOptions extends Backbone.ViewOptions<any> {
  paper: joint.dia.Paper;
  color: string;
  styleCallback?: StyleCallback
  cursorSvgUrl: string;
}

/**
 * Implements a single remote pointer.
 */
export class RemotePointer extends joint.mvc.View<any> {

  private _paper: joint.dia.Paper;
  private _scale: any;

  /**
   * Constructors a new RemotePointer with the supplied options.
   *
   * @param options
   *   The options that configure the RemotePointer
   */
  constructor(options: RemotePointerOptions) {
    super({...options, tagName: 'object', className: 'remote-pointer'});
  }

  public init() {
    this._updateScale = this._updateScale.bind(this);
    this._paper = (this as any).options.paper;
    this._paper.on("scale", this._updateScale);
    this._updateScale();
  }

  public render(): RemotePointer {
    const el = this.el;
    this.$el.attr("data", (this as any).options.cursorSvgUrl);
    this.$el.appendTo(this._paper.el);
    el.addEventListener("load", () => {
      const svgDoc: Document = el.contentDocument;
      if (typeof (this as any).options.styleCallback === "function") {
        (this as any).options.styleCallback(svgDoc, (this as any).options.color);
      } else {
        const pointer = $(svgDoc.getElementsByTagName("path"));
        pointer.css("fill", (this as any).options.color);
      }
    }, false);
    return this;
  }

  /**
   * Remove the pointer from it's parent element and unregister any events.
   *
   * @returns {RemotePointer}
   */
  public remove(): RemotePointer {
    this._paper.off("scale", this._updateScale);
    this.$el.remove();
    return this;
  }

  /**
   * Makes the remote remote pointer invisible, but does not remove it.
   */
  public hide(): void {
    this.$el.css("visibility", "hidden");
  }

  /**
   * Makes the remote pointer visible where ever it currently is.
   */
  public show(): void {
    this.$el.css("visibility", "visible");
  }

  /**
   * Sets the position of the pointer relative to the paper and the current scale.
   *
   * @param x
   *   The x coordinate of the remote pointer
   * @param y
   *   The y coordinate of the remote pointer
   */
  public position(x: number, y: number): void {
    this.$el.css("top", y * this._scale.sy);
    this.$el.css("left", x * this._scale.sx);
  }

  private _updateScale(): void {
    this._scale = joint.V(this._paper.viewport).scale();
  }
}
