/**
 * The DataConverter is a utility that converts between the JointJS JSON
 * representation of a Graph and the Convergence RealTimeModel JSON
 * representation of a Graph.
 */
export class DataConverter {

  /**
   * Converts the JointJS JSON representation of a graph to the Convergence
   * RealTimeModel JSON representation of a graph.
   *
   * @param graphJson
   *   The JointJS JSON representation of a Graph.
   *
   * @returns {{cells: {}}}
   *   The Convergence RealTimeModel representation of a Graph.
   */
  public static graphJsonToModelData(graphJson: any): any {
    const initData = {
      cells: {}
    };
    graphJson.cells.forEach(cell => {
      initData.cells[cell.id] = cell;
    });
    return initData;
  }

  /**
   * Converts the Convergence RealTimeModel JSON representation of a Graph
   * to the JointJS representation of a Graph.
   *
   * @param modelData
   *   The RealTimeModel JSON representation of a Graph.
   *
   * @returns {{cells: Array}}
   *   The JointJS JSON representation of a Graph.
   */
  public static modelDataToGraphJson(modelData: any): any {
    const graphJson = {
      cells: []
    };
    Object.keys(modelData.cells).forEach(id => {
      graphJson.cells.push(modelData.cells[id]);
    });
    return graphJson;
  }
}
