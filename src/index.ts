import "./style/style.scss";
import P5 from "p5";

const RESET_INTERVAL_DURATION_MS = 15000;

const randomBoolGrid = (rows: number, columns: number, bias: number = 0.5) => {
  const grid: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const currentRow: boolean[] = [];
    for (let c = 0; c < columns; c++) {
      currentRow.push(Math.random() > bias);
    }
    grid.push(currentRow);
  }
  return grid;
}

const coinFlip = () => {
  return Math.random() > 0.5;
}

const enum MODE {
  TEN_PRINT,
  SQUARE_PRINT,
}

const sketch = (p5: P5) => {
  const WIDTH = 800;
  const HEIGHT = 500;
  let scale = 10;
  let mode: MODE = MODE.TEN_PRINT;

  let grid: boolean[][];
  
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

  const resetGrid = () => {
    scale = Math.round(p5.map(Math.random(), 0, 1, 4, 16));
    mode = coinFlip() ? MODE.TEN_PRINT : MODE.SQUARE_PRINT;
    const bias = Math.random();
    grid = randomBoolGrid(p5.height / scale, p5.width / scale, bias);
  }

  p5.setup = () => {
    p5.createCanvas(WIDTH, HEIGHT);
    p5.stroke(0);

    resetGrid();
    setInterval(resetGrid, RESET_INTERVAL_DURATION_MS);
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
  }
}

new P5(sketch);