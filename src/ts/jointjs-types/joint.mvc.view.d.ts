declare namespace joint {


  // `joint.mvc` namespace.
  namespace mvc {
    import ViewOptions = Backbone.ViewOptions;
    class View<T extends Backbone.Model> extends Backbone.View<T> {
      protected options: any;

      constructor(options: ViewOptions<T>);

      initialize(options: ViewOptions<T>);

      init(): void;

      onRender(): void;

      setTheme(theme: string, opt: any): void;

      addThemeClassName(theme: string): void;

      removeThemeClassName(theme: string): void;

      onSetTheme(oldTheme: string, newTheme: string): void;

      remove(): View<T>;

      onRemove(): void;
    }
  }
}
