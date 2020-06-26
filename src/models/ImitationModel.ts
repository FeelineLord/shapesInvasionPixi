export default class ImitationModel {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  size: number;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    size: number
  ) {
    this.canvas = canvas as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.width = width;
    this.height = height;
    this.size = size;
  }

  protected getRandomInt = (min: number, max: number): number => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  public render = (): void => {
    const field = document.querySelector('#imitationField') as HTMLElement;

    this.canvas.id = 'imitation';
    this.canvas.className= 'imitation';

    field.style.width = this.width + 'px';
    field.style.height = this.height + 'px';

    field.append(this.canvas);
  };

  public imitaion = (dots): number => {
    let result: number[] = [];

    this.ctx.fillStyle = '#33FF00';
    this.ctx.beginPath();

    dots.forEach((d, i) => {
      if (i === 0) {
        this.ctx.moveTo(d[0].x, d[0].y);
      } else {
        this.ctx.bezierCurveTo(d[0].x, d[0].y, d[1].x, d[1].y, d[2].x, d[2].y);
      }
    });

    for (let i = 0; i < this.width; i++) {
      const x = this.getRandomInt(0, this.width);
      const y = this.getRandomInt(0, this.height);
      const imageData = this.ctx.getImageData(x, y, 1, 1);
      const hex = +'0x' + imageData.data[0] + imageData.data[0] + imageData.data[1] + imageData.data[1] + imageData.data[2] + imageData.data[2];

      hex === 0x33FF00 ? result.push(1) : result.push(0);
    }

    result = result.sort();
    const falseAmount = result.indexOf(1) - 1;
    const percent = Math.floor(100 / this.width * falseAmount);

    return (this.width * this.height) * (1 - percent / 100);
  };

  public remove = (): void => {
    const app = document.querySelector('#imitation') as HTMLCanvasElement;

    app.remove();
  };
}
