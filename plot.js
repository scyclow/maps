let LAYERS = []

const NOISE_OFFSET = 100000

function setup() {
  // W_H_RATIO = 1.25
  // const windowRatio = window.innerWidth/window.innerHeight
  // SIZE = min(window.innerWidth, window.innerHeight)

  // if (W_H_RATIO < windowRatio) {
  //   __canvas = createCanvas(window.innerHeight * W_H_RATIO, window.innerHeight)
  //   SCALE = window.innerHeight/H

  // } else if (W_H_RATIO > windowRatio) {
  //   __canvas = createCanvas(window.innerWidth, window.innerWidth /W_H_RATIO)
  //   SCALE = window.innerWidth/W

  // } else {
  //   __canvas = createCanvas(window.innerWidth, window.innerHeight)
  //   SCALE = window.innerWidth/W
  // }

  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(SIZE, SIZE)
  noiseSeed(rnd(1000000) + rnd(1000000) + rnd(1000))
  colorMode(HSB, 360, 100, 100, 100)

  SCALE = rnd(0.2, 1.2)
  SCALE_ADJ = SIZE/800
  const sizeADJ = SCALE*SCALE_ADJ

  W = width/sizeADJ
  H = height/sizeADJ
  L = round(-width/(2*sizeADJ), 4)
  R = round(width/(2*sizeADJ), 4)
  T = round(-height/(2*sizeADJ), 4)
  B = round(height/(2*sizeADJ), 4)


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


  // SECONDARY_ANGLE_ADJ = chance(
  //   [1, 0],
  //   [STRAIGHT_STREETS ? 0 : 0.15, HALF_PI/3],
  // )

  NOISE_DIVISOR = rnd(150, 750) / SCALE

  DENSITY = chance(
    [SCALE >= 0.8 ? 0.0025 : 0.01, 0],
    [0.97, 1],
    [0.02, 2],
  )

  DASH_RATE = prb(0.125) ? rnd(0.05, 0.2) : 0

  COLOR_RULE = chance(
    [34, 0], // anything goes
    [35, 1], // contrast
    [5, 2], // all light
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
    [!HARD_CURVES ? 4 : 0, rndint(10, 15)],
    [!HARD_CURVES ? 1 : 0, 30],
  )


  let baseRule = chance(
    [layerN <= 4 ? 20 : 0, 'paper'],
    [layerN <= 4 ? 20 : 0, 'faded'],
    [layerN <= 4 ? 15 : 0, 'burnt'],

    [layerN <= 4 ? 10 : 5, 'bright'],
    [6, 'whiteAndBlack'],
    [4, 'blackAndWhite'],
    [SCALE <= 0.3 ? 0 : 4, 'neon'],
  )

  let hueDiff = chance(
    [3, 0],
    [2, 20],
    [1, 100],
    [2, 120],
    [1, 150],
    [3, 180],
  ) * posOrNeg()


  let forceGradients = prb(0.02)
  const maxGradient = prb(0.025) ? rnd(720, 3000) : 200
  let invertStreets = false
  let lightenDarks = false

  HUE_RULE = chance(
    [1, 'path'],
    [1, 'preset'],
  )

  if (COLOR_RULE === 3) {
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
    } else if (prb(0.5) && layerN <= 4) {
      invertStreets = true
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

  if (baseRule === 'blackAndWhite' || baseRule === 'neon' && layerN > 2 && COLOR_RULE !== 3) {
    hueDiff = chance(
        [1, 0],
        [2, 180],
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



  console.log(JSON.stringify({
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
    // SECONDARY_ANGLE_ADJ: SECONDARY_ANGLE_ADJ.toPrecision(2),
    X_OFF,
    Y_OFF,
    MISPRINT_ROTATION,
    MAX_GRADIENT: maxGradient,
    GRAIN: grain,
    SMUDGE,
    STAR_MAP,
    LOW_INK,
    HUE_RULE
  }, null, 2))
  console.log(LAYERS)
}

function draw() {

  noLoop()

  translate(width/2, height/2)
  scale(SCALE * SCALE_ADJ)


  const START = Date.now()


  rotate(ROTATION)
  drawStreetGrid(X_OFF, Y_OFF)



  if (HARD_BORDER) {
  strokeWeight(4)
    const space =
      BORDER_PADDING < 50
        ? rnd(1.7, 2.1)
        : rnd(1.98, 2.02)

    let borderDotsDisplayed = 0
    const drawBorder = (ignoreHide) => {
      console.log(ignoreHide)
      dotRect(X_OFF, Y_OFF, W-(BORDER_PADDING*space), H-(BORDER_PADDING*space), (x, y) => {
        const layer = BORDER_BLEED ? findActiveLayer(x, y, true) : LAYERS[0]
        if (!ignoreHide && (layer.hideStreets || hideStreetsOverride(layer.ix, LAYERS.length))) return
        borderDotsDisplayed++
        setC(x+X_OFF, y+Y_OFF, layer.colors.circle, layer.gradient)
        circle(x, y, nsrnd(x, y, BORDER_THICKNESS/SCALE, BORDER_THICKNESS*2.5/SCALE))
      })
    }

    drawBorder()
    // console.log(borderDisplayed)
    if (borderDotsDisplayed < 30) drawBorder(true)

  }

  // stroke(LAYERS[0])




  console.log(Date.now() - START)
}


function drawStreetGrid(startX=0, startY=0) {
  push()
  strokeWeight(4)
  // translate(startX, startY)
  const scaleMultiplier = scaleModifier(1, 1.6) * (LOW_INK ? 0.7 : 1)
  MIN_ST_W = 0.7 * scaleMultiplier
  MAX_ST_W = 1.3 * scaleMultiplier

  const {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords
  } = generateAllCoords()

  const t = TURBULENCE ? 1.75 : 0.5 // 0.5
  const d = TURBULENCE ? 1.25 : 0
  const streetT = t * 0.4
  const streetD = d * 1.6
  const qT = t * 0.8
  const qD = d * 1.2

  streetCoords.forEach((coords, i) => drawCoords(coords.coords, (x, y, progress, angle) => {
    const _x = x+rnd(-streetT, streetT)+startX
    const _y = y+rnd(-streetT, streetT)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix, LAYERS.length)) return


    if (STREET_TURBULENCE) {
      times(LOW_INK ? 2 : 5, () => {
        const trb = nsrnd(_x, _y, 0, 20)
        circle(_x+rnd(-trb, trb), _y+rnd(-trb, trb), rnd(1*MIN_ST_W, 1*MAX_ST_W))
      })
    } else {
      circle(_x, _y, nsrnd(_x, _y, MIN_ST_W, MAX_ST_W) + streetD)
    }
  }, startX, startY))


  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-qT, qT)+startX
    const _y = y+rnd(-qT, qT)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix, LAYERS.length)) return

    circle(_x, _y, nsrnd(_x, _y, 2*MIN_ST_W, 2*MAX_ST_W) + qD)
  }, startX, startY))



  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix, LAYERS.length)) return

    circle(_x, _y, nsrnd(_x, _y, 3.5*MIN_ST_W, 3.5*MAX_ST_W) + d)
  }, startX, startY))



  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix, LAYERS.length)) return

    circle(_x, _y, nsrnd(_x, _y, 5*MIN_ST_W, 5*MAX_ST_W) + d)
  }, startX, startY))


  drawCoords(primaryAveCoords.coords, (x, y, progress, angle) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix, LAYERS.length)) return

    circle(_x, _y, nsrnd(_x, _y, 6.25*MIN_ST_W, 6.25*MAX_ST_W) + d)
  }, startX, startY)
  pop()
}

