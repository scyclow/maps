/*


Zones

i guess the idea is that maps are a representation of reality, and that representation can be constructed in multiple different ways




In 1986, a team of estonian neuroscientists conducted an experiment in which participants
were given a description of a non existent terain. Participants were then measured by an fMRI
and were asked to describe, in as much detail as possible, the most likely infrastructural network
to arise from this terrain.

There are many other details missing from this experiment, chief of which is the initial hypothesis
of the experiment


In all, 961 trials have been confirmed, although many speculate that the methodology of the tests may have
been inconsistent from trial to trial. Additionally, it's clear that the storage procedures differ drastically
from output to output, with some having degraded substantially.



*/



/*
2-2 notes

  - higher minimum noise divisor (or, make layer1 threshold higher when low noise divisor)
  - layer 2 neon on neon/dark doesn't look great when only two layers


2-3 notes
  - for hard curves, and zoomed out, noise divisor should be a lot higher
  - for zoomed in, main avenue should start within the frame, be straighter



2-6 notes
  - it seems like the avg elevation thing isn't quite working any more? ex 142, 125 (it works sometimes, but not sure i like it on the whole)
  - for papers, should make street colors in reverse order of luminesence
  - base bright should also have a version where streets have some color
  - maybe dark/neon should have base color streets as well


2-8 notes
  - should have more that have no black bg color schemes
  - fewer with choppy clouds
    - maybe when it does pop up, either have really low threshold or higher threshold
    - or, at very least have a higher noise divisor
    - 92, 112 are good ones
  - rare bg: each stroke is a random hue


*/


let SIZE, SCALE, L, R, T, B, W, H

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}


let SYMMETRICAL_NOISE, NOISE_DIVISOR, TURBULENCE, IGNORE_STREET_CAP, STREET_TURBULENCE, HARD_CURVES, DENSITY

const NOISE_OFFSET = 100000

function setup() {
  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(SIZE, SIZE);
  noiseSeed(int(rnd(10000000000000000)))
  colorMode(HSB, 360, 100, 100, 100)

  SCALE = rnd(0.2, 1.2)
  SCALE_ADJ = SIZE/800
  const sizeADJ = SCALE*SCALE_ADJ

  W = width/sizeADJ
  H = height/sizeADJ
  L = -width/(2*sizeADJ)
  R = width/(2*sizeADJ)
  T = -height/(2*sizeADJ)
  B = height/(2*sizeADJ)

  // chaos budget
    // turbulence
    // street turbulence
    // zoom
    // hard curves
    // noise divisor
    // # layers


  TURBULENCE = rnd() < 0.15
  STREET_TURBULENCE = rnd() < 0.1
  IGNORE_STREET_CAP = rnd() < 0.1
  HARD_CURVES = rnd() < 0.1
  SOFT_CURVES = !HARD_CURVES && rnd() < 0.05

  SYMMETRICAL_NOISE = rnd() < 0.01
  NOISE_DIVISOR = rnd(100, 750) / SCALE

  DENSITY = chance(
    [0.02, 0],
    [0.96, 1],
    [0.02, 2],
  )


  const layerN =
  chance(
    [7, 1],
    [10, 2],
    [34, 3],
    [34, 4],
    [10, 8],
    [4, 12],
    [1, 30],
  )
  console.log(layerN, NOISE_DIVISOR*SCALE)


  let thresholdAdj = 0
  if (layerN === 30) {
    thresholdAdj = 0.01
  } else if (NOISE_DIVISOR < 100) {
    thresholdAdj = map(100 - NOISE_DIVISOR, 0, 25, 0.4, 0.6)
  }
  LAYERS = setLayers(layerN, thresholdAdj)
}


function draw() {

  noLoop()

  translate(width/2, height/2)
  scale(SCALE * SCALE_ADJ)


  const START = Date.now()

  drawBackground()
  drawStreetGrid()

  // drawStreetGrid2()


  // translate(5, 5)
  // drawStreetGrid()

  console.log(Date.now() - START)
}