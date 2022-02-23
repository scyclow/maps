const BUFFER = 700
let SIZE, SCALE, L, R, T, B, W, H

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}


let SYMMETRICAL_NOISE, NOISE_DIVISOR

function setup() {
  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(SIZE, SIZE);
  noiseSeed(int(rnd(10000000000000000)))
  colorMode(HSB, 360, 100, 100, 100)

  SCALE =
    1.2
    // rnd(0.2, 1.2)
    * SIZE/800

  L = -width/(2*SCALE)
  R = width/(2*SCALE)
  T = -height/(2*SCALE)
  B = height/(2*SCALE)
  W = width/SCALE
  H = height/SCALE



  SYMMETRICAL_NOISE = rnd() < 0.0625
  NOISE_DIVISOR = 75 * rnd(1, 10) / SCALE

  LAYERS = setLayers()


}


function draw() {

  noLoop()
  noStroke()
  translate(width/2, height/2)
  scale(SCALE)


  const START = Date.now()

  drawBackground()

  drawGrid()
}