export class Abstract {
  readonly app: PIXI.Application;
  readonly view: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  readonly size: number;
  public _state: any;

  constructor(
    app: PIXI.Application,
    width: number,
    height: number,
    size: number
  ) {
    this.app = app;
    this.view = app.view;
    this.width = width;
    this.height = height;
    this.size = size;
  }

  protected setState = (newValues, callback?: () => void) => {
    const keys = Object.keys(newValues);

    for (const key of keys) {
      this.state[key] = newValues[key]
    }

    if (
      typeof callback !== 'undefined'
    ) {
      callback()
    }
  };

  protected getRandomInt = (min: number, max: number): number => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  protected getRandomColor = (): number => {
    return parseInt('0X' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase());
  };

  get state() {
    return this._state;
  };
}
