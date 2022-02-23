
let LAYERS = []



function setLayers() {
  const avgElevation = findAvgElevation()
  const layer2Threshold = avgElevation + chance(
    [0.5, 0.02],
    [0.25, 0.5],
    [0.25, 0.15],
  )

  const r = rules()
  const ruleNames = Object.keys(r)

  const hueDiff = chance(
    [0.5, 0],
    [0.5, 100],
    [0.5, 150],
    [0.5, 180],
  ) * posOrNeg()

  console.log(hueDiff)

  const baseHue = rnd(360)
  const secondaryHue = baseHue + hueDiff
  const tertiaryHue = baseHue + hueDiff*2

  const rule1 = r[sample(ruleNames)](baseHue)
  const rule2 = r[chance(...rule1.neighbors)](secondaryHue)
  const rule3 = r[chance(...rule2.neighbors)](tertiaryHue)



  return [
    {
      threshold: avgElevation,
      hideStreets: true,
      ...rule1
    },
    {
      threshold: layer2Threshold,
      hideStreets: false,
      ...rule2

    },
    {
      threshold: 1,
      hideStreets: false,
      ...rule3

    },
  ]
}


const rules = () => {
  const black = color(8)
  const white = color(0, 0, 90)
  return {
    blackAndWhite: () => ({
      name: 'blackAndWhite',
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
      ]
    }),

    whiteAndBlack: () => ({
      name: 'whiteAndBlack',
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
      ]
    }),

    neon: (h) => ({
      name: 'neon',
      colors: {
        bg: color(hfix(h), 30, 12),
        primary: color(hfix(h), 55, 95),
        secondary: color(hfix(h), 55, 95),
        tertiary: color(hfix(h), 55, 95),
        quarternary: color(hfix(h), 55, 95),
        street: color(hfix(h), 55, 95),
        circle: color(hfix(h), 55, 95),
      },
      neighbors: [
        [0.4, 'blackAndWhite'],
        [0.4, 'whiteAndBlack'],
        [0.2, 'neon'],
        [0.2, 'bright'],
      ]
    }),

    // paper: (h) => ({

    // }),

    bright: (h) => {

      const c1 = color(hfix(h), 55, 95)
      const c2 = color(hfix(h + 180), 30, 15)


      return {
        name: 'bright',
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
        ]
      }
    }

    // dark: (h) => ({

    // }),
  }
}
function getLayerRule(baseHue) {


}












function findActiveLayer(x, y) {
  const n = getElevation(x, y)

  for (i = 0; i < LAYERS.length; i++) {
    if (n < LAYERS[i].threshold) return LAYERS[i]
  }
  return 0
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
    (x+100000)/NOISE_DIVISOR,
    (y+100000)/NOISE_DIVISOR
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