
// TODO rule neighbor probabilities, starting threshold, + spacing should be set into multiple different strategies

// gradual: lower initial threshold, higher threshold diff, subtle changes

// chaotic: lower initial threshold, low threshold diff, drastic changes

// decay: mid initial threshold, low threshold diff, drastic (but bounded) changes, cutoff at top

// high contrast 3 repeating layers L0 -> L1 -> L0

// if light->light or dark->dark transitions, allow more complicated elevation logic. lower threshold, lower noise divisor

// i really like mapGen2-9/105-0x9519690c22c3d9327aaeedbf20858809a0f9d9d723f3cc723b8100c4481af83f.png

// alternating colors looks great for topology file:///Users/steviep/Desktop/mapGen2-9/13-0x4f497fd30437221a8d207bd8dbbfc0d2f2a4b76ccef1d098b8d158452911ea11.png

// neon -> white/color -> black/different-neon (or reversed) is dope file:///Users/steviep/Desktop/mapGen2-9/132-0x2826e5e3f0c695d3ed820d3c07436edb58c31fda7d851253ac0c5c3d8c49ba83.png

// should make only color more likely

// light (L0) -> color (L1) -> dark (L2) -> same color or burnt (L1)



/*
  white -> dark
  white -> dark -> color
  white -> color -> black
  white -> neon -> black -> neon -> black
  white -> color -> white -> black -> white -> color
  white -> color -> neon -> black -> neon -> color -> black
  (20) white -> color -> white -> black -> color

  (different colors) color -> white -> neon -> color -> black -> white -> black -> neon -> black
  dark -> light -> color -> dark -> light -> color
  multiple white/color -> multiple dark -> white -> multiple dark
  color -> dark -> color
  color -> black (hide) -> neon
  color -> black -> color -> white -> color -> black
  (different colors) color -> neon -> neon -> black -> neon -> color -> black


  dark -> color -> dark

  (same color) neon -> white -> neon -> color -> black -> white
  neon -> neon -> color -> white -> color




  X
  paper -> neon -> black
  burnt -> black -> color -> black



  maybe neon should only be at top or bottom, unless it starts with neon and is the same color in middle

*/



function setLayers() {
  const { elevationAverage, elevationMin } = findAvgElevation()
  const r = rules()

  const baseHue = rnd(360)
  LAYERS = [{
    ix: 0,
    threshold: LAYER_N >= 30 ? elevationMin : elevationAverage,
    hideStreets: false,
    ...r[BASE_RULE](baseHue, MAX_GRADIENT/rnd(3, 15), 0, LIGHTEN_DARKS)
  }]

  const baseIsLight = ['whiteAndBlack', 'paper'].includes(BASE_RULE)
  const baseIsColor = ['bright', 'faded'].includes(BASE_RULE)

  const alternateRule =
    COLOR_RULE === 5 && baseIsColor ? sample(['bright', 'whiteAndBlack']) :
    COLOR_RULE === 5 && baseIsLight ? 'bright' :
    false

  let hueIx = 0
  const huePresets = getHuePresets(baseHue)
  const nextHue = (previousHue) => HUE_RULE === 'path'
    ? previousHue + HUE_DIFF
    : huePresets[hueIx++ % huePresets.length]


  const newLayer = (previousLayer, threshold, ix) => {
    const hideStreets = prb(0.2) && !MISPRINT_ROTATION
    const maxGrad = ix === LAYER_N-1 ? MAX_GRADIENT/rnd(3, 8) : MAX_GRADIENT

    let nextLayer
    if (COLOR_RULE === 5 && !(ix % 2)) {
      nextLayer = LAYERS[0]

    } else if (COLOR_RULE === 5 && ix % 2) {
      const altHueDiff = chance(
        [1, 20],
        [1, 120],
        [1, 180],
      )

      const h = hfix(previousLayer.baseHue + 20)
      nextLayer = r[alternateRule](h, maxGrad, ix, previousLayer.isDark)

    } else {
      const nextRule = chance(...previousLayer.neighbors)
      const h = nextRule === 'blackAndWhite' || nextRule === 'whiteAndBlack'
        ? previousLayer.baseHue
        : nextHue(previousLayer.baseHue)
      nextLayer = r[nextRule](h, maxGrad, ix, previousLayer.isDark)
    }

    return {
      hideStreets,
      ...nextLayer,
      ix,
      threshold,
    }
  }

  for (let i = 1; i < LAYER_N; i++) {
    const previousLayer = LAYERS[i-1]
    const threshold = i === LAYER_N - 1
      ? 1
      : previousLayer.threshold + 0.02

    LAYERS.push(newLayer(previousLayer, threshold, i))
  }
}


