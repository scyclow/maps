/* TODO

Maps of the Hyperreal
Maps of Hyperreality
Maps of the Imaginary
Maps of Ideas
Fake Abstractions
Abstractions of Nothing In Particular
Abstractions of Nothing
Maps of Nothing In Particular
Maps of Nothing
Maps of Nowhere
Imagined Schematics



1000 people were given a description of a complex system, and were asked to draw their interpretation of it in as high detail as possible.
Some chose to hone in on specific details in high resolution while others chose to zoom out for a 50,000 foto view.
Others still chose to omit details for simplicity, and some decided to add details of their own.
Many can't keep their heads straight and combine multiple understandings of the same system into a single image



gen1-4 notes
  - colors
    - w/b > color gradient > b/w
    - w/b > neon
    - w/b > neon > solid color/b
    - w/b > neon > w/b
    - w/b > b/w > inverted
    - b/w > w/b > color gradient
    - b/w > w/b > neon

    - solid red > b/w
    - subtle gradient > b/w
    - dark multicolor > w/b > b/w

    - solid neon
    - subtly gradient/black
    - rainbow neon > light gradient > original rainbow neon
    - subtle 0x9ebc50a9c9474f1ade62134b7ab1be7b1bfd016d4faa6f7b46b81e20c0aa0664
    - really nice gradient 0xe0f7d74cce8e41751d568f8886ffb54de4cfc7b884e9b2717db1410802a5127e
    - hot border 0x51dea61a01bd3ecda2b5c132fa78d234346e3a08c741f9c70d4d0845abe4c282

    - changes should either be really subtle or really stark

  - multicolors should have fewer street colors. don't go as far along the hue spectrum. also, maybe less saturated

  - dots should just be same color as streets



- either have thin cloud borders or two distinct cloud levels
- light color scheme should be less pastel and more paper map-like.

- most clouds should be subtle shifts
  - some clouds should be drastic light<>dark shifts, or inverse color shifts
  - if it's just a different color, be more thoughtful about which color it is














- circle clouds?
- square clouds?
- break turbulence out by level
- turbulence adjsuts with scale
- modify grid algo so outgrowth is most likely at begnining of branch (center of primary), and gets less likey as it goes out
  - then i can zoom waaaay out
- logic for cloud borders
- on double inverted cloud p3, make overlap color either the same as bg or more different
- green clouds don't look very good on dark bgs

- increase length of primary street w/o increasing secondary street numbers
- play around with other avenue types having extreme turbulence
- lighter, pastell palette
- dark bg + single color strokes
- maybe increas cloud noiseDivisor
- maybe play around with second primary avenue
- clouds way too common. should maybe be 1/5? 1/4?


- cloud strategies:
  - small and free floating
  - medium, contained
  - large, on edge
  - several (4-5) covering entire map and overlapping





rarities?
5% fat and fuzzy
5% skinny
5% zoomed way in (1.25)
10% zoomed out (0.35-0.4)
5% zoomed far out (0.25)
10% b/w streets
5% straight
5% really squigly


20% cloud
  - single
  - double
  - b/w


Topography:
  - symetrical 6.25%
  - asymmetrical 68.75%
  - none 25%
*/


function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}




const BUFFER = 700
let SCALE, LEFT, RIGHT, TOP, BOTTOM
let STREET_BLOCK_HEIGHT, TURBULENCE, PRIMARY_DRIFT,
    SECONDARY_DRIFT, TERTIARY_DRIFT, QUARTERNARY_DRIFT, STREET_DRIFT,
    SECONDARY_PRB, TERTIARY_PRB, QUARTERNARY_PRB, STREET_PRB, CLOUDS, IGNORE_STREET_CAP,
    C, STREET_TURBULENCE, CLOUD_DIVISOR, HARD_CURVES, CLOUD_MIN, CLOUD_MAX, FOCAL_POINT,
    HUE_SHIFT, SAT_SHIFT, BRT_SHIFT, MIN_ST_W, MAX_ST_W, SUNSPOT_CLOUDS, LAYER_TOPO_DIVISOR,
    LAYER_SYM_OFFSET, LAYER1_THRESHOLD, LAYER2_THRESHOLD, IGNORE_CLOUDS

const LIGHT_COLOR_RULES = ['lightMultiColor', 'blackOnWhite', 'darkOnColor', 'invertedColors']
const DARK_COLOR_RULES = ['darkMultiColor', 'whiteOnBlack', 'colorOnDark', 'invertedColors']
const ALL_COLOR_RULES = ['darkMultiColor', 'whiteOnBlack', 'colorOnDark', 'lightMultiColor', 'blackOnWhite', 'darkOnColor', 'invertedColors']


