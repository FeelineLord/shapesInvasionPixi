import * as PIXI from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';
import {Abstract} from './Abstract';
import {getShapeDots} from "../logic/shapesDots";

export class Shape extends Abstract {
  events;

  constructor(
    app: PIXI.Application,
    width: number,
    height: number,
    size: number,
    shapeWidth: number,
    shapeHeight: number,
    cx: number,
    cy: number,
    type: string,
    color: number,
    events: any
  ) {
    super(app, width, height, size);
    this._state = {
      initialized: false,
      visible: false,
      id: uuidv4(),
      width: shapeWidth,
      height: shapeHeight,
      cx,
      cy,
      type,
      dots: [],
      area: 0,
      color
    };

    this.events = events;
  }

  public init = (callback: () => void): void => {
    const {
      width,
      height,
      type
    } = this.state;



    const data = getShapeDots(type, 0, 0, width, height, this.size);

    this.setState({
      dots: data.dots,
      area: data.area,
    }, () => {
      this.draw(this.state);
    });

    callback();
  };

  private draw = (state): void => {
    if (
      state.context
    ) {
      state.context.destroy()
    }

    const graphics = new PIXI.Graphics();

    graphics.clear();

    graphics.beginFill(this.state.color, 0.5);

    if (
      state.type === 'circle'
    ) {
      graphics.arc(state.dots[0].x, state.dots[0].y, state.width / 2, 0, 2 * Math.PI);
    } else if (
      state.type === 'hearth' ||
      state.type === 'ellipse'
    ) {
      state.dots.forEach((d, i) => {
        if (i === 0) {
          graphics.moveTo(d[0].x, d[0].y);
        } else {
          graphics.bezierCurveTo(d[0].x, d[0].y, d[1].x, d[1].y, d[2].x, d[2].y);
        }
      });
    } else {
      const path: number[] = [];
      for (const d of state.dots) {
        path.push(d.x);
        path.push(d.y);
      }

      graphics.drawPolygon(path.flat());
      graphics.closePath();
    }

    graphics.endFill();

    const container = new PIXI.Container();
    container.buttonMode = true;
    container.interactive = true;
    container.x = state.cx;
    container.y = state.cy;

    container.on('pointerdown', this.onClick);

    container.addChild(graphics);

    this.setState({
      context: container
    });

    this.app.stage.addChild(container);
  };

  private update = (gravity, updateValues): void => {
    const {
      context,
      height,
      cy,
      visible
    } = this.state;

    context.y = cy + gravity;

    this.setState({
      cy: cy + gravity
    });

    if (
      cy + gravity + height > 0 &&
      !visible
    ) {
      this.setState({
        visible: true
      }, () => {
        updateValues(this.state.area, true);
      });
    }
  };

  public run = (
    remove: (id: string, type: string, area: number, context: PIXI.Container) => void,
    gravity: number,
    updateValues
  ): void => {
    const {
      id,
      type,
      cy,
      area,
      context
    } = this.state;

    this.update(gravity, updateValues);

    if (
      cy > this.height
    ) {
      remove(id, type, area, context);
    }
  };

  public changeColor = (color, id): void => {
    if (
      id === this.state.id
    ) {
      return ;
    }

    this.setState({
      color
    });

    this.draw(this.state);
  };

  private onClick = (): void => {
    const {
      id,
      type,
      area,
      color,
      context
    } = this.state;

    this.events.shapeClick(id, type, area, color, context);
  };
}