function drawCoords(coords, dotFn, xOff=0, yOff=0) {
  const outsideBorders = createBorderFn(BORDER_PADDING)

  const dashLine = prb(DASH_RATE)
  coords.forEach((coord, i) => {
    const { x: x1, y: y1 } = coord

    if (i > 0) {
      const { x: x0, y: y0 } = coords[i-1]
      dotLine(x0, y0, x1, y1, dotFn, outsideBorders, dashLine)
    }
  })
}




function generateAllCoords() {
  const densityMinimum = map(SCALE, 0.2, 1.2, 0.1, 0.17)


  const densityOverride =
    DENSITY === 0 ? 0.05 :
    DENSITY === 2 ? 0.5 :
    false

  const getPrb = (mn, mx, coord, override=1) =>
    densityOverride
      ? densityOverride * override
      : mn + (mx-mn)

  SECONDARY_PRB = densityOverride
    ? densityOverride
    : rnd(densityMinimum, 0.2)
  TERTIARY_PRB = densityOverride
    ? densityOverride*1.5
    : rnd(densityMinimum, 0.2)
  QUARTERNARY_PRB = densityOverride
    ? densityOverride*1.5
    : rnd(densityMinimum*2, 0.4)
  STREET_PRB = densityOverride
    ? densityOverride*2
    : rnd(0.25, 1)

  STREET_BLOCK_HEIGHT = 20 // can go up to maybe 200?

  const minDrift = STRAIGHT_STREETS ? 100 : scaleModifier(17, 24)

  PRIMARY_DRIFT = HALF_PI/minDrift
  SECONDARY_DRIFT = HALF_PI/rnd(minDrift, minDrift*2)
  TERTIARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))
  QUARTERNARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))
  STREET_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))

  const rndH = rnd(T, B)
  const rndW = rnd(L, R)

  const primaryCoordArgs = chance(
    [0.25, [rndW, B+25, lineStats(rndW, B, 0, 0).angle]],
    [0.25, [rndW, T-25, lineStats(rndW, T, 0, 0).angle]],
    [0.25, [L-25, rndH, lineStats(L, rndH, 0, 0).angle]],
    [0.25, [R+25, rndH, lineStats(R, rndH, 0, 0).angle]],
  )

  const primaryAveCoords = generateStreetCoords(...primaryCoordArgs, {
    driftAmt: PRIMARY_DRIFT,
    maxLen: 300,
    ix: 0
  })

  const cutoff = 150

  let pBranch = 0
  let lastIx = {}
  const secondaryAveCoords = primaryAveCoords.coords.map((coord, i) => {

    const prb = getPrb(densityMinimum, 0.2, coord)

    if (rnd() < prb && i < 250) {
    // if (rnd() < prb && i < cutoff) {
      const branch = pBranch++
      const direction = rnd() < 0.5 ? 1 : -1
      if (lastIx[direction] && lastIx[direction] + 3 > i) return

      lastIx[direction] = i
      const angleAdj = (direction === -1 ? HALF_PI : PI+HALF_PI) //+ rnd(-SECONDARY_ANGLE_ADJ, SECONDARY_ANGLE_ADJ)
      return generateStreetCoords(coord.x, coord.y, coord.angle + angleAdj, {
        direction,
        branch,
        driftAmt: SECONDARY_DRIFT,
        maxLen: 200
      })
    }
  }).filter(exists)


  const tertiaryAveCoords = secondaryAveCoords.flatMap((coords, i) => {
    let sBranch = 0
    return coords.coords.map(coord => {
      const prb = getPrb(densityMinimum, 0.2, coord, 1.5)

      if (rnd() < prb && i < cutoff) {

        const direction = rnd() < 0.5 ? 1 : -1
        const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI

        const tertiaryAveParams = {
          direction,
          driftAmt: TERTIARY_DRIFT,
          stopAtIntersections: [
            primaryAveCoords,
            ...secondaryAveCoords,
          ],
        }
        return generateStreetCoords(coord.x, coord.y, coord.angle + angleAdj, tertiaryAveParams)
      }
    }).filter(exists)
  })


  const quarternaryAveCoords = tertiaryAveCoords.flatMap(coords => coords.coords.map(coord => {
    const prb = getPrb(densityMinimum*2, 0.4, coord, 1.5)

    if (rnd() < prb) {
      const direction = rnd() < 0.5 ? 1 : -1
      const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI

      const quarternaryAveParams = {
        direction,
        driftAmt: QUARTERNARY_DRIFT,
        stopAtIntersections: [
          primaryAveCoords,
          ...secondaryAveCoords,
          ...tertiaryAveCoords,
        ],
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
    const prb = getPrb(0.25, 1, coord, 2)

    return [
      rnd() < prb && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI, streetParams),
      rnd() < prb && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI + PI, streetParams),
    ].filter(exists)
  }))


  return {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords,
  }
}


