
// TODO rule neighbor probabilities, starting threshold, + spacing should be set into multiple different strategies

// gradual: lower initial threshold, higher threshold diff, subtle changes
// chaotic: lower initial threshold, low threshold diff, drastic changes
// decay: mid initial threshold, low threshold diff, drastic (but bounded) changes, cutoff at top




/*
These look good

neon -> neon


*/


let LAYERS = []



function setLayers(layerN, startingElevation=false) {
  const avgElevation = findAvgElevation()

  const thresholdDiff = 0.02
  const r = rules(layerN)
  const ruleName = chance(
    [20, 'blackAndWhite'],
    [20, 'neon'],
    [10, 'whiteAndBlack'],
    [35, 'paper'],
    [15, 'bright'],
  )

  const hueDiff = chance(
    [1, 0],
    [2, 100],
    [2, 120],
    [2, 150],
    [2, 180],
  ) * posOrNeg()

  const maxGradient = rnd() < 0.05 ? rnd(720, 3000) : 360

  const layers = [{
    ix: 0,
    threshold: startingElevation || avgElevation,
    hideStreets: false,
    ...r[ruleName](rnd(360), maxGradient/3)
  }]

  const newLayer = (previousLayer, threshold, ix) => {
    const hideStreets = rnd() < 0.1
    const nextLayer = chance(...previousLayer.neighbors)

    const hue = nextLayer === 'neon' || nextLayer === 'bright'
      ? previousLayer.baseHue + hueDiff
      : previousLayer.baseHue

    return {
      ix,
      threshold,
      hideStreets,
      ...r[nextLayer](hue, maxGradient)
    }
  }

  for (let i = 1; i < layerN; i++) {
    const previousLayer = layers[i-1]
    const threshold = i === layerN - 1
      ? 1
      : previousLayer.threshold + thresholdDiff

    layers.push(newLayer(previousLayer, threshold, i))
  }

  return layers
}



