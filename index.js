/*


A Simulated Mystical Experience
A Simulation of a Mystical Experience
Simulation of a Mystical Experience (SoaMe)

*/


let SIZE, SCALE, L, R, T, B, W, H

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}


let SYMMETRICAL_NOISE, NOISE_DIVISOR, TURBULENCE, IGNORE_STREET_CAP, STREET_TURBULENCE, HARD_CURVES


let SAT

function setup() {
  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(SIZE, SIZE);
  noiseSeed(int(rnd(10000000000000000)))
  colorMode(HSB, 360, 100, 100, 100)

    rnd(0.2, 1.2)
  SCALE = 1
    * SIZE/800

  W = width/SCALE
  H = height/SCALE
  L = -width/(2*SCALE)
  R = width/(2*SCALE)
  T = -height/(2*SCALE)
  B = height/(2*SCALE)

  // chaos budget
    // turbulence
    // street turbulence
    // zoom
    // hard curves
    // noise divisor
    // # layers


  SAT = chance(
    [10, -100],
    [80, 0],
    [10, 100],
  )


  TURBULENCE = rnd() < 0.15
  STREET_TURBULENCE = rnd() < 0.1
  IGNORE_STREET_CAP = rnd() < 0.1
  HARD_CURVES = rnd() < 0.1

  const noiseDiv = rnd(100, 750)
  SYMMETRICAL_NOISE = rnd() < 0.75

  NOISE_DIVISOR = noiseDiv / SCALE

  const layerN = rnd(30, 60)
  // chance(
  //   [15, 1],
  //   [10, 2],
  //   [27, 3],
  //   [27, 4],
  //   [11, 8],
  //   [9, 12],
  //   [1, 30],
  // )


  let thresholdAdj = 0
  if (layerN === 30) {
    thresholdAdj = 0.02
  } else if (noiseDiv < 100) {
    thresholdAdj = map(100 - noiseDiv, 0, 25, 0.4, 0.6)
  }
  thresholdAdj = rnd(0.01, 0.3)
  LAYERS = setLayers(layerN, thresholdAdj)
    // thresholdAdj)
}


t = 0
function draw() {

  // noLoop()

  translate(width/2, height/2)
  scale(SCALE)


  const START = Date.now()

  if (t === 0) {
    times(60, i => {
      drawBackground(i, true)
    })
  }

  drawBackground(t+300)
  // drawStreetGrid()

  t++

  // console.log(Date.now() - START)
}