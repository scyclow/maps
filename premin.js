const setC = (x, y, c, g) => {

  if (g) {
    const d = g.useElevation
      ? getElevation(x, y) * 10
      : dist(x, y, g.focalPoint.x, g.focalPoint.y)
        / dist(L, B, R, T)

    const _c = adjColor(
      hfix(hue(c) + map(d, 0, 1, 0, g.hue)),
      saturation(c) + map(d, 0, 1, 0, g.sat),
      brightness(c) + map(d, 0, 1, 0, g.brt),
    )
    stroke(_c)
    fill(_c)


  } else {
    stroke(c)
    fill(c)
  }
}

const isBrightColor = h => (h >= 90 && h <= 150) || (h >= 270 && h <= 330)

function adjColor(hue, sat, brt, b) {
  hue = hfix(hue)

  let amt = 0
  if (isBrightColor(hue)) {
    amt = 1 - abs(120 - (hue%180)) / 30
  }

  sat = map(amt, 0, 1, sat, sat*.65)

  return color(hue, sat, brt)
}

const noop = () => {}


function scaleModifier(mn, mx) {
  const s =
    g38 < 0.4 && g38 >= 0.3 ? 0.05 :
    g38 < 0.3 ? 0.35 - g38 :
    0

  return map(s, 0, 0.15, mn, mx)
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
}

const createBorderFn = padding => (x, y) =>
  x < L + padding + rnd(-g14, g14) ||
  x > R - padding + rnd(-g14, g14) ||
  y < T + padding + rnd(-g14, g14) ||
  y > B - padding + rnd(-g14, g14)