let SIZE
function setup() {
  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(SIZE, SIZE);
  noiseSeed(int(rnd(10000000000000000)))

  SCALE = rnd(0.2, 1.2) * SIZE/800

  LEFT = -width/(2*SCALE)
  RIGHT = width/(2*SCALE)
  TOP = -height/(2*SCALE)
  BOTTOM = height/(2*SCALE)

  STREET_BLOCK_HEIGHT = 20 // can go up to maybe 200?
  TURBULENCE = rnd() < 0.85 ? 0.5 : 3 // 0.5
  STREET_TURBULENCE = rnd() < 0.2

  MIN_ST_W = 0.8
  MAX_ST_W = 1.2

  HARD_CURVES = rnd() < 0.1

  PRIMARY_DRIFT = HALF_PI/16
  SECONDARY_DRIFT = HALF_PI/rnd(16, 25)
  TERTIARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(50, 100)) // baseDriftDenom
  QUARTERNARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(50, 100)) // baseDriftDenom
  STREET_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(50, 100)) // baseDriftDenom


  const densityMinimum = map(SCALE, 0.2, 1.2, 0.1, 0.15)
  const useDensityMax = rnd() < 0.15

  SECONDARY_PRB = useDensityMax ? 0.2 : rnd(densityMinimum, 0.2)
  TERTIARY_PRB = useDensityMax ? 0.2 : rnd(densityMinimum, 0.2)
  QUARTERNARY_PRB = useDensityMax ? 0.4 : rnd(densityMinimum*2, 0.4)
  STREET_PRB = useDensityMax ? 1 : rnd(0.25, 1)

  const cloudSeed = rnd()
  CLOUDS =
    cloudSeed < 0.25 ? 0 :
    cloudSeed < 0.75 ? int(rnd(0, 4)) :
    int(rnd(4, 10))





  // CLOUD_MIN = (500 - (CLOUDS + 1) * 40) / SCALE
  // CLOUD_MAX = (1000 - (CLOUDS + 1) * 40) / SCALE

  CLOUD_MIN = (500 - (CLOUDS + 1) * 20) / SCALE
  CLOUD_MAX = (1000 - (CLOUDS + 1) * 20) / SCALE

  IGNORE_STREET_CAP = rnd() < 0.1

  CLOUD_DIVISOR = 1.1

  FOCAL_POINT = {
    x: rnd(LEFT, RIGHT),
    y: rnd(TOP, BOTTOM),
  }

  const gradientSeed = rnd()
  if (gradientSeed < 0.25) {
    HUE_SHIFT = 0
    SAT_SHIFT = 1
  } else if (gradientSeed < 0.92) {
    HUE_SHIFT = rnd(15, 30)
    SAT_SHIFT = 0.9
  } else {
    HUE_SHIFT = rnd(45, 90)
    SAT_SHIFT = 0.5
  }

  BRT_SHIFT = 1

  // if (rnd() < 0.125) SUNSPOT_CLOUDS = true
  if (rnd() < 0.25) IGNORE_CLOUDS = true

  LAYER_TOPO_DIVISOR = map(rnd(), 0, 1, 50, 500)
  LAYER_SYM_OFFSET = rnd() < 0.125 ? 0 : 100000
  LAYER1_THRESHOLD = rnd(0.4, 0.6)
  LAYER2_THRESHOLD = rnd() < 0.5 ? LAYER1_THRESHOLD + 0.05 : LAYER1_THRESHOLD + 0.25

console.log(LAYER_TOPO_DIVISOR, LAYER1_THRESHOLD)

  C = getColorThemes()
}

