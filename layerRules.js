
let LAYERS = []



function setLayers(layerN=3, startingElevation=false) {
  const avgElevation = findAvgElevation()

  const thresholdDiff = 0.02
  const r = rules()
  const ruleNames = Object.keys(r)

  const hueDiff = chance(
    [1, 0],
    [2, 100],
    [2, 150],
    [2, 180],
  ) * posOrNeg()


  const layers = [{
    ix: 0,
    threshold: startingElevation || avgElevation,
    hideStreets: false,
    ...r[sample(ruleNames)](rnd(360), 120)
  }]

  const newLayer = (previousLayer, threshold, ix) => {
    const hue = previousLayer.baseHue + hueDiff
    return {
      ix,
      threshold,
      hideStreets: rnd() < 0.1,
      ...r[chance(...previousLayer.neighbors)](hue)
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



const GRADIEN_PRB = 0.0625
const getGradient = (force, mx=360) => {
  return rnd() < GRADIEN_PRB || force
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
const rules = () => {
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
      }
    },

    neon: (h, gradientMax) => {
      return {
        name: 'neon',
        baseHue: h,
        colors: {
          bg: color(hfix(h), 30, 12),
          primary: color(hfix(h), adjSat(55, h), 95, 80),
          secondary: color(hfix(h), adjSat(55, h), 95, 80),
          tertiary: color(hfix(h), adjSat(55, h), 95, 80),
          quarternary: color(hfix(h), adjSat(55, h), 95, 80),
          street: color(hfix(h), adjSat(55, h), 95, 80),
          circle: color(hfix(h), adjSat(55, h), 95, 80),
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
      }
    }

  }
}



function adjSat(sat, hue) {
  // const h = ((hue + 90) % 180) / 180
  // return sat - map(h, 0, 1, 0, 50)


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
  const offset = SYMMETRICAL_NOISE ? 0 : 100000
  return noise(
    (x+offset)/NOISE_DIVISOR,
    (y+offset)/NOISE_DIVISOR
  )
}

const setContrast = (_c1, _c2, newContrast=0.4) => {
  _contrast = contrast(_c1, _c2)
  if (_contrast < 1) {
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
  _contrast = contrast(_c1, _c2)

  const amt = (newContrast - _contrast)/0.3
  return color(
    hue(_c2),
    saturation(_c2) + 20*amt,
    brightness(_c2) - 30*amt
  )
}