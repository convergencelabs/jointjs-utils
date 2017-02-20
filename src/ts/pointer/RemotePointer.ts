import * as $ from 'jquery';
import ViewOptions = Backbone.ViewOptions;

/**
 * Defines the options for the {RemotePointer} class.
 */
export interface RemotePointerOptions extends ViewOptions<any> {
  paper: joint.dia.Paper;
  color: string;
  cursorSvgUrl: string;
}

/**
 * Implements a single remote pointer.
 */
export class RemotePointer extends joint.mvc.View<any> {

  get tagName(): string {return 'object';}
  get className(): string {return 'remote-pointer';}

  private _paper: joint.dia.Paper;
  private _scale: any;

  /**
   * Constructors a new RemotePointer with the supplied options.
   *
   * @param options
   *   The options that configure the RemotePointer
   */
  constructor(options: RemotePointerOptions) {
    super(options);
  }

  public init() {
    this._updateScale = this._updateScale.bind(this);

    this._paper = this.options.paper;
    this._paper.on("scale", this._updateScale);
    this._updateScale();
  }

  public render(): RemotePointer {
    const el = this.el;
    this.$el.attr("data", this.options.cursorSvgUrl);
    this.$el.appendTo(this._paper.el);
    el.addEventListener("load", () => {
      const svgDoc = el.contentDocument;
      const pointer = $(svgDoc.getElementById("cursor"));
      pointer.css("fill", this.options.color);
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
    this._scale = V(this._paper.viewport).scale();
  }
}
