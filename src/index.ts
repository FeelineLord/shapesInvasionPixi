import '@styles/styles.scss';
import {App} from './models/App';

import * as PIXI from 'pixi.js';

const start = (width, height, size) => {
  const root = document.querySelector('#root') as HTMLElement;
  const gravity = new PIXI.Application({
    antialias: true,
    width,
    height,
    transparent: true
  });

  gravity.view.id = 'gravity';
  gravity.view.className= 'gravity';

  root.append(gravity.view);

  const app = new App(gravity, width, height, size);
  app.init();

  window.addEventListener('load', () => {
    app.start();
  });
};

start(1920, 1080, 5);
