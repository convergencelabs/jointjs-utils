declare namespace joint {
  namespace dia {
    class Cell extends Backbone.Model {
      constructor(attributes?: any, options?: any);

      translate(dx: number, dy: number, opt: any);

      remove(opt?: any): Cell;

      toFront(opt?: any): Cell;

      toBack(opt?: any): Cell;

      embed(cell: Cell, opt?: any): Cell;

      unembed(cell: Cell, opt?: any): Cell;

      getAncestors(): Cell[];

      getEmbeddedCells(opt?: any): Cell[];

      isEmbeddedIn(cell: Cell, opt?: any): boolean;

      isEmbedded(): boolean;

      clone(opt?: any): Cell;

      prop(props: string | {[key: string]: any}, value: any, opt?: any): Cell;

      removeProp(path: string, opt?: any): this;

      attr(attrs: string | {[key: string]: any}, value: any, opt?: any): Cell;

      removeAttr(path: string, opt?: any): Cell;

      transition(path: string, value: any, opt?: any, delim?: any): number;

      getTransitions(): string[];

      stopTransitions(path, delim): Cell;

      addTo(graph: joint.dia.Graph, opt?: any): Cell;

      findView(paper: joint.dia.Paper): CellView;

      isLink(): boolean;

      isElement(): boolean;

      startBatch(name: string, opt?: any): Cell;
      stopBatch(name: string, opt?: any): Cell;
    }

    class CellView extends joint.mvc.View<Cell> {
      tagName: string;

      can(feature: string): boolean;

      highlight(el: HTMLElement, opt?: any): CellView;
      unhighlight(el: HTMLElement, opt?: any): CellView;

      findMagnet(el: HTMLElement): HTMLElement;
    }
  }
}

