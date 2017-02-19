import {RemoteSelectionItem} from "./RemoteSelectionItem";
import {RealTimeObject} from "@convergence/convergence";

declare const joint: any;

export interface RemoteSelection {
  setCells(cellModels: RealTimeObject);
}

export const RemoteSelection = joint.mvc.View.extend({

  tagName: 'div',
  className: 'remote-selection',

  constructor: function (options) {
    joint.mvc.View.call(this, options);
  },

  init: function (): void {
    this.$el.appendTo(this.options.paper.el);
    this.$el.empty();

    this.options.reference.on("set", event => this.setCells(event.src.values()));
    this.options.reference.on("clear", cellIds => this.clear());
    this.options.reference.on("disposed", cellIds => this.remove());

    this.setCells(this.options.reference.values());
  },

  setCells: function (cellModels: RealTimeObject) {
    this.clear();
    cellModels.forEach(cellModel => {
      const cell = this.options.paper.model.getCell(cellModel.path().pop());
      new RemoteSelectionItem({
        paper: this.options.paper,
        parent: this.$el,
        cell: cell,
        color: this.options.color
      });
    });
  },

  clear: function (): void {
    this.$el.empty();
  },

  remove: function (): void {
    this.$el.remove();
  }
});