function dotLine(x1, y1, x2, y2, dotFn, ignoreFn=noop, dash=false) {
  const { d, angle } = lineStats(x1, y1, x2, y2)

  let x = x1
  let y = y1
  for (let i = 0; i <= d; i++) {
    if (dash && i >= d*0.6) return

    if (
      !ignoreFn(x, y)
      && !(g35 && prb(0.7))
      && !(g20 && prb(.2))
    ) {
      dotFn(x, y, i/d, angle);
    }

    ([x, y] = getXYRotation(angle, 1, x, y))
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
function drawBackground(t, b, l, r) {
  push()
  const baseLayer = g36[0]
  background(baseLayer.colors.bg)

  const outsideBorders = createBorderFn(g8)
  const baseStrokeSize = 2/g38

  const strokeParams = g36.map((layer, ix) => {
    const colorOnDark = layer.isColor && baseLayer.isDark
    const lightOnDark = layer.isLight && baseLayer.isDark
    const darkOnColor = baseLayer.isColor && layer.isDark
    const colorMismatch = colorOnDark || darkOnColor

    const darkOnLight = (baseLayer.isLight && layer.isDark)
    const largeLayer = (ix === 0 || ix === g36.length - 1)

    return {
      potentialMismatch: colorMismatch || darkOnLight,
      multiplier: (
        largeLayer && layer.gradient ? map(g38, 0.2, 1.2, 2.6, 1.5) :
        largeLayer && darkOnColor ? max(1, 1.1/g38) :
        largeLayer && colorOnDark ? max(1, 0.75/g38) :
        largeLayer && darkOnLight ? max(1, 1.5/g38) :
        colorMismatch ? max(1, 1/g38) :
        darkOnLight ? max(1, 0.7/g38) :
        lightOnDark ? max(1, 0.7/g38) :
        1
      )
    }
  })

  const buffer = 5/g38
  for (let y = t-buffer; y < b+buffer; y += baseStrokeSize) {
    let strokeSize = baseStrokeSize
    for (let x = l-buffer; x < r+buffer; x += strokeSize) {
      const layer = !g13 && g8 > 0 && outsideBorders(x, y)
        ? g36[0]
        : findActiveLayer(x, y)
      strokeSize = baseStrokeSize/strokeParams[layer.ix].multiplier
      drawBackgroundStroke(x, y, layer, strokeSize, strokeParams[layer.ix])
    }
  }
  pop()
}

function drawBackgroundStroke(x, y, layer, strokeSize, strokeParams) {
  if (g35 && prb(0.5)) return
  const diam = rnd(strokeSize, strokeSize*2) * strokeParams.multiplier/3.5
  const offset = strokeParams.multiplier > 1 ? diam*2 : 0
  const e = getElevation(x, y)

  strokeWeight(diam)

  let hAdj = 0
  let sAdj = 0
  let bAdj = 0
  if (layer.gradient) {

    const d = layer.gradient.useElevation
      ? e * 10
      : dist(x, y, layer.gradient.focalPoint.x, layer.gradient.focalPoint.y)
        / dist(L, B, R, T)

    hAdj = map(d, 0, 1, 0, layer.gradient.hue)
    sAdj = map(d, 0, 1, 0, layer.gradient.sat)
    bAdj = map(d, 0, 1, 0, layer.gradient.brt)
  }


  const { bShadow, sShadow } = getShadow(x, y, e, layer)


  const hGrain = g42 * 45 + 3
  const sGrain = g42 * 10 + 5
  const bGrain = g42 * 5 * (strokeParams.potentialMismatch ? 0 : 1)
  stroke(
    adjColor(
      hfix(hue(layer.colors.bg) + hAdj + rnd(-hGrain, hGrain)),
      saturation(layer.colors.bg) + sAdj + rnd(-sGrain, sGrain) + sShadow,
      brightness(layer.colors.bg) + bAdj + rnd(-10 - bGrain, 0) - bShadow,
    )
  )
  const angle = noise(x+g12, y+g12)

  const [x0, y0] = getXYRotation(
    PI + angle + rnd(-QUARTER_PI, QUARTER_PI),
    5,
    x + rnd(-offset, offset+g37),
    y + rnd(-offset, offset)
  )
  const [x1, y1] = getXYRotation(
    angle + rnd(-QUARTER_PI, QUARTER_PI),
    5,
    x,
    y
  )

  line(x0, y0, x1, y1)
}

function getShadow(x, y, e, layer) {
  const shadow = max(
    0,
    getElevation(x+g29, y+g30) - e,
  ) * g6 * (g10*g38)/300

  const l = map(luminance(layer.colors.bg), 0, 255, 0.5, 1)
  const g = layer.gradient ? min(abs(layer.gradient.hue)/50, 1)*4 : 1
  let bShadow = 0, sShadow = 0
  if (layer.isDark) {
    bShadow = shadow * 500
    sShadow = shadow * 500

  } else if (layer.isColor) {
    magnitude = g * 150 * l
    bShadow = shadow * magnitude
    sShadow = shadow * magnitude * (layer.gradient ? 4 : 2)

  } else if (layer.isLight) {
    bShadow = shadow*100*g
    sShadow = shadow*100*g
  }

  return { sShadow, bShadow }
}function drawStreetGrid(startX, startY) {
  push()
  const {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords
  } = generateAllCoords()

  const t = g20 ? 1.75 : 0.5
  const d = g20 ? 1.25 : 0
  const streetT = t * 0.4
  const streetD = d * 1.6
  const qT = t * 0.8
  const qD = d * 1.2

  streetCoords.forEach((coords, i) => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-streetT, streetT)+startX
    const _y = y+rnd(-streetT, streetT)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.street, layer.gradient)

    if (g1) {
      times(g35 ? 2 : 5, () => {
        const trb = nsrnd(_x, _y, 0, 20)
        circle(_x+rnd(-trb, trb), _y+rnd(-trb, trb), rnd(1*g31, 1*g32))
      })
    } else {
      circle(_x, _y, nsrnd(_x, _y, g31, g32) + streetD)
    }
  }, startX, startY))


  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-qT, qT)+startX
    const _y = y+rnd(-qT, qT)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.quarternary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 2*g31, 2*g32) + qD)
  }, startX, startY))



  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.tertiary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 3.5*g31, 3.5*g32) + d)
  }, startX, startY))



  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.secondary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 5*g31, 5*g32) + d)
  }, startX, startY))


  drawCoords(primaryAveCoords.coords, (x, y) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.primary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 6.25*g31, 6.25*g32) + d)
  }, startX, startY)
  pop()
}