function draw() {

  noLoop()
  noStroke()
  colorMode(HSB, 360, 100, 100, 100)
  translate(width/2, height/2)
  scale(SCALE)


  const START = Date.now()

  const {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords
  } = generateAllCoords()



  const START_DRAW = Date.now()



  // const setDotColor = (x, y, c) => {
  //   const sum = findActiveLayer(x, y)
  //   const hAdj = + rnd(-10, 10)

  //   let _color
  //   if (sum === 0) {
  //     _color = color(
  //       hfix(hue(c) + hAdj),
  //       (COLOR_SCHEME == 1) ? 0 : saturation(c),
  //       brightness(c),
  //     )

  //   } else if (sum === 1 && C.cloud1Street) {
  //     _color = C.cloud1Street
  //   } else if (sum === 1) {
  //     _color = color(
  //       hfix(hue(c) + 200 + hAdj),
  //       (COLOR_SCHEME == 2) ? 0 : saturation(c) + 10,
  //       brightness(c),
  //     )
  //   } else if (sum === 2 && C.cloud2Street) {
  //     _color = C.cloud2Street
  //   } else if (sum === 2) {
  //     _color = color(
  //       hfix(hue(c) + 40 + hAdj),
  //       (COLOR_SCHEME == 2) ? 0 : saturation(c) + 10,
  //       brightness(c),
  //     )
  //   } else {

  //   }

  //   fill(_color)
  //   stroke(_color)
  // }

  console.log('coords', START_DRAW - START)


  background(C.base.bg)

  // nice bg colors:
    // (359, 50, 20) (along with 0 sat streets)
    // (178, 50, 20) (along with 0 sat streets)


// BACKGROUND
  const START_BG = Date.now()
  drawBackground()

  const END_BG = Date.now()
  console.log('bg', END_BG - START_BG)


  // stroke(color(55, 40, 100))





  const rndLine = (x, y, angle) => {
    const [x0, y0] = getXYRotation(PI+angle+rnd(-HALF_PI/2, HALF_PI/2), 5, x, y)
    const [x1, y1] = getXYRotation(angle+rnd(-HALF_PI/2, HALF_PI/2), 5, x, y)
    line(x0, y0, x1, y1)
  }


  const setDotColor = createDotColorFn()
  streetCoords.forEach(coords => drawCoords(coords.coords, (x, y, progress, angle) => {
    setDotColor(x, y, 'street')

    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(1*MIN_ST_W, 1*MAX_ST_W))
    if (STREET_TURBULENCE) {
      times(5, () => {
        circle(x+rnd(-10, 10), y+rnd(-10, 10), rnd(1*MIN_ST_W, 1*MAX_ST_W))
        // rndLine(x, y, angle)
      })
    }
  }))


  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    setDotColor(x, y, 'quarternary')
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(2*MIN_ST_W, 2*MAX_ST_W))
    // rndLine(x, y, angle)

  }))




  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    setDotColor(x, y, 'tertiary')
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(3.5*MIN_ST_W, 3.5*MAX_ST_W))
    // rndLine(x, y, angle)
  }))




  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    setDotColor(x, y, 'secondary')
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(6*MIN_ST_W, 6*MAX_ST_W))
    // rndLine(x, y, angle)

  }))




  drawCoords(primaryAveCoords.coords, (x, y, progress, angle) => {
    setDotColor(x, y, 'primary')
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(8*MIN_ST_W, 8*MAX_ST_W))
    // rndLine(x, y, angle)
  })


  // i think this is defunct?
  // drawCloudBorder(cloudCoordList)


  const END = Date.now()

  console.log('draw', END - END_BG)

}

function drawBackground() {
  const baseIsWhite = LIGHT_COLOR_RULES.includes(C.base.theme)
  const layer1Dark = DARK_COLOR_RULES.includes(C.layer1.theme)
  const layer2Dark = DARK_COLOR_RULES.includes(C.layer2.theme)

  const adjustedDotSize = 2/SCALE


  for(let x=LEFT; x<width/SCALE; x+=adjustedDotSize) {
    for(let y=TOP; y<height/SCALE; y+=adjustedDotSize) {
      const activeLayer = findActiveLayer(x, y)
      let bgC
      let diam = rnd(adjustedDotSize, adjustedDotSize*2)
      let offset = adjustedDotSize/2
      if (activeLayer === 1) {
        bgC = C.layer1.bg
        if (layer1Dark) {
          diam *= 1.5
        }
      } else if (activeLayer >= 2) {
        bgC = C.layer2.bg
        if (layer2Dark) {
          diam *= 1.5
        }
      } else {
        bgC = C.base.bg
        offset *= 3
      }
      // fill(
      //   hue(bgC),
      //   saturation(bgC),
      //   brightness(bgC) + rnd(-10, 0),
      // )


      // circle(x+rnd(-offset, offset), y+rnd(-offset, offset), diam)

      const adj = dist(x, y, FOCAL_POINT.x, FOCAL_POINT.y)/dist(LEFT, BOTTOM, FOCAL_POINT.x, FOCAL_POINT.y)

      strokeWeight(diam/3.5)
      stroke(
        hfix(hue(bgC) + map(adj, 0, 1, 0, HUE_SHIFT)),
        saturation(bgC) * map(adj, 0, 1, SAT_SHIFT, 1),
        (brightness(bgC) + rnd(-10, 0)) * map(adj, 0, 1, BRT_SHIFT, 1),
      )
      const angle = noise(x, y)
      const [x0, y0] = getXYRotation(PI+angle+rnd(-HALF_PI/2, HALF_PI/2), 5, x, y)
      const [x1, y1] = getXYRotation(angle+rnd(-HALF_PI/2, HALF_PI/2), 5, x, y)
      line(x0, y0, x1, y1)
    }
  }
}