const rules = () => {
  const black = color(0, 0, 10)
  const whiteBg = color(0, 0, 90)
  const whiteStroke = color(0, 0, 85)

  const GRADIENT_PRB = 0.09
  const getGradient = (force, mx=360) => {
    return rnd() < GRADIENT_PRB || force
      ? {
        focalPoint: {
          x: rnd(L, R),
          y: rnd(T, B)
        },
        useElevation: rnd() < 0.9,
        hue: rnd(mx/4, mx) * posOrNeg(),
        sat: 2,
        brt: 1,
      }
      : null
  }

  return {
    blackAndWhite: (baseHue, _, ix, __) => {
      let key
      if ([2, 4].includes(COLOR_RULE)) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [1, 'whiteAndBlack'],
          [1, 'bright']
        ],
        light: [
          [8, 'whiteAndBlack'],
          [2, 'bright'],
        ],
        dark: [
          [1, 'neon']
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [7, 'whiteAndBlack'],
          [3, 'bright'],
          [3, 'neon']
        ]
      }[key]

      return {
        name: 'blackAndWhite',
        baseHue,
        colors: {
          bg: black,
          primary: whiteStroke,
          secondary: whiteStroke,
          tertiary: whiteStroke,
          quarternary: whiteStroke,
          street: whiteStroke,
          circle: whiteStroke,
        },
        neighbors,
        gradient: null,
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    whiteAndBlack: (baseHue, _, ix, __) => {
      let key
      if (COLOR_RULE === 1) key = 'contrast'
      else if (COLOR_RULE === 3) key = 'dark'
      else if ([2, 4].includes(COLOR_RULE)) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [LAYER_N > 3 ? 1 : 0, 'bright'],
          [3, 'blackAndWhite'],
        ],
        dark: [
          [5, 'blackAndWhite'],
          [5, 'neon'],
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [6, 'blackAndWhite'],
          [5, 'neon'],
          [5, 'bright']
        ],
      }[key]

      return {
        name: 'whiteAndBlack',
        baseHue,
        colors: {
          bg: whiteBg,
          primary: black,
          secondary: black,
          tertiary: black,
          quarternary: black,
          street: black,
          circle: black,
        },
        neighbors,
        gradient: null,
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    neon: (baseHue, gradientMax, ix, lightenDarks) => {
      const bg = adjColor(baseHue, 30, lightenDarks ? 22 : 12)
      let c = adjColor(baseHue, 55, 92)

      if (contrast(bg, c) > -0.5) {
        c = setContrastC2(bg, c, -0.5)
      }

      let key
      if (LAYER_N === 2) key = 'color'
      else if (COLOR_RULE === 1) key = 'contrast'
      else if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [1, 'bright'],
        ],
        dark: [
          [2, 'blackAndWhite'],
          [1, 'neon'],
        ],
        light: [
          [2, 'whiteAndBlack'],
          [1, 'bright'],
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [4, 'bright'],
          [5, 'blackAndWhite'],
          [3, 'whiteAndBlack'],
          [2, 'neon'],
        ],
      }[key]

      return {
        name: 'neon',
        baseHue,
        colors: {
          bg,
          primary: c,
          secondary: c,
          tertiary: c,
          quarternary: c,
          street: c,
          circle: c,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    bright: (baseHue, gradientMax, ix, __) => {
      const invertStreets = INVERT_STREETS && ix
      const c1 = adjColor(baseHue, 55, 95)
      const c2 = invertStreets > 0
        ? invertStreetColor(baseHue+180, 50, 85, c1)
        : color(hfix(baseHue + 180), 30, 15)

      let key
      if (COLOR_RULE === 1) key = 'contrast'
      else if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [3, 'blackAndWhite'],
          [LAYER_N > 3 ? 1 : 0, 'whiteAndBlack'],
          [3, 'neon'],
        ],
        dark: [
          [2, 'blackAndWhite'],
          [1, 'neon'],
        ],
        light: [
          [1, 'whiteAndBlack'],
        ],
        color: [
          [1, 'bright'],
        ],
        all: [
          [4, 'blackAndWhite'],
          [2, 'whiteAndBlack'],
          [1, 'neon'],
        ],
      }[key]

      return {
        name: 'bright',
        baseHue,
        colors: {
          bg: c1,
          primary: c2,
          secondary: c2,
          tertiary: c2,
          quarternary: c2,
          street: c2,
          circle: c2,
        },
        neighbors,
        invertStreets,
        gradient: getGradient(FORCE_GRADIENTS, gradientMax),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    paper: (baseHue, gradientMax, ix, __) => {
      const c1 = color(hfix(baseHue), 8, 91)

      const c2 = invertStreetColor(baseHue + HUE_DIFF, 60, 30, c1)
      const c3 = invertStreetColor(baseHue + HUE_DIFF - 10, 40, 35, c1)
      const c4 = invertStreetColor(baseHue + HUE_DIFF - 20, 40, 35, c1)

      let key
      if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {

        dark: [
          [1, 'blackAndWhite'],
          [LAYER_N > 2 ? 1 : 0, 'neon'],
          [1, 'burnt'],
        ],
        light: [
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [1, 'faded'],
        ],
        color: [
          [1, 'bright'],
          [1, 'faded'],
        ],
        all: [
          [6, 'blackAndWhite'],
          [LAYER_N > 2 ? 6 : 0, 'neon'],
          [7, 'burnt'],
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'faded'],
        ],
      }[key]

      return {
        name: 'paper',
        baseHue,
        colors: {
          bg: c1,
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors,
        gradient: getGradient(true, FORCE_GRADIENTS ? gradientMax : rnd(90)),
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    faded: (baseHue, gradientMax, ix, __) => {
      const c1 = adjColor(baseHue, 35, 95)
      const c2 = invertStreetColor(baseHue+HUE_DIFF, 85, 30, c1)
      const c3 = invertStreetColor(baseHue+HUE_DIFF-10, 85, 30, c1)
      const c4 = invertStreetColor(baseHue+HUE_DIFF-20, 85, 30, c1)

      let key
      if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        dark: [
          [1, 'blackAndWhite'],
          [1, 'neon'],
          [2, 'burnt'],
        ],
        light: [
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'paper'],
        ],
        color: [
          [1, 'bright'],
        ],
        all: [
          [2, 'burnt'],
          [2, 'paper'],
          [12, 'blackAndWhite'],
          [5, 'neon'],
          [5, 'whiteAndBlack'],
          [1, 'bright'],
        ],
      }[key]

      return {
        name: 'faded',
        baseHue,
        colors: {
          bg: c1,
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, FORCE_GRADIENTS ? gradientMax : rnd(75)),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    burnt: (baseHue, gradientMax, ix, lightenDarks) => {
      const c1 = color(hfix(baseHue), 35, lightenDarks ? 17 : 15)
      const d = HUE_DIFF > 0 ? 1 : -1

      const c2 = color(hfix(baseHue + HUE_DIFF), 50, 85)
      const c3 = color(hfix(baseHue + HUE_DIFF-30*d), 50, 85)
      const c4 = color(hfix(baseHue + HUE_DIFF-60*d), 50, 85)

      let key
      if (LAYER_N === 2) key = 'color'
      else if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        dark: [
          [3, 'blackAndWhite'],
          [2, 'neon'],
        ],
        light: [
          [2, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'faded'],
        ],
        color: [
          [1, 'bright'],
          [2, 'faded'],
        ],
        all: [
          [6, 'whiteAndBlack'],
          [4, 'faded'],
          [8, 'blackAndWhite'],
          [4, 'neon'],
          [7, 'bright'],
        ],
      }[key]

      return {
        name: 'burnt',
        baseHue,
        colors: {
          bg: c1,
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },
  }
}



function invertStreetColor(_hue, sat, brt, c1) {
  const h = hfix(_hue)
  const c = isBrightColor(hue) ? 0.9 : 0.7
  return setContrastC2(c1, color(h, sat, brt), c)
}


function hideStreetsOverride(layerIx) {
  return (
    SCALE >= 1
    && TURBULENCE
    && layerIx < LAYER_N-1
    && layerIx > 0
  )
}


function findActiveLayer(x, y) {
  const n = getElevation(x, y)

  for (let i = 0; i < LAYERS.length; i++) {
    if (n < LAYERS[i].threshold) return LAYERS[i]
  }

  return LAYERS[LAYERS.length - 1]
}


function getHuePresets(baseHue) {
  switch (abs(HUE_DIFF)) {
    case 0: return [baseHue]
    case 10: return [baseHue, baseHue+10, baseHue+20, baseHue+30, baseHue+40, baseHue+50, baseHue+60]
    case 20: return [baseHue, baseHue + 20, baseHue - 20]
    case 100: return [baseHue, baseHue + 120, baseHue + 180]
    case 120: return [baseHue, baseHue + 120, baseHue - 120]
    case 150: return [baseHue, baseHue + 150, baseHue + 210]
    case 180: return [baseHue, baseHue + 180]
  }
}


function findAvgElevation() {
  let elevationSum = 0
  let elevationIx = 0
  let elevationMin = 1
  let elevationMax = 0
  const step = 30/SCALE
  for (let x = L; x < R; x += step)
  for (let y = T; y < B; y += step) {
    const elevation = getElevation(x, y)
    elevationSum += elevation
    if (elevation < elevationMin) elevationMin = elevation
    if (elevation > elevationMax) elevationMax = elevation
    elevationIx++
  }

  return {
    elevationAverage: elevationSum/elevationIx,
    elevationMin,
    elevationMax
  }
}

function getElevation(x, y) {
  return noise(
    (x/NOISE_DIVISOR)+NOISE_OFFSET,
    (y/NOISE_DIVISOR)+NOISE_OFFSET
  )
}

const setContrast = (_c1, _c2, newContrast=0.4) => {
  _contrast = contrast(_c1, _c2)
  if (_contrast < 0) {
    const amt = (newContrast + _contrast)/0.3
    return {
      c1: color(
        hue(_c1),
        saturation(_c1) + 20*amt,
        brightness(_c1) - 30*amt
      ),
      c2: _c2
    }
  } else {
    const amt = (newContrast - _contrast)/0.3
    return {
      c2: color(
        hue(_c2),
        saturation(_c2) + 20*amt,
        brightness(_c2) - 30*amt
      ),
      c1: _c1
    }
  }
}

const setContrastC2 = (_c1, _c2, newContrast=0.4) => {
  const _contrast = contrast(_c1, _c2)

  const amt = (newContrast - _contrast)/0.3

  return color(
    hue(_c2),
    saturation(_c2) + 20*amt,
    brightness(_c2) - 30*amt
  )
}