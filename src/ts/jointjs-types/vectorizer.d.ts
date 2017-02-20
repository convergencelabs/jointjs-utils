declare function V(svg: SVGElement): Vectorizer;

declare class Vectorizer {
  constructor(svg: SVGElement);

  scale(): {sx: number, sy: number};
  scale(sx: number, sy?: number): void;

}
