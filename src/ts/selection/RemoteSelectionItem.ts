
import ViewOptions = Backbone.ViewOptions;
export interface RemoteSelectionItemOptions extends ViewOptions<any> {
  paper: joint.dia.Paper;
  parent: JQuery,
  cell: joint.dia.Cell;
  color: string;
}

export class RemoteSelectionItem extends joint.mvc.View<any> {

  get tagName(): string {return 'div';}
  get className(): string {return 'remote-selection-item';}

  constructor(options: RemoteSelectionItemOptions) {
    super(options);
  }

  init() {
    this.update = this.update.bind(this);
    this.options.cell.on("change", this.update);
    this.$el.appendTo(this.options.parent);
    this.update();
  }

  update() {
    // The transformation matrix.
    const ctm = this.options.paper.viewport.getCTM();
    const cellBBox = this.options.cell.getBBox();

    cellBBox.x *= ctm.a;
    cellBBox.x += ctm.e;
    cellBBox.y *= ctm.d;
    cellBBox.y += ctm.f;
    cellBBox.width *= ctm.a;
    cellBBox.height *= ctm.d;

    const angle = g.normalizeAngle(this.options.cell.get("angle") || 0);
    const rotateStyle = "rotate(" + angle + "deg)";

    this.$el.css({
      color: this.options.color,
      width: cellBBox.width + 4,
      height: cellBBox.height + 4,
      left: cellBBox.x - 3,
      top: cellBBox.y - 3,
      transform: rotateStyle,
      "-webkit-transform": rotateStyle,
      "-ms-transform": rotateStyle
    });
  }

  remove(): RemoteSelectionItem {
    this.options.cell.off("change", this.update);
    this.$el.remove();
    return this;
  }
}
