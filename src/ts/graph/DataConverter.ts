export class DataConverter {
  public static graphJsonToModelData(graphJson: any): any {
    const initData = {
      cells: {}
    };
    graphJson.cells.forEach(function (cell) {
      initData.cells[cell.id] = cell;
    });
    return initData;
  }

  public static modelDataToGraphJson(data: any): any {
    const graphJson = {
      cells: []
    };
    Object.keys(data.cells).forEach(function (id) {
      graphJson.cells.push(data.cells[id]);
    });
    return graphJson;
  }
}