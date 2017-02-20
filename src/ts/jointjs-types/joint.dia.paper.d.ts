declare namespace joint {
  namespace dia {
    class Paper extends joint.mvc.View<any> {
      init(): void;
      setDimensions(width: number, height: number): void;
      setOrigin(ox: number, oy: number): void;

      viewport: SVGGElement;
    }
  }
}
