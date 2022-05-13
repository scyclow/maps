

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}

LAYERS = []
NOISE_OFFSET = 100000

function setup() {
  SIZE = min(innerWidth, innerHeight)
  __canvas = createCanvas(SIZE, SIZE)
  noiseSeed(rnd(1000000) + rnd(1000000) + rnd(1000))

  SCALE = rnd() + 0.2
  SCALE_ADJ = SIZE/800
  const sizeADJ = SCALE*SCALE_ADJ

  W = width/sizeADJ
  H = height/sizeADJ
  L = round(-width/(2*sizeADJ), 4)
  R = round(width/(2*sizeADJ), 4)
  T = round(-height/(2*sizeADJ), 4)
  B = round(height/(2*sizeADJ), 4)

  colorMode(HSB, 360, 100, 100)

  setFeatures()
  setLayers()

  console.log('What are you looking for?')
}


function draw() {
  noLoop()

  translate(width/2, height/2)
  scale(SCALE * SCALE_ADJ)

  const bgBuffer = max(abs(X_OFF), abs(Y_OFF))*1.5
  rotate(MISPRINT_ROTATION)
  drawBackground(T-bgBuffer, B+bgBuffer, L-bgBuffer, R+bgBuffer)

  rotate(ROTATION)
  drawStreetGrid(X_OFF, Y_OFF)

  drawBorder()
}