function generateStreetCoords(startX, startY, startAngle, params={}) {
  const driftAmt = params.driftAmt || HALF_PI/16
  const stopAtIntersections = params.stopAtIntersections || []
  const length = params.maxLen || 150
  const borderFn = createBorderFn(-180/SCALE)

  let x = startX
  let y = startY
  let angle = startAngle

  const coords = []

  for (let i=0; i<length; i++) {
    angle = map(
      noise(x+NOISE_OFFSET, y+NOISE_OFFSET),
      0,
      1,
      angle - driftAmt,
      angle + driftAmt,
    )
    const a = KINKED_STREET_FACTOR && getElevation(x, y) > 0.5 ? KINKED_STREET_FACTOR : 0
    const _next = getXYRotation(angle+a, STREET_BLOCK_HEIGHT, x, y)
    const nextX = _next[0]
    const nextY = _next[1]

    if (i) {
      const c1 = { x, y }
      const c2 = { x: nextX, y: nextY }
      const intersectionPoint = findIntersectionPoint(c1, c2, stopAtIntersections)
      if (intersectionPoint) {
        break
      }
    }

    x = nextX
    y = nextY
    coords.push({ x, y, angle })

    if (borderFn(x, y)) {
      break
    }
  }

  return {
    coords,
    direction: params.direction || 0,
    branch: params.branch || 0,
  }
}












