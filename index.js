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

*/


let SIZE, SCALE, L, R, T, B, W, H

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}


let SYMMETRICAL_NOISE, NOISE_DIVISOR, TURBULENCE, IGNORE_STREET_CAP, STREET_TURBULENCE, HARD_CURVES

function setup() {
  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(SIZE, SIZE);
  noiseSeed(int(rnd(10000000000000000)))
  colorMode(HSB, 360, 100, 100, 100)

  SCALE =
    rnd(0.2, 1.2)
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


  TURBULENCE = rnd() < 0.15
  STREET_TURBULENCE = rnd() < 0.1
  IGNORE_STREET_CAP = rnd() < 0.1
  HARD_CURVES = rnd() < 0.1

  const noiseDiv = rnd(100, 750)
  SYMMETRICAL_NOISE = rnd() < 0.01
  NOISE_DIVISOR = noiseDiv / SCALE

  const layerN = chance(
    [15, 1],
    [10, 2],
    [27, 3],
    [27, 4],
    [11, 8],
    [9, 12],
    [1, 30],
  )


  let thresholdAdj = 0
  if (layerN === 30) {
    thresholdAdj = 0.02
  } else if (noiseDiv < 100) {
    thresholdAdj = map(100 - noiseDiv, 0, 25, 0.4, 0.6)
  }
  LAYERS = setLayers(layerN, thresholdAdj)
}


function draw() {

  noLoop()

  translate(width/2, height/2)
  scale(SCALE)


  const START = Date.now()

  drawBackground()
  drawStreetGrid()

  console.log(Date.now() - START)
}