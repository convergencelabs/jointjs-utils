declare namespace g {
  function normalizeAngle(angle: number): number;
  function snapToGrid(val: number, gridSize: number): number;
  function toDeg(rad: number): number;
  function toRad(deg: number, over360?: boolean): number;
}
