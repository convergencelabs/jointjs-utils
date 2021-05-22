import * as joint from "jointjs";

export interface RemoteSelectionItemOptions extends Backbone.ViewOptions<any> {
  paper: joint.dia.Paper;
  parent: JQuery,
  cell: joint.dia.Cell;
  color: string;
}

export class RemoteSelectionItem extends joint.mvc.View<any> {
  constructor(options: RemoteSelectionItemOptions) {
    super({...options, tagName: 'div', className: 'remote-selection-item' });
  }

  init() {
    this.update = this.update.bind(this);
    (this as any).options.cell.on("change", this.update);
    this.$el.appendTo((this as any).options.parent);
    this.update();
  }

  update() {
    // The transformation matrix.
    const ctm = (this as any).options.paper.viewport.getCTM();
    const cellBBox = (this as any).options.cell.getBBox();

    cellBBox.x *= ctm.a;
    cellBBox.x += ctm.e;
    cellBBox.y *= ctm.d;
    cellBBox.y += ctm.f;
    cellBBox.width *= ctm.a;
    cellBBox.height *= ctm.d;

    const angle = joint.g.normalizeAngle((this as any).options.cell.get("angle") || 0);
    const rotateStyle = "rotate(" + angle + "deg)";

    this.$el.css({
      color: (this as any).options.color,
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
    (this as any).options.cell.off("change", this.update);
    this.$el.remove();
    return this;
  }
}
