import {ShapeDotsInterface} from './shapeTypes';
import ImitationModel from '../models/ImitationModel';

interface ShapeDataInterface {
  area: number
  dots: ShapeDotsInterface[] | ShapeDotsInterface[][]
}

const getUniqueDots = (
  cx,
  cy,
  centerX,
  centerY,
  endX,
  endY,
  size,
  smallStep,
  customStep
): ShapeDotsInterface[][] => {
  return [
    [
      {
        x: centerX,
        y: cy + size * 3
      }
    ],
    [
      {
        x: centerX,
        y: cy + size * 3 - smallStep - customStep
      },
      {
        x: centerX - size,
        y: cy
      },
      {
        x: centerX - size * 5,
        y: cy
      }
    ],
    [
      {
        x: cx,
        y: cy
      },
      {
        x: cx,
        y: centerY - size * 2
      },
      {
        x: cx,
        y: centerY - size * 2
      }
    ],
    [
      {
        x: cx,
        y: centerY + smallStep + size,
      },
      {
        x: cx + size * 4,
        y: endY - size * 4 + smallStep - customStep
      },
      {
        x: centerX,
        y: endY
      }
    ],
    [
      {
        x: endX - size * 4,
        y: endY - size * 4 + smallStep - customStep
      },
      {
        x: endX,
        y: centerY + smallStep + size
      },
      {
        x: endX,
        y: centerY - size * 2
      }
    ],
    [
      {
        x: endX,
        y: centerY - size * 2
      },
      {
        x: endX,
        y: cy
      },
      {
        x: endX - size * 6,
        y: cy
      }
    ],
    [
      {
        x: centerX + size * 2,
        y: cy
      },
      {
        x: centerX,
        y: cy + size * 3 - smallStep - customStep
      },
      {
        x: centerX,
        y: cy + size * 3
      }
    ]
  ]
}

export const getShapeDots = (
  type: string,
  cx: number,
  cy: number,
  width: number,
  height: number,
  size: number
): ShapeDataInterface => {
  let yDiff;
  let xDistance;
  let yDistance;
  let side;

  const centerX = cx + width / 2;
  const centerY = cy + height / 2;
  const endX = cx + width;
  const endY = cy + height;
  const smallStep = size / 2;
  let customStep = size / 10;

  switch(type) {
    case 'triangle':
      return {
        area: getArea('triangle', width, height, 0),
        dots: [
          {
            x: centerX,
            y: cy
          },
          {
            x: endX,
            y: endY
          },
          {
            x: cx,
            y: endY
          },
          {
            x: centerX,
            y: cy
          }
        ]
      };

    case 'rectangle':
      return {
        area: getArea('rectangle', width, height, 0),
        dots: [
          {
            x: cx,
            y: cy
          },
          {
            x: endX,
            y: cy
          },
          {
            x: endX,
            y: endY
          },
          {
            x: cx,
            y: endY
          },
          {
            x: cx,
            y: cy
          }
        ]
      };

    case 'pentagon':
      side = width / (2 * Math.cos(2 * Math.PI / 5) + 1);
      yDiff = width - (side / (2 * Math.tan(Math.PI / 5))) - (side / (2 * Math.sin(Math.PI / 5)));
      xDistance = (width - side) / 2;
      yDistance = Math.sqrt((side * side) - (width / 2) * (width / 2));
      return {
        area: getArea('pentagon', width, height, side),
        dots: [
          {
            x: centerX,
            y: cy + yDiff
          },
          {
            x: endX,
            y: cy + yDiff + yDistance
          },
          {
            x: endX - xDistance,
            y: endY
          },
          {
            x: cx + xDistance,
            y: endY
          },
          {
            x: cx,
            y: cy + yDiff + yDistance
          },
          {
            x: centerX,
            y: cy + yDiff
          }
        ]
      };

    case 'hexagon':
      side = width / 2;
      yDiff = height - 2 * (side / (2 * Math.tan(Math.PI / 6)));
      xDistance = width / 4;
      return {
        area: getArea('hexagon', width, height, side),
        dots: [
          {
            x: cx + xDistance,
            y: cy + yDiff
          },
          {
            x: endX - xDistance,
            y: cy + yDiff
          },
          {
            x: endX,
            y: cy + yDiff + ((height - yDiff) / 2)
          },
          {
            x: endX - xDistance,
            y: endY
          },
          {
            x: cx + xDistance,
            y: endY
          },
          {
            x: cx,
            y: cy + yDiff + ((height - yDiff) / 2)
          },
          {
            x: cx + xDistance,
            y: cy + yDiff
          }
        ]
      }

    case 'circle':
      return {
        area: getArea('circle', width, height, 0),
        dots: [
          {
            x: centerX,
            y: centerY + height / 4
          }
        ]
      };

    case 'ellipse':
      return {
        area: getArea('ellipse', width, height, 0),
        dots: [
          [
            {
              x: endX,
              y: centerY
            }
          ],
          [
            {
              x: endX,
              y: endY - height / 4
            },
            {
              x: endX - width / 4,
              y: endY
            },
            {
              x: centerX,
              y: endY
            }
          ],
          [
            {
              x: cx + width / 4,
              y: endY
            },
            {
              x: cx,
              y: endY - height / 4
            },
            {
              x: cx,
              y: centerY
            }
          ],
          [
            {
              x: cx,
              y: cy + height / 4
            },
            {
              x: cx + width / 4,
              y: cy
            },
            {
              x: centerX,
              y: cy
            }
          ],
          [
            {
              x: endX - width / 4,
              y: cy
            },
            {
              x: endX,
              y: cy + height / 4,
            },
            {
              x: endX,
              y: centerY
            }
          ]
        ]
      }

    case 'hearth':
      //available sizes: 110 x 95, 220 x 190, 330 x 285, 660 x 570
      return {
        area: getArea(
          'hearth',
          width,
          height,
          0, size,
          getUniqueDots(0, 0, width / 2, height / 2, width, height, size, smallStep, customStep)),
        dots: getUniqueDots(cx, cy, centerX, centerY, endX, endY, size, smallStep, customStep)
      };

    default:
      return {
        area: 0,
        dots: []
      };
  }
};

const imitation = (width, height, size, dots) => {
  const iApp = document.createElement('canvas');
  iApp.width = width;
  iApp.height = height;

  const imitationModel = new ImitationModel(iApp, width, height, size);
  imitationModel.render();
  const area = imitationModel.imitaion(dots);
  imitationModel.remove();

  return area;
};

const getArea = (type: string, width: number, height: number, side: number, size?: number, dots?: ShapeDotsInterface[][]): number => {
  switch(true) {
    case type === 'triangle':
      return width / 2 * height;

    case type === 'rectangle':
      return width * height;

    case type === 'pentagon':
      return 5 * Math.pow(side, 2) / (4 * Math.tan(Math.PI / 5));

    case type === 'hexagon':
      return 6 * Math.pow(side, 2) / (4 * Math.tan(Math.PI / 6));

    case type === 'ellipse' || type === 'circle':
      return width / 2 * height / 2;

    case type === 'hearth':
      return imitation(width, height, size, dots);

    default:
      return 0;
  }
};
