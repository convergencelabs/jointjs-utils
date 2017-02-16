import * as $ from 'jquery';

declare const joint: any;
declare const V: Function;

export const RemotePointer = joint.mvc.View.extend({

  tagName: 'object',
  className: 'remote-pointer',

  init: function () {
    this.paper = this.options.paper;
    this.paper.on("scale", e => this.scale = V(this.paper.viewport).scale());
    this.scale = V(this.paper.viewport).scale();
  },

  render: function () {
    const el = this.el;
    this.$el.attr("data", this.options.cursorSvgUrl);
    this.$el.appendTo(this.options.paper.el);
    el.addEventListener("load", () => {
      const svgDoc = el.contentDocument;
      const pointer = $(svgDoc.getElementById("cursor"));
      pointer.css("fill", this.options.color);
    }, false);
  },

  remove: function () {
    this.$el.remove();
  },

  hide: function () {
    this.$el.css("visibility", "hidden");
  },

  show: function () {
    this.$el.css("visibility", "visible");
  },

  position: function (x, y) {
    this.$el.css("top", y * this.scale.sy);
    this.$el.css("left", x * this.scale.sx);
  }
});
