/*
In 1987, a team of bulgarian neuroscientists conducted an experiment in which participants
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


*/


const BUFFER = 300
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

  SCALE = rnd(0.2, 1.2) * SIZE/800

  W = width/SCALE
  H = height/SCALE
  L = -width/(2*SCALE)
  R = width/(2*SCALE)
  T = -height/(2*SCALE)
  B = height/(2*SCALE)


  const noiseDiv = rnd(100, 750)

  SYMMETRICAL_NOISE = rnd() < 0.0625
  NOISE_DIVISOR = noiseDiv / SCALE

  const layerN = chance(
    [20, 1],
    [12.5, 2],
    [25, 3],
    [22.5, 4],
    [10, 8],
    [9, 12],
    [1, 30],
  )

  let thresholdAdj = 0
  if (layerN === 30) {
    thresholdAdj = 0.02
  } else if (noiseDiv < 100) {
    console.log(noiseDiv)
    // thresholdAdj = map(0, 0, 100, 0.4, 0.6)
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