const noop = () => {}


function scaleModifier(mn, mx) {
  const s =
    SCALE < 0.4 && SCALE >= 0.3 ? 0.05 :
    SCALE < 0.3 ? 0.35 - SCALE :
    0

  return map(s, 0, 0.15, mn, mx)
}

// function scaleModifier2(mn, mx) {
//   const s =
//     SCALE < 0.4 && SCALE >= 0.3 ? 0.05 :
//     SCALE < 0.3 ? 0.35 - SCALE :
//     0

//   return map(0.35 - SCALE, 0, 0.15, mn, mx)
// }

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
}

const createBorderFn = padding => (x, y) =>
  x < L + padding + rnd(-BORDER_DRIFT, BORDER_DRIFT) ||
  x > R - padding + rnd(-BORDER_DRIFT, BORDER_DRIFT) ||
  y < T + padding + rnd(-BORDER_DRIFT, BORDER_DRIFT) ||
  y > B - padding + rnd(-BORDER_DRIFT, BORDER_DRIFT)

function dotLine(x1, y1, x2, y2, dotFn, ignoreFn=noop, dash=false) {
  if (!ignoreFn(x1, y1)) {
    if (dash) {
      const { d, angle } = lineStats(x1, y1, x2, y2)
      const [x3, y3] = getXYRotation(angle, d*0.5, x1, y1)

      line(x1, y1, x3, y3)
    } else {
      line(x1, y1, x2, y2)
    }
  }
}

function dotRect(x, y, w, h, dotFn) {
  dotLine(x-w/2, y-h/2, x+w/2, y-h/2, dotFn)
  dotLine(x-w/2, y+h/2, x+w/2, y+h/2, dotFn)
  dotLine(x-w/2, y-h/2, x-w/2, y+h/2, dotFn)
  dotLine(x+w/2, y-h/2, x+w/2, y+h/2, dotFn)
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
const nsrnd = (x, y, mn, mx) => mn + noise(x/15, y/15) * (mx-mn) + rnd(-0.25, 0.25)


const posOrNeg = () => prb(0.5) ? 1 : -1

const sample = (a) => a[int(rnd(a.length))]
const exists = x => !!x
const last = a => a[a.length-1]
const hfix = h => ((h%360) + 360) % 360

const luminance = c => (299*red(c) + 587*green(c) + 114*blue(c))/1000
const contrast = (c1, c2) => (luminance(c1) - luminance(c2))/255
const hideStreetsOverride = () => false

function findActiveLayer(x, y) {
  const n = getElevation(x, y)

  for (let i = 0; i < LAYERS.length; i++) {
    if (n < LAYERS[i].threshold) return LAYERS[i]
  }
  return LAYERS[LAYERS.length - 1]
}

function getElevation(x, y) {
  return noise(
    (x/NOISE_DIVISOR)+NOISE_OFFSET,
    (y/NOISE_DIVISOR)+NOISE_OFFSET
  )
}