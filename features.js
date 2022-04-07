function genFeatures(tokenData) {
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
  STAR_MAP = prb(0.01)
  LOW_INK = prb(0.01)
  SMUDGE = prb(0.01) ? rnd(30, 100) : 0

  KINKED_STREET_FACTOR =
    rnd() < 0.15
      ? rnd(QUARTER_PI/2, QUARTER_PI) * posOrNeg()
      : 0


  SECONDARY_ANGLE_ADJ = chance(
    [1, 0],
    [STRAIGHT_STREETS ? 0 : 0.15, HALF_PI/3],
  )

  NOISE_DIVISOR = rnd(150, 750) / SCALE

  DENSITY = chance(
    [SCALE >= 0.8 ? 0.0025 : 0.01, 0],
    [0.97, 1],
    [0.02, 2],
  )

  DASH_RATE = prb(0.1) ? rnd(0.05, 0.2) : 0

  COLOR_RULE = chance(
    [34, 0], // anything goes
    [35, 1], // contrast
    // [5, 2], // all light
    [7, 3], // all dark
    [22, 4], // all color
    [hideStreetsOverride(1, 50) ? 0 : 2, 5], // topographic
  )

  const layerNScaleAdj =
    STREET_TURBULENCE || HARD_CURVES
      ? 10
      : map(SCALE, 1.2, 0.2, 1, 15)
  let layerN = chance(
    [layerNScaleAdj, 1],
    [6, 2],
    [36, 3],
    [34, rndint(4, 7)],
    [!HARD_CURVES ? 10 : 0, rndint(7, 10)],
    [!HARD_CURVES ? 5 : 0, rndint(10, 15)],
    [!HARD_CURVES ? 1 : 0, 30],
  )


  let baseRule = chance(
    [layerN <= 4 ? 20 : 0, 'paper'],
    [layerN <= 4 ? 20 : 0, 'burnt'],
    [layerN <= 4 ? 20 : 0, 'faded'],

    [layerN <= 4 ? 10 : 5, 'bright'],
    [5, 'whiteAndBlack'],
    [5, 'blackAndWhite'],
    [SCALE <= 0.3 ? 0 : 5, 'neon'],
  )

  let hueDiff = chance(
    [1, 0],
    [2, 20],
    [1, 100],
    [3, 120],
    [1, 150],
    [2, 180],
  ) * posOrNeg()


  let forceGradients = rnd() < 0.025
  const maxGradient = rnd() < 0.025 ? rnd(720, 3000) : 200
  let invertStreets = false
  let lightenDarks = false

  if (COLOR_RULE === 1) {
    baseRule = chance(
      [10, 'whiteAndBlack'],
      [10, 'bright'],
      [5, 'blackAndWhite'],
      [SCALE <= 0.3 ? 0 : 5, 'neon'],
    )
  }
  else if (COLOR_RULE === 3) {
    baseRule = chance(
      [20, 'burnt'],
      [5, 'blackAndWhite'],
      [5, 'neon'],
    )

    TURBULENCE = rnd() < 0.4
    STREET_TURBULENCE = rnd() < 0.3
    lightenDarks = true


  } else if (COLOR_RULE === 4) {

    baseRule = chance(
      [20, 'faded'],
      [30, 'bright'],
      [10, 'paper'],
      [30, 'whiteAndBlack'],
    )

    layerN = chance(
      [25, 3],
      [35, rndint(4,6)],
      [25, rndint(6,9)],
      [!HARD_CURVES ? 10 : 0, rndint(9, 15)],
      [!HARD_CURVES ? 5 : 0, rndint(15, 30)],
    )

    hueDiff = chance(
      [layerN >= 12 ? 2 : 1, 10],
      [4, 20],
      [layerN >= 12 ? 1 : 2, 100],
      [3, 120],
      [layerN >= 12 ? 1 : 3, 150],
      [3, 180],
    ) * posOrNeg()

    if (rnd() < 0.05) {
      forceGradients = true
      invertStreets = true
    } else {
      invertStreets = 0.5
    }

  } else if (5 === COLOR_RULE) {
    NOISE_DIVISOR = rnd(350, 1000) / SCALE

    layerN = 50

    baseRule = chance(
      [1, 'paper'],
      [1, 'faded'],
      [1, 'bright'],
      [1, 'whiteAndBlack'],
    )


    hueDiff = chance(
      [6, 0],
      [2, 20],
      [1, 120],
      [1, 180],
    ) * posOrNeg()
  }

  if (layerN === 2 && ['neon', 'burnt'].includes(baseRule)) {
    hueDiff = chance(
      [5, 0],
      [1, 100],
      [1, 120],
      [1, 150],
      [1, 180],
    ) * posOrNeg()
  }

  const grain = rnd() < 0.5 || ['blackAndWhite', 'neon', 'burnt'].includes(baseRule) ? 0 : rnd(0.2, 0.7)

  X_OFF = 0
  Y_OFF = 0
  MISPRINT_ROTATION = 0

  BORDER_BLEED = prb(0.5)
  HARD_BORDER = BORDER_BLEED || prb(0.8)

  BORDER_PADDING = chance(
    [5, rnd(150, 200)],
    [75, rnd(30, 60)],
    [20, rnd(20, 30)],
  ) / SCALE

  BORDER_THICKNESS = map(SCALE, 0.2, 1.2, 1.6, 2.8) + rnd(-.2, .2)
  BORDER_DRIFT = chance(
    [5, 0],
    [3, rnd(3)/SCALE],
    [1, min(180, rnd(3, BORDER_PADDING/2))/SCALE]
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




  return {
    HASH: tokenData.hash,
    SCALE,
    COLOR_RULE,
    LAYER_N: layerN,
    BASE_RULE: baseRule,
    HUE_DIFF: hueDiff,
    FORCE_GRADIENTS: forceGradients,
    HARD_CURVES,
    DASH_RATE: DASH_RATE.toPrecision(2),
    STREET_TURBULENCE,
    NOISE_DIVISOR: (NOISE_DIVISOR*SCALE).toPrecision(4),
    DENSITY,
    TURBULENCE,
    IGNORE_STREET_CAP,
    KINKED_STREET_FACTOR,
    HARD_BORDER,
    BORDER_BLEED,
    BORDER_DRIFT: (BORDER_DRIFT*SCALE).toPrecision(4),
    BORDER_THICKNESS: BORDER_THICKNESS.toPrecision(2),
    BORDER_PADDING: (BORDER_PADDING*SCALE).toPrecision(4),
    ROTATION: ROTATION.toPrecision(2),
    STRAIGHT_STREETS,
    SECONDARY_ANGLE_ADJ: SECONDARY_ANGLE_ADJ.toPrecision(2),
    X_OFF,
    Y_OFF,
    MISPRINT_ROTATION,
    MAX_GRADIENT: maxGradient,
    GRAIN: grain,
    SMUDGE,
    STAR_MAP,
    LOW_INK,
  }

}