// function drawCloudBorder(cloudCoordList) {
//   const borders = [C.layer1.border, C.layer2.border]
//   cloudCoordList.forEach((nc, i) => {
//     const borderColor = borders[i]
//     if (borderColor) {
//       fill(borderColor)
//       nc.coords.forEach((coord, ix) => {
//         const [x0, y0] = coord
//         const [x1, y1] = nc.coords[ix+1] || coord

//         dotLine(x0, y0, x1, y1, (x, y) => {
//           circle(x, y, rnd(3*0.75, 3*1.2))
//         })
//       })
//     }
//   })
// }

function generateAllCoords() {

  let primaryCoordArgs
  const argSeed = rnd()

  const buff = 50
  if (argSeed < 0.25) {
    primaryCoordArgs = [rnd(LEFT-buff, RIGHT+buff), BOTTOM+buff, PI + rnd(-HALF_PI/4, HALF_PI/4)]
  } else if (argSeed < 0.5) {
    primaryCoordArgs = [rnd(LEFT-buff, RIGHT+buff), TOP-buff, 0 + rnd(-HALF_PI/4, HALF_PI/4)]
  } else if (argSeed < 0.75) {
    primaryCoordArgs = [LEFT-buff, rnd(TOP-buff, BOTTOM+buff), HALF_PI + rnd(-HALF_PI/4, HALF_PI/4)]
  } else {
    primaryCoordArgs = [RIGHT+buff, rnd(TOP-buff, BOTTOM+buff), HALF_PI + PI + rnd(-HALF_PI/4, HALF_PI/4)]
  }

  const primaryAveCoords = generateStreetCoords(...primaryCoordArgs, {
    driftAmt: PRIMARY_DRIFT
  })

  let pBranch = 0
  const secondaryAveCoords = primaryAveCoords.coords.map((coord) => {
    if (rnd() < SECONDARY_PRB) {
      const branch = pBranch++
      const direction = rnd() < 0.5 ? 1 : -1
      const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI
      return generateStreetCoords(coord.x, coord.y, coord.angle + angleAdj, {
        direction,
        branch,
        driftAmt: SECONDARY_DRIFT
      })
    }
  }).filter(exists)


  const tertiaryAveCoords = secondaryAveCoords.flatMap((coords, i) => {
    let sBranch = 0
    return coords.coords.map(coord => {
      if (rnd() < TERTIARY_PRB) {

        const direction = rnd() < 0.5 ? 1 : -1
        const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI

        const tertiaryAveParams = {
          direction,
          driftAmt: TERTIARY_DRIFT,
          stopAtIntersections: [
            primaryAveCoords,
            ...secondaryAveCoords,
          ]
        }
        return generateStreetCoords(coord.x, coord.y, coord.angle + angleAdj, tertiaryAveParams)
      }
    }).filter(exists)
  })


  const quarternaryAveCoords = tertiaryAveCoords.flatMap(coords => coords.coords.map(coord => {
    if (rnd() < QUARTERNARY_PRB) {
      const direction = rnd() < 0.5 ? 1 : -1
      const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI

      const quarternaryAveParams = {
        direction,
        driftAmt: QUARTERNARY_DRIFT,
        stopAtIntersections: [
          primaryAveCoords,
          ...secondaryAveCoords,
          ...tertiaryAveCoords,
        ]
      }

      return generateStreetCoords(coord.x, coord.y, coord.angle + angleAdj, quarternaryAveParams)
    }
  }).filter(exists))

  const streetCoords = secondaryAveCoords.flatMap(coords => coords.coords.flatMap(coord => {
    const streetParams = {
      driftAmt: STREET_DRIFT,
      stopAtIntersections: [
        primaryAveCoords,
        ...secondaryAveCoords,
        ...tertiaryAveCoords,
        ...quarternaryAveCoords,
      ]
    }
    return [
      rnd() < STREET_PRB && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI, streetParams),
      rnd() < STREET_PRB && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI + PI, streetParams),
    ].filter(exists)
  }))

  // const cloudCoordList = times(CLOUDS, i =>
  //   generateCloudCoords(
  //     rnd(LEFT, RIGHT),
  //     rnd(TOP, BOTTOM),
  //     rnd(CLOUD_MIN, CLOUD_MAX),
  //     CLOUD_DIVISOR
  //   ),
  // )

  return {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords,
    // cloudCoordList,
  }
}


