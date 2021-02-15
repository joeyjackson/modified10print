import "./style/style.scss";
import P5 from "P5";

const sketch = (p5: P5) => {

  p5.setup = () => {
    const canvas = p5.createCanvas(800, 500);

  }

  p5.draw = () => {
    p5.background(255);
  }
}

new P5(sketch);