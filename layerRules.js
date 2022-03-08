
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
  const baseRule = chance(
    [layerN <= 4 ? 25 : 0, 'paper'],
    [5, 'whiteAndBlack'],

    [layerN <= 4 ? 25 : 0, 'faded'],
    [layerN <= 4 ? 10 : 5, 'bright'],

    [layerN <= 4 ? 25 : 0, 'burnt'],
    [5, 'blackAndWhite'],
    [5, 'neon'],
  )
  const hueDiff = chance(
    [1, 0],
    [2, 100],
    [2, 120],
    [2, 150],
    [2, 180],
  ) * posOrNeg()

  const r = rules(layerN, baseRule, hueDiff)

  console.log(hueDiff)

  const maxGradient = rnd() < 0.05 ? rnd(720, 3000) : 300

  const layers = [{
    ix: 0,
    threshold: startingElevation || avgElevation,
    hideStreets: false,
    ...r[baseRule](rnd(360), maxGradient/3, 0)
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
      ...r[nextLayer](hue, maxGradient, ix)
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


const rules = (layerN, baseRule, hueDiff) => {
  const black = color(0,0,8, 80)
  const white = color(0, 0, 90,80)
  const forceGradient = rnd() < 0.02
  const baseIsDark = ['blackAndWhite', 'neon', 'burnt'].includes(baseRule)
  const grain = rnd() < 0.5 ? 0 : rnd(0.2, 1)

  const colorProgressRule = chance(
    [layerN <= 4 ? 0.5 : 0.25, 0], // no special rules
    [0.15, 1], // alternate
    [layerN > 2 ? 0.15 : 0, 2], // all light
    [baseIsDark ? 0.1 : 0, 3], // all dark
    [!baseIsDark ? 0.05 : 0, 4], // lots of color
  )
  console.log(colorProgressRule)

  const canShowLight = isLight => {
    return [0, 2, 4, isLight ? 0 : 1].includes(colorProgressRule)
  }

  const canShowDark = isDark => {
    return [0, 3, isDark ? 0 : 1].includes(colorProgressRule)
  }

  const d = hueDiff < 0 ? -1 : 1
  return {
    blackAndWhite: (h, _, ix) => {
      return {
        name: 'blackAndWhite',
        baseHue: h,
        grain,
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
          [canShowLight(false) ? 0.7 : 0, 'whiteAndBlack'],
          [canShowDark(true) ? 0.3 : 0, 'neon'],
          [canShowLight(false) ? 0.3 : 0, 'bright'],
        ],
        gradient: null,
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    whiteAndBlack: (h, _, ix) => {
      return {
        name: 'whiteAndBlack',
        baseHue: h,
        grain,
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
          [canShowDark(false) ? 0.5 : 0, 'blackAndWhite'],
          [canShowDark(false) ? 0.5 : 0, 'neon'],
          [canShowLight(true) ? 0.5 : 0, 'bright'],
          [colorProgressRule === 4 ? 2 : 0, 'bright'],
        ],
        gradient: null,
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    neon: (h, gradientMax, ix) => {
      const bg = color(hfix(h), 30, 12)
      let c = color(hfix(h), adjSat(55, h), 95, 80)

      if (contrast(bg, c) > -0.5) {
        c = setContrastC2(bg, c, -0.5)
      }


      return {
        name: 'neon',
        baseHue: h,
        grain,
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
          [canShowDark(true) ? 0.4 : 0, 'blackAndWhite'],
          [canShowLight(false) ? 0.4 : 0, 'whiteAndBlack'],
          [canShowDark(true) ? 0.2 : 0, 'neon'],
          [canShowLight(false) ? 0.2 : 0, 'bright'],
        ],
        gradient: getGradient(forceGradient, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    bright: (h, gradientMax, ix) => {
      const c1 = color(hfix(h), adjSat(55, h), 95, 80)
      const c2 = color(hfix(h + 180*d), 30, 15, 80)

      return {
        name: 'bright',
        baseHue: h,
        grain,
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
          [canShowDark(false) ? 0.4 : 0, 'blackAndWhite'],
          [canShowLight(true) ? 0.4 : 0, 'whiteAndBlack'],
          [canShowDark(false) ? 0.2 : 0, 'neon'],
          [colorProgressRule === 4 ? 2 : 0, 'bright'],
        ],
        gradient: getGradient(forceGradient, gradientMax),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    paper: (h, gradientMax, ix) => {
      const c1 = color(hfix(h), 9, 91)
      const hues = [
        color(hfix(h + 180*d), 60, 30),
        color(hfix(h + 150*d), 85, 35),
        color(hfix(h + 120*d), 55, 37),
      ].sort((a, b) => luminance(a) - luminance(b))

      const c2 = color(hue(hues[0]), 60, 30)
      const c3 = color(hue(hues[1]), 85, 35)
      const c4 = color(hue(hues[2]), 55, 37)


      return {
        name: 'paper',
        baseHue: h,
        grain,
        colors: {
          bg: c1, // looks good at (344, 90, 100) with dark blue strokes
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors: [
          [canShowDark(false) ? 0.2 : 0, 'blackAndWhite'],
          [canShowDark(false) && layerN > 2 ? 0.2 : 0, 'neon'],
          [canShowDark(false) ? 0.2 : 0, 'burnt'],
          [canShowLight(true) ? 0.2 : 0, 'whiteAndBlack'],
          [canShowLight(true) ? 0.2 : 0, 'bright'],
          [canShowLight(true) ? 0.4 : 0, 'faded'],
          [colorProgressRule === 4 ? 2 : 0, 'bright'],
        ],
        gradient: forceGradient
          ? getGradient(forceGradient, gradientMax)
          : getGradient(true, 120),
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },
    faded: (h, gradientMax, ix) => {
      const c1 = color(hfix(h), adjSat(35, h), 95, 80)
      const c2 = setContrastC2(c1, color(hfix(h+180*d), 85, 30), 0.7)
      const c3 = setContrastC2(c1, color(hfix(h+150*d), 85, 30), 0.65)
      const c4 = setContrastC2(c1, color(hfix(h+120*d), 85, 30), 0.6)

      return {
        name: 'faded',
        baseHue: h,
        grain,
        colors: {
          bg: c1, // looks good at (344, 90, 100) with dark blue strokes
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors: [
          [canShowDark(false) ? 0.2 : 0, 'blackAndWhite'],
          [canShowDark(false) ? 0.2 : 0, 'neon'],
          [canShowDark(false) ? 0.4 : 0, 'burnt'],
          [canShowLight(true) ? 0.2 : 0, 'whiteAndBlack'],
          [canShowLight(true) ? 0.2 : 0, 'bright'],
          [canShowLight(true) ? 0.4 : 0, 'paper'],
          [colorProgressRule === 4 ? 2 : 0, 'bright'],
        ],
        gradient: forceGradient
          ? getGradient(forceGradient, gradientMax)
          : getGradient(true, 75),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    burnt: (h, gradientMax, ix) => {
      const c1 = color(hfix(h), 35, 15)

      const c2 = color(hfix(h + 180*d), 50, 95, 80)
      const c3 = color(hfix(h + 150*d), 50, 95, 80)
      const c4 = color(hfix(h + 120*d), 50, 95, 80)

      return {
        name: 'burnt',
        baseHue: h,
        grain,
        colors: {
          bg: c1,
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors: [
          [canShowDark(true) ? 0.3 : 0, 'blackAndWhite'],
          [canShowDark(true) ? 0.2 : 0, 'neon'],
          [canShowLight(false) ? 0.4 : 0, 'whiteAndBlack'],
          [canShowLight(false) ? 0.2 : 0, 'bright'],
          [canShowLight(false) ? 0.4 : 0, 'faded'],
        ],
        gradient: getGradient(forceGradient, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },
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