
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
  Meta RULES
    - much lower threshold, but colors are closer to bg. maybe they gradually increase
    - more topographical pattern (ex L0 - L1 - L0 - L1 - L0 - etc)
*/


/*
These look good

neon -> neon


*/



function setLayers(layerN, baseRule, hueDiff, thresholdAdj=1, thresholdDiff = 0.02) {
  const avgElevation = findAvgElevation()
  const r = rules(layerN, baseRule, COLOR_RULE, hueDiff)

  const maxGradient = rnd() < 0.05 ? rnd(720, 3000) : 300
  const layers = [{
    ix: 0,
    threshold: thresholdAdj * avgElevation,
    hideStreets: false,
    ...r[baseRule](rnd(360), maxGradient/3, 0)
  }]

  const baseIsDark = ['blackAndWhite', 'neon', 'burnt'].includes(baseRule)
  const baseIsLight = ['whiteAndBlack', 'paper'].includes(baseRule)
  const baseIsColor = ['bright', 'faded'].includes(baseRule)

  const alternateRule =
    COLOR_RULE === 5 && baseIsColor ? sample(['bright', 'whiteAndBlack']) :
    COLOR_RULE === 5 && baseIsLight ? 'bright' :
    false

  const altHueDiff = chance(
    [1, 120],
    [1, 180],
  )

  const newLayer = (previousLayer, threshold, ix) => {
    const hideStreets = rnd() < 0.1

    let nextLayer


    if (COLOR_RULE === 5 && !(ix % 2)) {
      nextLayer = layers[0]

    } else if (COLOR_RULE === 5 && ix % 2) {
      const hue = nextLayer === 'bright'
        ? previousLayer.baseHue + hueDiff
        : previousLayer.baseHue + altHueDiff
      nextLayer = r[alternateRule](hue, maxGradient, ix)

    } else {
      const nextRule = chance(...previousLayer.neighbors)
      const hue = nextRule === 'neon' || nextRule === 'bright'
        ? previousLayer.baseHue + hueDiff
        : previousLayer.baseHue
      nextLayer = r[nextRule](hue, maxGradient, ix)
    }


    return {
      hideStreets,
      ...nextLayer,
      ix,
      threshold,
    }
  }

  for (let i = 1; i < layerN; i++) {
    const previousLayer = layers[i-1]
    const threshold = i === layerN - 1
      ? 1
      : previousLayer.threshold + thresholdDiff

    layers.push(newLayer(previousLayer, threshold, i))
  }

  console.log(layers)

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


const rules = (layerN, baseRule, COLOR_RULE, hueDiff) => {
  const black = color(0,0,8, 80)
  const white = color(0, 0, 90,80)
  const forceGradient = rnd() < 0.02
  const grain = rnd() < 0.5 ? 0 : rnd(0.2, 1)

  const canShowLight = isLight => {
    return [0, 2, 4, isLight ? 0 : 1].includes(COLOR_RULE)
  }

  const canShowDark = isDark => {
    return [0, 3, isDark ? 0 : 1].includes(COLOR_RULE)
  }

  const d = hueDiff < 0 ? -1 : 1
  return {
    blackAndWhite: (h, _, ix) => {
      let key
      if ([1, 2, 4].includes(COLOR_RULE)) key = 'light'
      else if ([3].includes(COLOR_RULE)) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        light: [
          [0.7, 'whiteAndBlack'],
          [0.3, 'bright'],
        ],
        dark: [
          [1, 'neon']
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [0.7, 'whiteAndBlack'],
          [0.3, 'bright'],
          [0.3, 'neon']
        ]
      }[key]

        // [
        //   [canShowLight(false) ? 0.7 : 0, 'whiteAndBlack'],
        //   [canShowDark(true) ? 0.3 : 0, 'neon'],
        //   [canShowLight(false) ? 0.3 : 0, 'bright'],
        // ]

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
        neighbors,
        gradient: null,
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    whiteAndBlack: (h, _, ix) => {
      let key
      if ([1, 3].includes(COLOR_RULE)) key = 'dark'
      else if ([2, 4].includes(COLOR_RULE)) key = 'color'
      else key = 'all'

      const neighbors = {
        dark: [
          [0.5, 'blackAndWhite'],
          [0.5, 'neon'],
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [0.5, 'blackAndWhite'],
          [0.5, 'neon'],
          [0.5, 'bright']
        ],
      }[key]

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
        neighbors,
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

      let key
      if ([1, 2].includes(COLOR_RULE)) key = 'light'
      else if ([3].includes(COLOR_RULE)) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
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
          [0.4, 'blackAndWhite'],
          [0.4, 'whiteAndBlack'],
          [0.2, 'neon'],
          [0.2, 'bright']
        ],
      }[key]

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
        neighbors,
        gradient: getGradient(forceGradient, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    bright: (h, gradientMax, ix) => {
      const c1 = color(hfix(h), adjSat(55, h), 95, 80)
      const c2 = color(hfix(h + 180*d), 30, 15, 80)

      let key
      if ([1, 3].includes(COLOR_RULE)) key = 'dark'
      else if ([2].includes(COLOR_RULE)) key = 'light'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
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
          [2, 'blackAndWhite'],
          [2, 'whiteAndBlack'],
          [1, 'neon'],
        ],
      }[key]

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
        neighbors,
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

      let key
      if ([1, 3].includes(COLOR_RULE)) key = 'dark'
      else if ([2].includes(COLOR_RULE)) key = 'light'
      else if ([4].includes(COLOR_RULE)) key = 'color'
      else key = 'all'

      const neighbors = {
        dark: [
          [1, 'blackAndWhite'],
          [layerN > 2 ? 1 : 0, 'neon'],
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
          [1, 'blackAndWhite'],
          [layerN > 2 ? 1 : 0, 'neon'],
          [1, 'burnt'],
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'faded'],
        ],
      }[key]


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
        neighbors,
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

      let key
      if ([1, 3].includes(COLOR_RULE)) key = 'dark'
      else if ([2].includes(COLOR_RULE)) key = 'light'
      else if ([4].includes(COLOR_RULE)) key = 'color'
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
          [1, 'blackAndWhite'],
          [1, 'neon'],
          [1, 'whiteAndBlack'],
          [1, 'bright'],
        ],
      }[key]

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
        neighbors,
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

      let key
      if ([1, 2].includes(COLOR_RULE)) key = 'light'
      else if ([3].includes(COLOR_RULE)) key = 'dark'
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
          [4, 'whiteAndBlack'],
          [4, 'faded'],
          [3, 'blackAndWhite'],
          [2, 'neon'],
          [1, 'bright'],
        ],
      }[key]

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
        neighbors,
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