function createDotColorFn() {
  return (x, y, selection) => {
    const sum = findActiveLayer(x, y)

    const adj = dist(x, y, FOCAL_POINT.x, FOCAL_POINT.y)/dist(LEFT, BOTTOM, FOCAL_POINT.x, FOCAL_POINT.y)

    const hAdj = map(adj, 0, 1, 0, HUE_SHIFT)

    let _color
    let layer
    if (sum === 0) {
      layer = 'base'
    } else if (sum === 1) {
      layer = 'layer1'
    } else if (sum >= 2) {
      layer = 'layer2'
    }

    _color = color(
      hfix(hue(C[layer][selection]) + hAdj),
      saturation(C[layer][selection]) * map(adj, 0, 1, 0.5, 1),
      brightness(C[layer][selection]),
    )

    fill(_color)
    stroke(_color)
  }
}

const colorRules = {
  darkMultiColor: (h) => {
    const s = 60
    return {
      primary: color(h, s+10, 80),
      secondary: color(hfix(h+40), s, 80),
      tertiary: color(hfix(h+70), s, 80),
      quarternary: color(hfix(h+160), s, 80),
      street: color(hfix(h+220), s, 80),
      bg: color(h, 35, 15),
      circle: color(0, 0, 80),
      border: color(hfix(h+70), s, 80),//color(55, 0, 70) // TODO revisit, possibly null
      theme: 'darkMultiColor',
      layerRules: LIGHT_COLOR_RULES,
    }
  },

  lightMultiColor: (h) => {
    const bg = setContrastC2(color(33, 35, 95), color(h, 20, 100), -0.1)
    return {
      primary: setContrastC2(bg, color(hfix(h+120), 30, 65), 0.5),
      secondary: setContrastC2(bg, color(hfix(h+180), 30, 65), 0.5),
      tertiary: setContrastC2(bg, color(hfix(h+240), 30, 65), 0.5),
      quarternary: setContrastC2(bg, color(hfix(h+300), 30, 65), 0.5),
      street: setContrastC2(bg, color(hfix(h), 30, 65), 0.5),
      bg: bg,
      circle: color(hfix(h+240),60,25),
      border: color(hfix(h+70), 30, 80),
      theme: 'lightMultiColor',
      layerRules: DARK_COLOR_RULES,
    }
  },

  whiteOnBlack: () => ({
    primary: color(0, 0, 90),
    secondary: color(0, 0, 90),
    tertiary: color(0, 0, 90),
    quarternary: color(0, 0, 90),
    street: color(0, 0, 90),
    bg: color(0, 0, 0),
    circle: color(0, 0, 90),
    border: color(0, 0, 90),
    theme: 'whiteOnBlack',
    layerRules: LIGHT_COLOR_RULES,
  }),

  blackOnWhite: () => ({
    primary: color(0, 0, 0),
    secondary: color(0, 0, 0),
    tertiary: color(0, 0, 0),
    quarternary: color(0, 0, 0),
    street: color(0, 0, 0),
    bg: color(0, 0, 90),
    circle: color(0, 0, 0),
    border: color(0, 0, 0),
    theme: 'blackOnWhite',
    layerRules: DARK_COLOR_RULES,
  }),

  darkOnColor: h => ({
    primary: color(hfix(h), 30, 15),
    secondary: color(hfix(h), 30, 15),
    tertiary: color(hfix(h), 30, 15),
    quarternary: color(hfix(h), 30, 15),
    street: color(hfix(h), 30, 15),
    bg: color(hfix(h+180), 55, 95), // looks good at (344, 90, 100) with dark blue strokes
    circle: color(hfix(h), 30, 15),
    border: color(hfix(h), 30, 15),
    theme: 'darkOnColor',
    layerRules: ALL_COLOR_RULES,
  }),

  colorOnDark: h => ({
    primary: color(hfix(h), 55, 95),
    secondary: color(hfix(h), 55, 95),
    tertiary: color(hfix(h), 55, 95),
    quarternary: color(hfix(h), 55, 95),
    street: color(hfix(h), 55, 95),
    bg: color(hfix(h), 30, 12),
    circle: color(hfix(h), 55, 95),
    border: color(hfix(h), 55, 95),
    theme: 'colorOnDark',
    layerRules: LIGHT_COLOR_RULES,
  }),

  invertedColors: h => {
    const { c1, c2 } = setContrast(
      color(hfix(h), 55, 95),
      color(hfix(h+180), 55, 95),
    )

    return ({
      primary: color(0),
      secondary: color(0),
      tertiary: color(0),
      quarternary: color(0),
      street: color(0),
      bg: c2,
      circle: color(0),
      border: null,
      theme: 'invertedColors',
      layerRules: ALL_COLOR_RULES,
    })
  },
}
function getColorThemes() {
  colorMode(HSB, 360, 100, 100, 100)

  const h = hfix(rnd(360))

  const seed = rnd()
  console.log(seed)
  if (seed < 0.15) {
    const direction = posOrNeg()
    const base = colorRules.darkMultiColor(h)
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+200*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+400*direction)

    return {
      base,
      layer1,
      layer2,
    }
  } else if (seed < 0.20) {
    const direction = posOrNeg()
    const base = colorRules.whiteOnBlack()
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+200*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+400*direction)

    return {
      base,
      layer1,
      layer2,
    }
  } else if (seed < 0.25) {
    const direction = posOrNeg()
    const base = colorRules.blackOnWhite()
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+200*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+400*direction)

    return {
      base,
      layer1,
      layer2,
    }
  } else if (seed < 0.55) {
    const direction = posOrNeg()
    const base = colorRules.darkOnColor(h)
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+100*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+400*direction)

    return {
      base,
      layer1,
      layer2,
    }
  } else if (seed < 0.65) {
    const direction = posOrNeg()
    const base = colorRules.colorOnDark(h)
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+200*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+400*direction)

    return {
      base,
      layer1,
      layer2,
    }
  } else if (seed < 0.8) {
    const direction = posOrNeg()
    const base = colorRules.invertedColors(h)
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+180*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+180*direction)

    return {
      base,
      layer1,
      layer2,
    }
  } else {
    const direction = posOrNeg()
    const base = colorRules.lightMultiColor(h)
    const layer1Rule = sample(base.layerRules)
    const layer1 = colorRules[layer1Rule](h+200*direction)
    const layer2Rule = sample(layer1.layerRules)
    const layer2 = colorRules[layer2Rule](h+400*direction)

    console.log(h, layer1Rule)

    return {
      base,
      layer1,
      layer2,
    }
  }





  // const



  // const bg1Hue = hfix(rnd(360))
  // const bg2Hue = hfix(rnd(360))

  // const p2 = {
  //   primary: color(hfix(h+20), 50, 80),
  //   secondary: color(hfix(h+60), 40, 80),
  //   tertiary: color(hfix(h+90), 40, 80),
  //   quarternary: color(hfix(h+180), 40, 80),
  //   street: color(hfix(h+240), 40, 80),
  //   bg1: color(bg1Hue, 35, 20),
  //   bg2: color(bg2Hue, 20, 20),
  //   circle: color(255),
  //   cloudBg1: color(
  //     hfix(bg1Hue+220),
  //     COLOR_SCHEME === 2 ? 0 : 35,
  //     COLOR_SCHEME === 2 ? 0 : 20,
  //   ),
  //   cloudBg2: color(
  //     hfix(bg1Hue+300),
  //     COLOR_SCHEME === 2 ? 0 : 70,
  //     COLOR_SCHEME === 2 ? 0 : 30,
  //   ),
  // }



  // const bgh = hfix(rnd(360))
  // const dark = color(hfix(bgh+180), 30, 15)
  // const p3CloudBg1 = color(
  //   hfix(bg1Hue+120),
  //   COLOR_SCHEME === 2 ? 0 : 55,
  //   COLOR_SCHEME === 2 ? 80 : 95,
  // )
  // const p3CloudBg2 = color(
  //   hfix(bg1Hue+300),
  //   COLOR_SCHEME === 2 ? 0 : 55,
  //   COLOR_SCHEME === 2 ? 80 : 95,
  // )
  // const p3InvertCloud = rnd() < 0.5
  // const p3 = {
  //   primary: dark,
  //   secondary: dark,
  //   tertiary: dark,
  //   quarternary: dark,
  //   street: dark,
  //   bg1: color(bg1Hue, 55, 95), // looks good at (344, 90, 100) with dark blue strokes
  //   bg2: color(hfix(bg1Hue+rnd(-20, 20)), 50, 95),
  //   circle: dark,
  //   cloudBg1: p3CloudBg1,
  //   cloudBg2: p3CloudBg1,
  //   cloud1Street: p3InvertCloud ? inverseColor(p3CloudBg1) : dark,
  //   cloud2Street: p3InvertCloud ? inverseColor(p3CloudBg2) : dark,
  //   cloud1Circle: p3InvertCloud ? inverseColor(p3CloudBg1) : dark,
  //   cloud2Circle: p3InvertCloud ? inverseColor(p3CloudBg2) : dark,
  // }

  // const output = rnd()
  // console.log('OUTPUT', output)
  // return p2//output < 0.5 ? p2 : p3
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


