function calculateFeatures(tokenData) {
  // p5 fns
  const HALF_PI = Math.PI/2
  const QUARTER_PI = Math.PI/4
  const int = parseInt
  const min = Math.min
  const constrain = (n, low, high) => Math.max(Math.min(n, high), low)
  function map(n, start1, stop1, start2, stop2, withinBounds) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return newval;
    }
    if (start2 < stop2) {
      return constrain(newval, start2, stop2);
    } else {
      return constrain(newval, stop2, start2);
    }
  }


  // UTILS

  let __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16)

  const resetRandomSeed = () => { __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16) }

  const rndint = (mn, mx) => int(rnd(mn, mx))
  function rnd(mn, mx) {
    __randomSeed ^= __randomSeed << 13
    __randomSeed ^= __randomSeed >> 17
    __randomSeed ^= __randomSeed << 5
    const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
    if (mx != null) return mn + out * (mx - mn)
    else if (mn != null) return out * mn
    else return out
  }

  function hshrnd(h) {
    const str = tokenData.hash.slice(2 + h*2, 4 + h*2)
    return parseInt(str, 16) / 255
  }

  const prb = x => rnd() < x
  function scaleModifier(mn, mx) {
    const s =
      SCALE < 0.4 && SCALE >= 0.3 ? 0.05 :
      SCALE < 0.3 ? 0.35 - SCALE :
      0

    return map(s, 0, 0.15, mn, mx)
  }

  const sample = (a) => a[int(rnd(a.length))]

  function chance(...chances) {
    const total = chances.reduce((t, c) => t + c[0], 0)
    const seed = rnd()
    let sum = 0
    for (let i = 0; i < chances.length; i++) {
      sum += chances[i][0] / total
      if (seed <= sum) return chances[i][1]
    }
  }
  const posOrNeg = () => prb(0.5) ? 1 : -1


  function hideStreetsOverride(layer, layerN) {
    return (
      SCALE >= 1
      && TURBULENCE
      && layer.ix < layerN-1
      && layer.ix > 0
    )
  }

  // FEATURES

  let NOISE_DIVISOR, TURBULENCE, IGNORE_STREET_CAP, STREET_TURBULENCE, HARD_CURVES, DENSITY,
      COLOR_RULE, STRAIGHT_STREETS, SECONDARY_ANGLE_ADJ, KINKED_STREET_FACTOR,
      BORDER_PADDING, BORDER_BLEED, BORDER_THICKNESS, HARD_BORDER, ROTATION, BORDER_DRIFT, DASH_RATE,
      X_OFF, Y_OFF, MISPRINT_ROTATION

  rnd()
  rnd()
  rnd()


  SCALE = rnd(0.2, 1.2)

  TURBULENCE = prb(0.15)
  STREET_TURBULENCE = prb(0.1)
  IGNORE_STREET_CAP = prb(0.1)
  HARD_CURVES = prb(0.05)
  STRAIGHT_STREETS = prb(scaleModifier(0.05, 0.1))
  STAR_MAP = prb(0.02)
  LOW_INK = prb(0.01)
  SMUDGE = prb(0.01) ? rnd(30, 100) : 0

  KINKED_STREET_FACTOR =
    prb(0.15)
      ? rnd(QUARTER_PI/2, QUARTER_PI) * posOrNeg()
      : 0

  NOISE_DIVISOR = rnd(150, 750) / SCALE

  DENSITY = chance(
    [0.015, 0],
    [0.935, 1],
    [0.05, 2],
  )

  DASH_RATE = prb(0.125) ? rnd(0.05, 0.2) : 0

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
      ? 10
      : map(SCALE, 1.2, 0.2, 1, 15)

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


  FORCE_GRADIENTS = prb(0.02)
  MAX_GRADIENT = prb(0.025) ? rnd(720, 3000) : 200
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
    [5, rnd(175, 200)],
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
    [64, 1],
    [20, 2],
    [MAX_GRADIENT > 200 ? 20 : 1, 10],
  )


  const Zoom = SCALE > 1 ? 'Close' : SCALE < 0.4 ? 'Far' : 'Near'
  const Padding =
    BORDER_PADDING * SCALE > 60 ? 'Thick' :
    'Normal'
  const Border = !!HARD_BORDER
  const Density = DENSITY === 0 ? 'Low' : DENSITY === 2 ? 'High' : 'Medium'
  const Paths = STRAIGHT_STREETS ? 'Straight' : HARD_CURVES ? 'Curvy' : 'Average'
  const Angles = KINKED_STREET_FACTOR ? 'Sharp' : 'Mild'
  const Dashes = !!DASH_RATE
  const Grain = GRAIN ? 'Course' : 'Fine'
  const PathTexture = TURBULENCE ? 'Choppy' : 'Soft'
  const Strokes = STREET_TURBULENCE ? 'Heavy' : 'Light'
  const Base =
    ['blackAndWhite', 'neon', 'burnt'].includes(BASE_RULE) ? 'Dark' :
    ['bright', 'faded'].includes(BASE_RULE) ? 'Bright' :
    BASE_RULE === 'paper' ? 'Light' :
    'White'
  const Theme =
    LAYER_N === 1 ? 'A' :
    COLOR_RULE === 5 ? 'F' :
    LAYER_N === 30 ? 'G' :
    COLOR_RULE === 1 ? 'B' :
    COLOR_RULE === 3 ? 'C' :
    COLOR_RULE === 4 ? 'E' :
    'D'


  return {
    Zoom,
    Padding,
    Border,
    Density,
    Paths,
    Angles,
    Dashes,
    Grain,
    'Path Texture': PathTexture,
    Strokes,
    Base,
    Theme,
  }

}






// Features
/*


[
  {
    "name": "Zoom",
    "type": "enum",
    "options": [
      "Close",
      "Near",
      "Far"
    ]
  },
  {
    "name": "Padding",
    "type": "enum",
    "options": [
      "Normal",
      "Thick"
    ]
  },
  {
    "name": "Border",
    "type": "boolean"
  },
  {
    "name": "Density",
    "type": "enum",
    "options": [
      "High",
      "Medium",
      "Low"
    ]
  },
  {
    "name": "Paths",
    "type": "enum",
    "options": [
      "Straight",
      "Average",
      "Curvy"
    ]
  },
  {
    "name": "Angles",
    "type": "enum",
    "options": [
      "Sharp",
      "Mild"
    ]
  },
  {
    "name": "Dashes",
    "type": "boolean"
  },
  {
    "name": "Grain",
    "type": "enum",
    "options": [
      "Course",
      "Fine"
    ]
  },
  {
    "name": "Path Texture",
    "type": "enum",
    "options": [
      "Choppy",
      "Soft"
    ]
  },
  {
    "name": "Strokes",
    "type": "enum",
    "options": [
      "Heavy",
      "Light"
    ]
  },
  {
    "name": "Base",
    "type": "enum",
    "options": [
      "Dark",
      "Bright",
      "Light",
      "White"
    ]
  },
  {
    "name": "Theme",
    "type": "enum",
    "options": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ]
  }
]




*/