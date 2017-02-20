declare namespace joint {
  namespace dia {
    class Graph extends Backbone.Model {
      fromJSON(json: any, opt?: any): void;
      toJSON(): any;
      getCells(): Cell[];
      getCell(id: string): Cell;
      addCell(cell: any, opt?: any);
    }
  }
}