const inverseColor = c => color(
  hfix(hue(c) + 180),
  saturation(c),
  saturation(c) > 0 ? brightness(c) : 0
)



const distFromCloudCenter = (x, y, z, angle, maxR, noiseDivisor) => {
  const [rx, ry] = getXYRotation(angle, 1, x + 1000, y + 1000)
  return noise(rx/noiseDivisor, ry/noiseDivisor, z/noiseDivisor) * maxR
}

const noiseXY = (cx, cy, z, maxR, noiseDivisor) => (progress) => {
  const angle = progress*TWO_PI
  const r = distFromCloudCenter(cx, cy, z, angle, maxR, noiseDivisor)
  return getXYRotation(angle, r, cx, cy)
}


function generateCloudCoords(x, y, r, divisor) {
  const points = 250
  const pointFn = noiseXY(x, y, divisor, r)
  return {
    x, y, r,
    coords: [...times(points, p => pointFn(p/points)), pointFn(1)]
  }
}



function drawCoords(coords, dotFn) {
  coords.forEach((coord, i) => {
    const { x: x0, y: y0 } = coord

    if (i > 0) {
      const { x: x1, y: y1 } = coords[i-1]

      // strokeWeight(1)
      // stroke(255)
      // line(x0, y0, x1, y1)
      dotLine(x0, y0, x1, y1, dotFn)

    }

    if (i === coords.length-1 && !IGNORE_STREET_CAP) {
      push()
      const activeLayer = findActiveLayer(x0, y0)

      if (activeLayer === 1 && C.layer1.circle) {
        fill(C.layer1.circle)
      } else if (activeLayer === 2 && C.layer2.circle) {
        fill(C.layer2.circle)
      } else {
        fill(C.base.circle)
      }
      noStroke()

      const trb = TURBULENCE
      times(10, i => {
        circle(x0+rnd(-trb, trb), y0+rnd(-trb, trb), 8)
      })

      pop()
    }
  })
}

