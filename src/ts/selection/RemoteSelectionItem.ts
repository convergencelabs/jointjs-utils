
declare const joint: any;
declare const g: any;

export const RemoteSelectionItem = joint.mvc.View.extend({

  tagName: 'div',
  className: 'remote-selection-item',

  constructor: function (options) {
    joint.mvc.View.call(this, options);
  },

  init: function () {
    this.options.cell.on("change", this.update.bind(this));
    this.$el.appendTo(this.options.parent);
    this.update();
  },

  update: function () {
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
  },

  remove: function () {
    this.$el.remove();
  }
});