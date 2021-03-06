function drawStreetGrid(startX, startY) {
  push()
  const {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords
  } = generateAllCoords()

  const t = TURBULENCE ? 1.75 : 0.5
  const d = TURBULENCE ? 1.25 : 0
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

    if (STREET_TURBULENCE) {
      times(LOW_INK ? 2 : 5, () => {
        const trb = nsrnd(_x, _y, 0, 20)
        circle(_x+rnd(-trb, trb), _y+rnd(-trb, trb), rnd(1*MIN_ST_W, 1*MAX_ST_W))
      })
    } else {
      circle(_x, _y, nsrnd(_x, _y, MIN_ST_W, MAX_ST_W) + streetD)
    }
  }, startX, startY))


  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-qT, qT)+startX
    const _y = y+rnd(-qT, qT)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.quarternary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 2*MIN_ST_W, 2*MAX_ST_W) + qD)
  }, startX, startY))



  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.tertiary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 3.5*MIN_ST_W, 3.5*MAX_ST_W) + d)
  }, startX, startY))



  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.secondary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 5*MIN_ST_W, 5*MAX_ST_W) + d)
  }, startX, startY))


  drawCoords(primaryAveCoords.coords, (x, y) => {
    const _x = x+rnd(-t, t)+startX
    const _y = y+rnd(-t, t)+startY
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

    setC(_x, _y, layer.colors.primary, layer.gradient)
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

    if (outsideBorders(x1, y1)) return
    if (i === coords.length-1 && !IGNORE_STREET_CAP && !STREET_TURBULENCE) {
      push()

      const layer = findActiveLayer(x1+xOff, y1+yOff)
      if (layer.hideStreets || hideStreetsOverride(layer.ix) || (LOW_INK && prb(0.8))) return
      setC(x1+xOff, y1+yOff, layer.colors.circle, layer.gradient)

      const trb = TURBULENCE
      times(10, i => {
        const fn = STAR_MAP && prb(0.001) ? drawStar : circle
        const d = LOW_INK ? rnd(1, 6) : 8
        fn(x1+rnd(-trb, trb)+xOff, y1+rnd(-trb, trb)+yOff, d)
      })

      pop()
    }
  })
}


function generateAllCoords() {
  const densityMinimum = map(SCALE, 0.2, 1.2, 0.1, 0.17)

  const densityOverride =
    DENSITY === 0 ? 0.05 :
    DENSITY === 2 ? 0.5 :
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
    const a = KINKED_STREET_FACTOR && findActiveLayer(x, y).ix > 0 ? KINKED_STREET_FACTOR : 0
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

