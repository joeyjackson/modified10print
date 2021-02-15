import "./style/style.scss";
import P5 from "p5";
// import _externalConfig from "./config.json";
const _externalConfig = undefined;

const RESET_INTERVAL_DURATION_MS = 15000;

const enum MODE {
  TEN_PRINT = 0,
  SQUARE_PRINT = 1,
}

interface config_t {
  seed: number;
  bias: number;
  scale: number;
  height: number;
  width: number;
  mode: MODE;
  grid: boolean[][];
}

const sketch = (p5: P5) => {
  const WIDTH = 800;
  const HEIGHT = 500;
  let scale = 10;
  let mode: MODE = MODE.TEN_PRINT;
  let isPaused = false;
  let interval: NodeJS.Timeout | null = null;

  let grid: boolean[][];

  const generateBoolGrid = (p5: P5, rows: number, columns: number, bias: number = 0.5) => {
    const grid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
      const currentRow: boolean[] = [];
      for (let c = 0; c < columns; c++) {
        currentRow.push(p5.random() > bias);
      }
      grid.push(currentRow);
    }
    return grid;
  }
  
  const tenPrintGrid = (grid: boolean[][]) => {
    grid.forEach((cells, r) => {
      cells.forEach((active, c) => {
        if (active) {
          p5.line(c * scale, r * scale, (c + 1) * scale, (r + 1) * scale);
        } else {
          p5.line(c * scale, (r + 1) * scale, (c + 1) * scale, r * scale);
        }
      });
    });
  }

  const squarePrintGrid = (grid: boolean[][]) => {
    grid.forEach((cells, r) => {
      cells.forEach((active, c) => {
        if (active) {
          p5.line(c * scale, r * scale, c * scale, (r + 1) * scale);
        } else {
          p5.line(c * scale, r * scale, (c + 1) * scale, r * scale);
        }
      });
    });
  }

  const resetGrid = (config?: config_t, shouldLog: boolean = true) => {
    const now = Date.now();

    const seed = config?.seed ?? now;
    p5.randomSeed(seed);

    scale = config?.scale ?? (Math.round(p5.map(p5.random(), 0, 1, 4, 16)));
    mode = config?.mode ?? ((p5.random() > 0.5) ? MODE.TEN_PRINT : MODE.SQUARE_PRINT);
    const bias = config?.bias ?? p5.random();
    const w = config?.width ?? p5.width;
    const h = config?.height ?? p5.height;
    grid = config?.grid ?? generateBoolGrid(
      p5, 
      h / scale, 
      w / scale, 
      bias
    );

    const _currConfig = {
      seed: seed,
      bias: bias,
      scale: scale,
      height: h,
      width: w,
      mode: mode,
      grid: grid,
    }
    if (shouldLog) {
      console.log("Config", new Date(now).toISOString(), JSON.stringify(_currConfig));
    }
  }

  p5.setup = () => {
    p5.createCanvas(WIDTH, HEIGHT);
    p5.stroke(0);

    resetGrid(_externalConfig, _externalConfig === undefined);
    interval = setInterval(() => resetGrid(_externalConfig, _externalConfig === undefined), RESET_INTERVAL_DURATION_MS);
  }

  p5.draw = () => {
    p5.background(255);
    switch(mode) {
      case MODE.TEN_PRINT:
        tenPrintGrid(grid);
        break;
      case MODE.SQUARE_PRINT:
        squarePrintGrid(grid);
        break;
    }

    if (isPaused) {
      p5.push();
      p5.noFill();
      p5.stroke(85, 145, 242);
      p5.strokeWeight(3);
      p5.rect(0, 0, p5.width, p5.height);
      p5.pop();
    }
  }

  p5.mousePressed = () => {
    if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
      if (isPaused) {
        isPaused = false;
        if (interval !== null) {
          clearInterval(interval);
          interval = null;
        }
        interval = setInterval(() => resetGrid(_externalConfig, _externalConfig === undefined), RESET_INTERVAL_DURATION_MS);
      } else {
        isPaused = true;
        if (interval !== null) {
          clearInterval(interval);
          interval = null;
        }
      }
    }
  }
}

new P5(sketch);