function drawCoords(coords, dotFn, xOff=0, yOff=0) {
  const outsideBorders = createBorderFn(g8)

  const dashLine = prb(g23)
  coords.forEach((coord, i) => {
    const { x: x1, y: y1 } = coord

    if (i > 0) {
      const { x: x0, y: y0 } = coords[i-1]
      dotLine(x0, y0, x1, y1, dotFn, outsideBorders, dashLine)
    }

    if (outsideBorders(x1, y1)) return
    if (i === coords.length-1 && !g2 && !g1) {
      push()

      const layer = findActiveLayer(x1+xOff, y1+yOff)
      if (layer.hideStreets || hideStreetsOverride(layer.ix) || (g35 && prb(0.8))) return
      setC(x1+xOff, y1+yOff, layer.colors.circle, layer.gradient)

      const trb = g20
      times(10, i => {
        const fn = g27 && prb(0.001) ? drawStar : circle
        const d = g35 ? rnd(1, 6) : 8
        fn(x1+rnd(-trb, trb)+xOff, y1+rnd(-trb, trb)+yOff, d)
      })

      pop()
    }
  })
}


function generateAllCoords() {
  const densityMinimum = map(g38, 0.2, 1.2, 0.1, 0.17)

  const densityOverride =
    g34 === 0 ? 0.05 :
    g34 === 2 ? 0.5 :
    false

  const getProb = (mn, mx, coord, override=1) =>
    densityOverride
      ? densityOverride * override
      : mn + (mx-mn) * (1-getElevation(coord.x, coord.y))

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

  const minDrift = g5 ? 100 : scaleModifier(17, 24)

  PRIMARY_DRIFT = HALF_PI/minDrift
  SECONDARY_DRIFT = HALF_PI/rnd(minDrift, minDrift*2)
  TERTIARY_DRIFT = HALF_PI/(g16 ? 2 : rnd(minDrift * 3, minDrift * 6))
  QUARTERNARY_DRIFT = HALF_PI/(g16 ? 2 : rnd(minDrift * 3, minDrift * 6))
  STREET_DRIFT = HALF_PI/(g16 ? 2 : rnd(minDrift * 3, minDrift * 6))

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
    const prob = getProb(densityMinimum, 0.2, coord)

    if (prb(prob) && i < 250) {
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
      const prob = getProb(densityMinimum, 0.2, coord, 1.5)

      if (prb(prob) && i < cutoff) {

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
    const prob = getProb(densityMinimum*2, 0.4, coord, 1.5)

    if (prb(prob)) {
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
    const prob = getProb(0.25, 1, coord, 2)

    return [
      prb(prob) && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI, streetParams),
      prb(prob) && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI + PI, streetParams),
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
  const borderFn = createBorderFn(-180/g38)

  let x = startX
  let y = startY
  let angle = startAngle

  const coords = []

  for (let i=0; i<length; i++) {
    angle = map(
      noise(x+g12, y+g12),
      0,
      1,
      angle - driftAmt,
      angle + driftAmt,
    )
    const a = g0 && findActiveLayer(x, y).ix > 0 ? g0 : 0
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

const drawStar = (x, y, d) => {
  push()
  const getXY = i => getXYRotation(i*TWO_PI/10, i % 2 === 0 ? d/2 : d, x, y)
  beginShape()
  curveVertex(...getXY(-1))
  times(12, p => {
    curveVertex(...getXY(p))
  })
  endShape()
  pop()
}

function drawBorder() {
  if (g17) {
    const space =
      g8 < 50
        ? rnd(1.7, 2.1)
        : rnd(1.98, 2.02)



    dotRect(g40, g41, W-(g8*space), H-(g8*space), (x, y) => {
      const layer = g13 ? findActiveLayer(x, y, true) : g36[0]

      if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

      setC(x+g40, y+g41, layer.colors.circle, layer.gradient)
      circle(x, y, nsrnd(x, y, g4/g38, g4*2.5/g38))
    })



  }
}
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
  g36 = [{
    ix: 0,
    threshold: g33 >= 30 ? elevationMin : elevationAverage,
    hideStreets: false,
    ...r[g22](baseHue, g15/rnd(3, 15), 0, g11)
  }]

  const baseIsLight = ['whiteAndBlack', 'paper'].includes(g22)
  const baseIsColor = ['bright', 'faded'].includes(g22)

  const alternateRule =
    g19 === 5 && baseIsColor ? sample(['bright', 'whiteAndBlack']) :
    g19 === 5 && baseIsLight ? 'bright' :
    false

  let hueIx = 0
  const huePresets = getHuePresets(baseHue)
  const nextHue = (previousHue) => g28 === 'path'
    ? previousHue + g25
    : huePresets[hueIx++ % huePresets.length]


  const newLayer = (previousLayer, threshold, ix) => {
    const hideStreets = prb(0.2) && !g3
    const maxGrad = ix === g33-1 ? g15/rnd(3, 8) : g15

    let nextLayer
    if (g19 === 5 && !(ix % 2)) {
      nextLayer = g36[0]

    } else if (g19 === 5 && ix % 2) {
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

  for (let i = 1; i < g33; i++) {
    const previousLayer = g36[i-1]
    const threshold = i === g33 - 1
      ? 1
      : previousLayer.threshold + 0.02

    g36.push(newLayer(previousLayer, threshold, i))
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
      if ([2, 4].includes(g19)) key = 'light'
      else if (g19 === 3) key = 'dark'
      else if (g19 === 4) key = 'color'
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
      if (g19 === 1) key = 'contrast'
      else if (g19 === 3) key = 'dark'
      else if ([2, 4].includes(g19)) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [g33 > 3 ? 1 : 0, 'bright'],
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
      if (g33 === 2) key = 'color'
      else if (g19 === 1) key = 'contrast'
      else if (g19 === 2) key = 'light'
      else if (g19 === 3) key = 'dark'
      else if (g19 === 4) key = 'color'
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
        gradient: getGradient(g7, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    bright: (baseHue, gradientMax, ix, __) => {
      const invertStreets = g9 && ix
      const c1 = adjColor(baseHue, 55, 95)
      const c2 = invertStreets > 0
        ? invertStreetColor(baseHue+180, 50, 85, c1)
        : color(hfix(baseHue + 180), 30, 15)

      let key
      if (g19 === 1) key = 'contrast'
      else if (g19 === 2) key = 'light'
      else if (g19 === 3) key = 'dark'
      else if (g19 === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [3, 'blackAndWhite'],
          [g33 > 3 ? 1 : 0, 'whiteAndBlack'],
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
        gradient: getGradient(g7, gradientMax),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    paper: (baseHue, gradientMax, ix, __) => {
      const c1 = color(hfix(baseHue), 8, 91)

      const c2 = invertStreetColor(baseHue + g25, 60, 30, c1)
      const c3 = invertStreetColor(baseHue + g25 - 10, 40, 35, c1)
      const c4 = invertStreetColor(baseHue + g25 - 20, 40, 35, c1)

      let key
      if (g19 === 2) key = 'light'
      else if (g19 === 3) key = 'dark'
      else if (g19 === 4) key = 'color'
      else key = 'all'

      const neighbors = {

        dark: [
          [1, 'blackAndWhite'],
          [g33 > 2 ? 1 : 0, 'neon'],
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
          [g33 > 2 ? 6 : 0, 'neon'],
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
        gradient: getGradient(true, g7 ? gradientMax : rnd(90)),
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    faded: (baseHue, gradientMax, ix, __) => {
      const c1 = adjColor(baseHue, 35, 95)
      const c2 = invertStreetColor(baseHue+g25, 85, 30, c1)
      const c3 = invertStreetColor(baseHue+g25-10, 85, 30, c1)
      const c4 = invertStreetColor(baseHue+g25-20, 85, 30, c1)

      let key
      if (g19 === 2) key = 'light'
      else if (g19 === 3) key = 'dark'
      else if (g19 === 4) key = 'color'
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
        gradient: getGradient(g7, g7 ? gradientMax : rnd(75)),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    burnt: (baseHue, gradientMax, ix, lightenDarks) => {
      const c1 = color(hfix(baseHue), 35, lightenDarks ? 17 : 15)
      const d = g25 > 0 ? 1 : -1

      const c2 = color(hfix(baseHue + g25), 50, 85)
      const c3 = color(hfix(baseHue + g25-30*d), 50, 85)
      const c4 = color(hfix(baseHue + g25-60*d), 50, 85)

      let key
      if (g33 === 2) key = 'color'
      else if (g19 === 2) key = 'light'
      else if (g19 === 3) key = 'dark'
      else if (g19 === 4) key = 'color'
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
        gradient: getGradient(g7, gradientMax),
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
    g38 >= 1
    && g20
    && layerIx < g33-1
    && layerIx > 0
  )
}


function findActiveLayer(x, y) {
  const n = getElevation(x, y)

  for (let i = 0; i < g36.length; i++) {
    if (n < g36[i].threshold) return g36[i]
  }

  return g36[g36.length - 1]
}


function getHuePresets(baseHue) {
  switch (abs(g25)) {
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
  const step = 30/g38
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
    (x/g10)+g12,
    (y/g10)+g12
  )
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

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}

g36 = []
g12 = 100000

function setup() {
  g44 = min(innerWidth, innerHeight)
  __canvas = createCanvas(g44, g44)
  noiseSeed(rnd(1000000) + rnd(1000000) + rnd(1000))

  g38 = rnd() + 0.2
  g21 = g44/800
  const sizeADJ = g38*g21

  W = width/sizeADJ
  H = height/sizeADJ
  L = round(-width/(2*sizeADJ), 4)
  R = round(width/(2*sizeADJ), 4)
  T = round(-height/(2*sizeADJ), 4)
  B = round(height/(2*sizeADJ), 4)

  colorMode(HSB, 360, 100, 100)

  setFeatures()
  setLayers()

  console.log('What are you looking for?')
}


function draw() {
  noLoop()

  translate(width/2, height/2)
  scale(g38 * g21)

  const bgBuffer = max(abs(g40), abs(g41))*1.5
  rotate(g3)
  drawBackground(T-bgBuffer, B+bgBuffer, L-bgBuffer, R+bgBuffer)

  rotate(g26)
  drawStreetGrid(g40, g41)

  drawBorder()
}

function setFeatures() {
  g20 = prb(0.18)
  g1 = prb(0.15)
  g2 = prb(0.1)
  g16 = prb(0.1)
  g5 = prb(scaleModifier(0.05, 0.15))
  g27 = prb(0.02)
  g35 = prb(0.01)
  g37 = prb(0.01) ? rnd(30, 100) : 0

  g0 =
    prb(0.2)
      ? rnd(QUARTER_PI/2, QUARTER_PI) * posOrNeg()
      : 0

  g10 = rnd(150, 750) / g38

  g34 = chance(
    [0.03, 0],
    [0.89, 1],
    [0.08, 2],
  )

  g23 = prb(0.25) ? rnd(0.05, 0.2) : 0

  g19 = chance(
    [40, 0], // anything goes
    [15, 1], // contrast
    [5, 2], // all light
    [11, 3], // all dark
    [27, 4], // all color
    [g38 >= 1 && g20 ? 0 : 2, 5], // topographic
  )

  const layerNScaleAdj =
    g1 || g16
      ? 15
      : map(g38, 1.2, 0.2, 1, 20)

  g33 = chance(
    [layerNScaleAdj, 1],
    [6, 2],
    [36, 3],
    [34, rndint(4, 7)],
    [!g16 ? 10 : 0, rndint(7, 10)],
    [!g16 ? 4 : 0, rndint(10, 15)],
    [!g16 ? 2 : 0, 30],
  )


  g22 = chance(
    [g33 <= 4 ? 20 : 0, 'paper'],
    [g33 <= 4 ? 20 : 0, 'faded'],
    [g33 <= 4 ? 15 : 0, 'burnt'],

    [g33 <= 4 ? 10 : 5, 'bright'],
    [6, 'whiteAndBlack'],
    [4, 'blackAndWhite'],
    [g38 <= 0.3 ? 0 : 4, 'neon'],
  )

  g25 = chance(
    [3, 0],
    [2, 20],
    [1, 100],
    [2, 120],
    [1, 150],
    [3, 180],
  ) * posOrNeg()


  g7 = prb(0.03)
  let maxGradientPrb = 0.035
  g9 = false
  g11 = false

  g28 = sample(['path', 'preset'])

  if (g19 === 1) {
    g25 = 0
    g33 = chance(
      [6, 3],
      [1, 4],
      [1, 5],
    )

    g22 = chance(
      [7, 'bright'],
      [3, 'whiteAndBlack'],
      [5, 'blackAndWhite'],
      [5, 'neon'],
    )

  } else if (g19 === 3) {
    g22 = chance(
      [20, 'burnt'],
      [5, 'blackAndWhite'],
      [5, 'neon'],
    )

    g20 = rnd() < 0.4
    g1 = rnd() < 0.3
    g11 = true

  } else if (g19 === 4) {
    maxGradientPrb = 0.05
    g22 = chance(
      [20, 'faded'],
      [30, 'bright'],
      [10, 'paper'],
      [30, 'whiteAndBlack'],
    )

    g33 = chance(
      [25, 3],
      [35, rndint(4,6)],
      [25, rndint(6,9)],
      [!g16 ? 10 : 0, rndint(9, 15)],
      [!g16 ? 5 : 0, rndint(15, 30)],
    )

    g25 = chance(
      [g33 >= 12 ? 2 : 1, 10],
      [4, 20],
      [g33 >= 12 ? 1 : 2, 100],
      [3, 120],
      [g33 >= 12 ? 1 : 3, 150],
      [3, 180],
    ) * posOrNeg()

    if (prb(0.05)) {
      g7 = true
      g9 = true
    } else if (prb(0.5) && g33 <= 4) {
      g9 = true
    }

  } else if (5 === g19) {
    g10 = rnd(150, 500) / g38

    g33 = 50

    g22 = chance(
      [1, 'paper'],
      [1, 'faded'],
      [1, 'bright'],
      [1, 'whiteAndBlack'],
    )

    g25 = chance(
      [6, 0],
      [2, 20],
      [1, 120],
      [1, 180],
    ) * posOrNeg()
  }

  g15 = prb(maxGradientPrb) ? rnd(720, 3000) : 200


  if (g22 === 'blackAndWhite' || g22 === 'neon' && g33 > 2 && g19 !== 3) {
    g25 = chance(
        [1, 0],
        [2, 180],
      ) * posOrNeg()
  }

  if (g33 === 2 && ['neon', 'burnt'].includes(g22)) {
    g25 = chance(
      [5, 0],
      [1, 100],
      [1, 120],
      [1, 150],
      [1, 180],
    ) * posOrNeg()
  }

  const scaleMultiplier = scaleModifier(1, 1.6) * (g35 ? 0.7 : 1)
  g31 = 0.7 * scaleMultiplier
  g32 = 1.3 * scaleMultiplier

  g42 = rnd() < 0.5 || ['blackAndWhite', 'neon', 'burnt'].includes(g22) ? 0 : rnd(0.2, 0.7)

  g40 = 0
  g41 = 0
  g3 = 0


  g13 = prb(0.5)
  g17 = g13 || prb(0.75)

  g8 = chance(
    [6.25, rnd(175, 200)],
    [75, rnd(30, 60)],
    [20, rnd(20, 30)],
  ) / g38

  g4 = map(g38, 0.2, 1.2, 1.6, 2.8) + rnd(-.2, .2)
  g14 = chance(
    [5, 0],
    [3, rnd(3)/g38],
    [1, rnd(3, g8/2)/g38]
  )
  g26 = rnd(-0.0005, 0.0005)
  g40 = rnd(-2, 2)/g38
  g41 = rnd(-2, 2)/g38

  g18 = prb(0.015)

  if (!g17 && g8*g38 <= 30) {
    g14 = g8 - 5/g38
    g17 = false
    g13 = false
  }

  if (g18) {
    g17 = true
    g13 = true
    g4 = rnd(1.4, 3)
    g14 = chance(
      [5, 0],
      [3, rnd(3)/g38],
      [1, rnd(3, g8/2)/g38]
    )

    const div = prb(0.333) ? 2 : 1

    g40 = rnd(-250, 250)/(div*g38)
    g41 = rnd(-250, 250)/(div*g38)
    g3 = rnd(-QUARTER_PI, QUARTER_PI)/(4*div)
  }

  g14 = min(180/g38, g14)

  g29 = 5 * posOrNeg()
  g30 = 5 * posOrNeg()
  g6 = chance(
    [15, 0],
    [50, 1],
    [30, 2],
    [g15 > 200 ? 20 : 1, 15],
  )
}