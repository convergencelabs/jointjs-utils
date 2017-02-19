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

  public static modelDataToGraphJson(modelData: any): any {
    const graphJson = {
      cells: []
    };
    Object.keys(modelData.cells).forEach(function (id) {
      graphJson.cells.push(modelData.cells[id]);
    });
    return graphJson;
  }
}