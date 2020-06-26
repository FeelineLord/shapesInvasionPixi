import * as PIXI from 'pixi.js';
import {Abstract} from './Abstract';
import {Shape} from './Shape';

import {shapeTypes} from "../logic/shapeTypes";

const UI = {
  shapesAmount: document.querySelector('#shapesAmount') as HTMLElement,
  surfaceArea: document.querySelector('#surfaceArea') as HTMLElement,
  spawn: document.querySelector('#spawnValue') as HTMLElement,
  gravity: document.querySelector('#gravityValue') as HTMLElement
};

export class App extends Abstract {
  animationCount: number
  field: PIXI.Graphics
  ticker: PIXI.Ticker

  constructor(
    app: PIXI.Application,
    width: number,
    height: number,
    size: number
  ) {
    super(app, width, height, size);

    this._state = {
      shapes: {
        triangle: [],
        rectangle: [],
        pentagon: [],
        hexagon: [],
        circle: [],
        ellipse: [],
        hearth: []
      },
      amount: 0,
      area: 0,
      spawn: 3,
      gravity: 3
    }

    this.animationCount = 0;

    this.field = new PIXI.Graphics();

    this.ticker = new PIXI.Ticker;
  }

  private setEvents = (): void => {
    const buttonEvents = {
      spawnDecr: document.querySelector('#spawnDecr'),
      spawnIncr: document.querySelector('#spawnIncr'),
      gravityDecr: document.querySelector('#gravityDecr'),
      gravityIncr: document.querySelector('#gravityIncr')
    };

    const modify = (param: string, positive: boolean) => {
      let prev = this.state[param];

      if (
        positive &&
        prev >= 60
      ) {
        return;
      } else if (
        !positive &&
        prev <= 1
      ) {
        return;
      }

      this.setState({
        [param]: positive ? prev + 1 : prev - 1
      }, () => {
        this.updateUi();
      });
    };

    const handleChange = (event): void => {
      switch (event.target.id) {
        case 'spawnDecr':
          modify('spawn', false);
          break;

        case 'spawnIncr':
          modify('spawn', true);
          break;

        case 'gravityDecr':
          modify('gravity', false);
          break;

        case 'gravityIncr':
          modify('gravity', true);
          break;
      }
    };

    for (const ev in buttonEvents) {
      buttonEvents[ev].addEventListener('click', handleChange);
    }

    this.field.beginFill(0xFFFFFF, 0.01);
    this.field.drawRect(0, 0, this.width, this.height);
    this.field.endFill();
    this.field.interactive = true;

    const handleClick = (e): void => {
      const x = (e.data.originalEvent.pageX - this.app.view.offsetLeft) / (this.app.view.offsetWidth / this.app.view.width);
      const y = (e.data.originalEvent.pageY - this.app.view.offsetTop) / (this.app.view.offsetHeight / this.app.view.height);

      this.makeShape(x, y);
    }

    this.field.on('pointerdown', handleClick);
    this.app.stage.addChild(this.field);
  }

  public init = (): void => {
    this.setEvents();
    this.ticker.add(() => {
      this.run();
    });

      this.animationCount = Math.round(this.ticker.FPS)

    setInterval(() => {
      if (this.ticker.FPS < 31) {
        this.animationCount = this.ticker.FPS;
      }
    }, 2000);
  };

  public start = (): void => {
    this.ticker.start();
  };

  private render = () => {
    const {
      shapes,
      gravity
    } = this.state;

    const types = Object.keys(shapes);

    for (const type of types) {
      for (const shape of shapes[type]) {
        shape.run(this.removeShape, gravity, this.updateValues);
      }
    }
  };

  private update = (): void => {
    this.addShape();
  };

  private run = (): void => {
    this.update();
    this.render();
  };

  private makeShape = (x?: number, y?: number): void => {
    const {
      shapes
    } = this.state;

    const shapeIndex = this.getRandomInt(0, 6);
    const shapeType = shapeTypes[shapeIndex];
    let width = 0;
    let height = 0;

    if (
      shapeType === 'rectangle' ||
      shapeType === 'ellipse'
    ) {
      width = this.size * 30;
      height = this.size * 20;
    } else if (
      shapeType === 'hearth'
    ) {
      width = this.size * 22;
      height = this.size * 19;
    } else {
      width = this.size * 20;
      height = this.size * 20;
    }

    const newShapes = {...shapes};

    const shape = new Shape(
      this.app,
      this.width,
      this.height,
      this.size,
      width,
      height,
      x ? x - width / 2 : this.getRandomInt(0, this.width - width),
      y ? y - height / 2 : -this.getRandomInt(height, this.height * 2),
      shapeType,
      this.getRandomColor(),
      {
        shapeClick: this.shapeClick
      }
    );

    shape.init(() => {
      newShapes[shapeType].push(shape);
    });

    this.setState({
      shapes: {...newShapes}
    }, () => {
      this.updateUi();
    });
  };

  private addShape = (): void => {
    const {
      FPS
    } = this.ticker;

    const {
      spawn
    } = this.state;


    if (
      this.animationCount < (Math.round(FPS) / spawn)
    ) {
      this.animationCount += 1
    } else {
      this.makeShape();
      this.animationCount -= Math.round(FPS) / spawn;
    }
  };

  private removeShape = (id: string, type: string, area: number, context: PIXI.Container): void => {
    const {
      shapes
    } = this.state;

    const newShapes = {...shapes};
    newShapes[type] = newShapes[type].filter(s => s.state.id !== id);

    this.setState({
      shapes: newShapes,
    }, () => {
      this.updateValues(area, false);
    });

    context.destroy();
  };

  public shapeClick = (id, type, area, color, context) => {
    const {
      shapes
    } = this.state;

    shapes[type].forEach(s => s.changeColor(color, id));

    this.removeShape(id, type, area, context);
  };

  public updateValues = (shapeArea, add): void => {
    const {
      amount,
      area
    } = this.state;

    if (
      add
    ) {
      this.setState({
        amount: amount + 1,
        area: area + shapeArea
      });
    } else {
      this.setState({
        amount: amount - 1,
        area: area - shapeArea
      }, () => {
        this.updateUi();
      });
    }
  };

  private updateUi = (): void => {
    const {
      amount,
      area,
      spawn,
      gravity
    } = this.state;

    UI.shapesAmount.textContent = '' + amount;
    UI.surfaceArea.textContent = '' + Math.trunc(area);
    UI.spawn.textContent = '' + spawn;
    UI.gravity.textContent = '' + gravity;
  };
}