function drawCoordsLine(coords, xOffset, yOffset, weight) {
  push()
  strokeWeight(weight)
  coords.forEach((coord, i) => {
    if (i > 0) {
      const { x: x0, y: y0 } = coord
      const { x: x1, y: y1 } = coords[i-1]
      line(x0+xOffset, y0+yOffset, x1+xOffset, y1+yOffset)
    }
  })
  pop()

}


const coordToTuple = ({ x, y }) => [x, y]

function findIntersectionPoint(c1, c2, coordLists) {
  if (!coordLists.length) return false
  const coord1 = coordToTuple(c1)
  const coord2 = coordToTuple(c2)

  return coordLists.some(coordList => {

    if (coordList.coords.length < 10) return intersects(
      coordToTuple(c1),
      coordToTuple(c2),
      coordToTuple(coordList.coords[0]),
      coordToTuple(last(coordList.coords))
    )

    const size =
      coordList.coords.length < 20 ? 2 :
      coordList.coords.length < 40 ? 4 :
      coordList.coords.length < 70 ? 7 :
      10

    for (let i=0; i<coordList.coords.length; i+=size) {
      const coord3 = coordToTuple(coordList.coords[i])
      const coord4 = coordToTuple(coordList.coords[i+size] || last(coordList.coords))
      const bool = intersects(coord1, coord2, coord3, coord4)

      if (bool) return bool
    }
    return false
  })




  // return coordLists.some(coordList => intersects(
  //   coordToTuple(c1),
  //   coordToTuple(c2),
  //   coordToTuple(coordList.coords[0]),
  //   coordToTuple(last(coordList.coords))
  // ))

}


