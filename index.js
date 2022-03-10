/*

Zones
Abstractions of Nothing
Maps of Hyperreality
Fake Hyperrealities
Fake Maps
Fake Abstractions
Maps Without Terretories
Simulacras

maps are representations of reality. highlight the fact that this is a representation.
In the Borges story, the maps become so larger that they effectively contain no abstraction.


each map seems to tell a story, but they're stories of things that have never existed.

all of the zones/clouds/splotches can represent numerous things.
they can represent a social abstraction - an ideology, a community, a district
they can represent a natural system parallel to the city grid - topology, weather
or, they can represent the degredation of the map itself


one thing that this makes me think of is how there are all of these immaterial zones and structures
that we try to map onto physical space and represent with abstractions. it could be walking into a neighborhood
and crossing through the in-between area of that neighborhood. what do the blotches represent in the context of the map?
or, do they represent nothing? are they a random coffee stain



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


let SYMMETRICAL_NOISE, NOISE_DIVISOR, TURBULENCE, IGNORE_STREET_CAP, STREET_TURBULENCE, HARD_CURVES, DENSITY, COLOR_RULE
let LAYERS = []

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
  HARD_CURVES = rnd() < 0.05
  SOFT_CURVES = !HARD_CURVES && rnd() < 0.05

  SYMMETRICAL_NOISE = rnd() < 0.01
  NOISE_DIVISOR = rnd(100, 750) / SCALE

  DENSITY = chance(
    [0.02, 0],
    [0.96, 1],
    [0.02, 2],
  )

  COLOR_RULE = chance(
    [0.46, 0], // anything goes
    [0.27, 1], // high contrast
    [0.1, 2], // all light
    [0.07, 3], // all dark
    [0.07, 4], // all color
    [0.03, 5], // topographic
  )

  let layerN = chance(
    [7, 1],
    [8, 2], // todo don't include if all light?
    [35, 3],
    [35, 4],
    [10, 8], // more likely if alternate
    [4, 12], // more likely if alternate
    [1, 30], // more likely if alternate
  )


  let thresholdAdj = 1
  if (layerN === 30) {
    thresholdAdj = 0.01
  }


  let baseRule = chance(
    [layerN <= 4 ? 25 : 0, 'paper'],
    [layerN <= 4 ? 25 : 0, 'burnt'],
    [layerN <= 4 ? 25 : 0, 'faded'],

    [layerN <= 4 ? 10 : 5, 'bright'],
    [5, 'whiteAndBlack'],
    [5, 'blackAndWhite'],
    [5, 'neon'],
  )

  let hueDiff = chance(
    [1, 0],
    [2, 100],
    [2, 120],
    [2, 150],
    [2, 180],
  ) * posOrNeg()


  if (COLOR_RULE === 3) {
    baseRule = chance(
      [10, 'burnt'],
      [5, 'blackAndWhite'],
      [5, 'neon'],
    )

  } else if (COLOR_RULE === 4) {
    baseRule = chance(
      [25, 'faded'],
      [25, 'bright'],
      [25, 'paper'],
      [25, 'whiteAndBlack'],
    )

    hueDiff = chance(
      [1, 100],
      [1, 120],
      [1, 150],
      [1, 180],
    ) * posOrNeg()

    layerN = chance(
      [34, 3],
      [34, 4],
      [10, 8],
      [10, 12],
      [5, 30],
    )

  } else if ([5, 6].includes(COLOR_RULE)) {
    thresholdAdj = 0.01

    NOISE_DIVISOR = rnd(350, 1000) / SCALE


    layerN = 50

    baseRule = chance(
      [25, 'paper'],
      [25, 'faded'],
      [25, 'bright'],
      [10, 'whiteAndBlack'],
    )


    hueDiff = chance(
      [4, 0],
      [1, 120],
      [1, 180],
    ) * posOrNeg()
  }

  console.log(layerN, NOISE_DIVISOR*SCALE)


  console.log(COLOR_RULE)
  console.log(hueDiff)

  LAYERS = setLayers(layerN, baseRule, hueDiff, thresholdAdj)
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