function setFeatures() {
  TURBULENCE = prb(0.2)
  STREET_TURBULENCE = prb(0.15)
  IGNORE_STREET_CAP = prb(0.1)
  HARD_CURVES = prb(0.1)
  STRAIGHT_STREETS = prb(scaleModifier(0.05, 0.15))
  STAR_MAP = prb(0.02)
  LOW_INK = prb(0.01)
  SMUDGE = prb(0.01) ? rnd(30, 100) : 0

  KINKED_STREET_FACTOR =
    prb(0.2)
      ? rnd(QUARTER_PI/2, QUARTER_PI) * posOrNeg()
      : 0

  NOISE_DIVISOR = rnd(150, 750) / SCALE

  DENSITY = chance(
    [0.02, 0],
    [0.9, 1],
    [0.08, 2],
  )

  DASH_RATE = prb(0.175) ? rnd(0.05, 0.2) : 0

  COLOR_RULE = chance(
    [40, 0], // anything goes
    [15, 1], // contrast
    [5, 2], // all light
    [11, 3], // all dark
    [27, 4], // all color
    [SCALE >= 1 && TURBULENCE ? 0 : 2, 5], // topographic
  )

  const layerNScaleAdj =
    STREET_TURBULENCE || HARD_CURVES
      ? 15
      : map(SCALE, 1.2, 0.2, 1, 20)

  LAYER_N = chance(
    [layerNScaleAdj, 1],
    [6, 2],
    [36, 3],
    [34, rndint(4, 7)],
    [!HARD_CURVES ? 10 : 0, rndint(7, 10)],
    [!HARD_CURVES ? 4 : 0, rndint(10, 15)],
    [!HARD_CURVES ? 1 : 0, 30],
  )


  BASE_RULE = chance(
    [LAYER_N <= 4 ? 20 : 0, 'paper'],
    [LAYER_N <= 4 ? 20 : 0, 'faded'],
    [LAYER_N <= 4 ? 15 : 0, 'burnt'],

    [LAYER_N <= 4 ? 10 : 5, 'bright'],
    [6, 'whiteAndBlack'],
    [4, 'blackAndWhite'],
    [SCALE <= 0.3 ? 0 : 4, 'neon'],
  )

  HUE_DIFF = chance(
    [3, 0],
    [2, 20],
    [1, 100],
    [2, 120],
    [1, 150],
    [3, 180],
  ) * posOrNeg()


  FORCE_GRADIENTS = prb(0.03)
  MAX_GRADIENT = prb(0.035) ? rnd(720, 3000) : 200
  INVERT_STREETS = false
  LIGHTEN_DARKS = false

  HUE_RULE = sample(['path', 'preset'])

  if (COLOR_RULE === 1) {
    HUE_DIFF = 0
    LAYER_N = chance(
      [6, 3],
      [1, 4],
      [1, 5],
    )

    BASE_RULE = chance(
      [7, 'bright'],
      [3, 'whiteAndBlack'],
      [5, 'blackAndWhite'],
      [5, 'neon'],
    )

  } else if (COLOR_RULE === 3) {
    BASE_RULE = chance(
      [20, 'burnt'],
      [5, 'blackAndWhite'],
      [5, 'neon'],
    )

    TURBULENCE = rnd() < 0.4
    STREET_TURBULENCE = rnd() < 0.3
    LIGHTEN_DARKS = true

  } else if (COLOR_RULE === 4) {

    BASE_RULE = chance(
      [20, 'faded'],
      [30, 'bright'],
      [10, 'paper'],
      [30, 'whiteAndBlack'],
    )

    LAYER_N = chance(
      [25, 3],
      [35, rndint(4,6)],
      [25, rndint(6,9)],
      [!HARD_CURVES ? 10 : 0, rndint(9, 15)],
      [!HARD_CURVES ? 5 : 0, rndint(15, 30)],
    )

    HUE_DIFF = chance(
      [LAYER_N >= 12 ? 2 : 1, 10],
      [4, 20],
      [LAYER_N >= 12 ? 1 : 2, 100],
      [3, 120],
      [LAYER_N >= 12 ? 1 : 3, 150],
      [3, 180],
    ) * posOrNeg()

    if (prb(0.05)) {
      FORCE_GRADIENTS = true
      INVERT_STREETS = true
    } else if (prb(0.5) && LAYER_N <= 4) {
      INVERT_STREETS = true
    }

  } else if (5 === COLOR_RULE) {
    NOISE_DIVISOR = rnd(150, 500) / SCALE

    LAYER_N = 50

    BASE_RULE = chance(
      [1, 'paper'],
      [1, 'faded'],
      [1, 'bright'],
      [1, 'whiteAndBlack'],
    )

    HUE_DIFF = chance(
      [6, 0],
      [2, 20],
      [1, 120],
      [1, 180],
    ) * posOrNeg()
  }

  if (BASE_RULE === 'blackAndWhite' || BASE_RULE === 'neon' && LAYER_N > 2 && COLOR_RULE !== 3) {
    HUE_DIFF = chance(
        [1, 0],
        [2, 180],
      ) * posOrNeg()
  }

  if (LAYER_N === 2 && ['neon', 'burnt'].includes(BASE_RULE)) {
    HUE_DIFF = chance(
      [5, 0],
      [1, 100],
      [1, 120],
      [1, 150],
      [1, 180],
    ) * posOrNeg()
  }

  const scaleMultiplier = scaleModifier(1, 1.6) * (LOW_INK ? 0.7 : 1)
  MIN_ST_W = 0.7 * scaleMultiplier
  MAX_ST_W = 1.3 * scaleMultiplier

  GRAIN = rnd() < 0.5 || ['blackAndWhite', 'neon', 'burnt'].includes(BASE_RULE) ? 0 : rnd(0.2, 0.7)

  X_OFF = 0
  Y_OFF = 0
  MISPRINT_ROTATION = 0


  BORDER_BLEED = prb(0.5)
  HARD_BORDER = BORDER_BLEED || prb(0.8)

  BORDER_PADDING = chance(
    [6.25, rnd(175, 200)],
    [75, rnd(30, 60)],
    [20, rnd(20, 30)],
  ) / SCALE

  BORDER_THICKNESS = map(SCALE, 0.2, 1.2, 1.6, 2.8) + rnd(-.2, .2)
  BORDER_DRIFT = chance(
    [5, 0],
    [3, rnd(3)/SCALE],
    [1, rnd(3, BORDER_PADDING/2)/SCALE]
  )
  ROTATION = rnd(-0.0005, 0.0005)
  X_OFF = rnd(-2, 2)/SCALE
  Y_OFF = rnd(-2, 2)/SCALE

  IS_MISPRINT = prb(0.015)

  if (!HARD_BORDER && BORDER_PADDING*SCALE <= 30) {
    BORDER_DRIFT = BORDER_PADDING - 5/SCALE
    HARD_BORDER = false
    BORDER_BLEED = false
  }

  if (IS_MISPRINT) {
    HARD_BORDER = true
    BORDER_BLEED = true
    BORDER_THICKNESS = rnd(1.4, 3)
    BORDER_DRIFT = chance(
      [5, 0],
      [3, rnd(3)/SCALE],
      [1, rnd(3, BORDER_PADDING/2)/SCALE]
    )

    const div = prb(0.333) ? 2 : 1

    X_OFF = rnd(-250, 250)/(div*SCALE)
    Y_OFF = rnd(-250, 250)/(div*SCALE)
    MISPRINT_ROTATION = rnd(-QUARTER_PI, QUARTER_PI)/(4*div)
  }

  BORDER_DRIFT = min(180/SCALE, BORDER_DRIFT)

  SHADOW_X = 5 * posOrNeg()
  SHADOW_Y = 5 * posOrNeg()
  SHADOW_MAGNITUDE = chance(
    [15, 0],
    [50, 1],
    [30, 2],
    [MAX_GRADIENT > 200 ? 20 : 1, 15],
  )
}