const GRADIENT_PRB = 0.0625
const getGradient = (force, mx=360) => {
  return rnd() < GRADIENT_PRB || force
    ? {
      focalPoint: {
        x: rnd(L, R),
        y: rnd(T, B)
      },
      hue: rnd(mx/4, mx) * posOrNeg(),
      sat: 0,
      brt: 0,
    }
    : null
}
const rules = (layerN) => {
  const black = color(0,0,8, 80)
  const white = color(0, 0, 90,80)
  const forceGradient = rnd() < 0.02
  return {
    blackAndWhite: (h) => {
      return {
        name: 'blackAndWhite',
        baseHue: h,
        colors: {
          bg: black,
          primary: white,
          secondary: white,
          tertiary: white,
          quarternary: white,
          street: white,
          circle: white,
        },
        neighbors: [
          [0.7, 'whiteAndBlack'],
          [0.3, 'neon'],
          [0.3, 'bright'],
        ],
        gradient: null,
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    whiteAndBlack: (h) => {
      return {
        name: 'whiteAndBlack',
        baseHue: h,
        colors: {
          bg: white,
          primary: black,
          secondary: black,
          tertiary: black,
          quarternary: black,
          street: black,
          circle: black,
        },
        neighbors: [
          [0.5, 'blackAndWhite'],
          [0.5, 'neon'],
          [0.5, 'bright'],
        ],
        gradient: null,
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    neon: (h, gradientMax) => {
      const bg = color(hfix(h), 30, 12)
      let c = color(hfix(h), adjSat(55, h), 95, 80)

      if (contrast(bg, c) > -0.5) {
        c = setContrastC2(bg, c, -0.5)
      }


      return {
        name: 'neon',
        baseHue: h,
        colors: {
          bg,
          primary: c,
          secondary: c,
          tertiary: c,
          quarternary: c,
          street: c,
          circle: c,
        },
        neighbors: [
          [0.4, 'blackAndWhite'],
          [0.4, 'whiteAndBlack'],
          [0.2, 'neon'],
          [0.2, 'bright'],
        ],
        gradient: getGradient(forceGradient, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    bright: (h, gradientMax) => {
      const c1 = color(hfix(h), adjSat(55, h), 95, 80)
      const c2 = color(hfix(h + 180), 30, 15, 80)

      return {
        name: 'bright',
        baseHue: h,
        colors: {
          bg: c1, // looks good at (344, 90, 100) with dark blue strokes
          primary: c2,
          secondary: c2,
          tertiary: c2,
          quarternary: c2,
          street: c2,
          circle: c2,
        },
        neighbors: [
          [0.4, 'blackAndWhite'],
          [0.4, 'whiteAndBlack'],
          [0.2, 'neon'],
        ],
        gradient: getGradient(forceGradient, gradientMax),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    paper: (h, gradientMax) => {
    // DARK_C = color(HUE, 26, 25)
    // LIGHT_C = color(hfix(HUE-72), 6, 91)
    // LIGHT_GRADIENT_C = color(hfix(max(HUE-72, 0)), 6, 91)
    // LIGHTENED_DARK_C = color(HUE, 16, 55)
    // ACCENT_C = color(hfix(HUE-145), 80, 64)
    // LIGHT_ACCENT_C = color(hfix(HUE-145), 55, 64, 30)
    // BRIGHT_LIGHT_C = color(max(HUE-10, 0), 80, 54)
    // BRIGHT_DARK_C = BRIGHT_LIGHT_C
    // [1, 0],
    // [2, 100],
    // [2, 120],
    // [2, 150],
    // [2, 180],

      const c1 = color(hfix(h), 9, 91)

      const c2 = color(hfix(h + 180), 60, 30)
      const c3 = color(hfix(h + 180), 60, 30)
      const c4 = color(hfix(h + 150), 85, 35)
      const c5 = color(hfix(h + 150), 85, 35)
      const c6 = color(hfix(h + 120), 55, 37)

      return {
        name: 'paper',
        baseHue: h,
        colors: {
          bg: c1, // looks good at (344, 90, 100) with dark blue strokes
          primary: c2,
          secondary: c3,
          tertiary: c4,
          quarternary: c5,
          street: c6,
          circle: c6,
        },
        neighbors: [
          [0.2, 'blackAndWhite'],
          [0.2, 'whiteAndBlack'],
          [0.2, 'neon'],
          [0.2, 'bright'],
        ],
        gradient: forceGradient
          ? getGradient(forceGradient, gradientMax)
          : getGradient(true, 120),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    }

  }
}



function adjSat(sat, hue) {
  // const h = ((hue + 90) % 180) / 180
  // return sat - map(h, 0, 1, 0, 50)

  hue = hfix(hue)

  let amt = 0
  if (hue >= 90 && hue <= 150) {
    amt = 1 - abs(120 - hue) / 30

  } else if (hue >= 270 && hue <= 330) {
    amt = 1 - abs(300 - hue) / 30
  }

  return sat - map(amt, 0, 1, 0, 20)
}












function findActiveLayer(x, y) {
  const n = getElevation(x, y)

  for (let i = 0; i < LAYERS.length; i++) {
    if (n < LAYERS[i].threshold) return LAYERS[i]
  }
  return LAYERS[LAYERS.length - 1]
}










function findAvgElevation() {
  let elevationSum = 0
  let elevationIx = 0
  const step = 30/SCALE
  for (let x = L; x < R; x += step)
  for (let y = T; y < B; y += step) {
    elevationSum += getElevation(x, y)
    elevationIx++
  }
  return elevationSum/elevationIx
}

function getElevation(x, y) {
  const offset = SYMMETRICAL_NOISE ? 0 : NOISE_OFFSET
  return noise(
    (x/NOISE_DIVISOR)+offset,
    (y/NOISE_DIVISOR)+offset
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