function generateStreetCoords(startX, startY, startAngle, params={}) {
  const driftAmt = params.driftAmt || HALF_PI/16
  const stopAtIntersections = params.stopAtIntersections || []
  const length = 150


  let x = startX
  let y = startY
  let angle = startAngle

  const coords = []

  for (let i=0; i<length; i++) {
    angle = map(
      noise(x/5, y/5),
      0,
      1,
      angle - driftAmt,
      angle + driftAmt,
    )
    const [nextX, nextY] = getXYRotation(angle, STREET_BLOCK_HEIGHT, x, y)

    if (i) {
      const c1 = { x, y }
      const c2 = { x: nextX, y: nextY }
      const intersectionPoint = findIntersectionPoint(c1, c2, stopAtIntersections)
      if (intersectionPoint) {
        // circle(x, y, 8)
        break
      }
    }


    x = nextX
    y = nextY
    coords.push({ x, y, angle })

    if (
      (x) < TOP - BUFFER ||
      (x) > BOTTOM + BUFFER ||
      (y) < LEFT - BUFFER ||
      (y) > RIGHT + BUFFER
    ) {
      // debugger
      break
    }
  }

  return {
    coords,
    direction: params.direction || 0,
    branch: params.branch || 0,
  }
}


function dotLine(x1, y1, x2, y2, dotFn) {
  const { d, angle } = lineStats(x1, y1, x2, y2)

  let x = x1
  let y = y1
  for (let i = 0; i <= d; i++) {
    dotFn(x, y, i/d, angle);

    ([x, y] = getXYRotation(angle, 1, x, y))
  }
}





function streetBg(streetCoords, quarternaryAveCoords, tertiaryAveCoords, secondaryAveCoords, primaryAveCoords) {
  stroke(25)
  let xOffset = 215
  let yOffset = 215
  streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)


  xOffset = -215
  yOffset = -215
  streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)

  xOffset = 215
  yOffset = -215
  streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)

  xOffset = -215
  yOffset = 215
  streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)
}



function inCloud(p, polygon) {
  const { d, angle } = lineStats(polygon.x, polygon.y, p.x, p.y)
  return d < distFromCloudCenter(polygon.x, polygon.y, 1, angle, polygon.r, CLOUD_DIVISOR)
}

function findActiveLayer(x, y) {
  // if (SUNSPOT_CLOUDS) return cloudCoordList.reduce((sum, nc) => inCloud({ x, y }, nc) ? sum + 1 : sum, 0)
  if (IGNORE_CLOUDS) return 0

  const n = noise((x+LAYER_SYM_OFFSET)/LAYER_TOPO_DIVISOR, (y+LAYER_SYM_OFFSET)/LAYER_TOPO_DIVISOR)
  if (n < LAYER1_THRESHOLD) return 0
  if (n < LAYER2_THRESHOLD) return 1
  return 2
}



const lineStats = (x1, y1, x2, y2) => ({
  d: dist(x1, y1, x2, y2),
  angle: atan2(x2 - x1, y2 - y1)
})


function inPolygon(p, polygon) {
  if (
    dist(p[0], p[1], polygon.x, polygon.y) > polygon.r
  )
  return false

  const infLine = [width*2, height*2]
  const intersections = polygon.coords.reduce((sum, l, i) => {
    const nextI = (i+1) % polygon.coords.length
    const nextLine = polygon.coords[nextI]

    return intersects(p, infLine, l, nextLine)
      ? sum + 1
      : sum
  }, 0)

  return intersections % 2 === 1
}

function intersects(
  [x1, y1],
  [x2, y2],
  [x3, y3],
  [x4, y4]
) {
  const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1)
  if (det === 0) return false

  const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det
  const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det
  if ( (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1) ) {
    return [
      x1 + lambda * (x2 - x1),
      y1 + lambda * (y2 - y1)
    ]
  } else {
    return null
  }
}



// UTILS

function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    sin(deg) * radius + cx,
    cos(deg) * radius + cy,
  ]
}



function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

let __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16)

const resetRandomSeed = () => { __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16) }

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

const posOrNeg = () => prb(0.5) ? 1 : -1

const sample = (a) => a[int(rnd(a.length))]
const hfix = h => (h + 360) % 360
const exists = x => !!x
const last = a => a[a.length-1]

const luminance = c => (299*red(c) + 587*green(c) + 114*blue(c))/1000
const contrast = (c1, c2) => (luminance(c1) - luminance(c2))/255


