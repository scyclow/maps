


function drawStreetGrid(startX=0, startY=0) {
  push()
  translate(startX, startY)
  const scaleMultiplier = scaleModifier(1, 1.6)
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

  streetCoords.forEach(coords => drawCoords(coords.coords, (x, y, progress, angle) => {
    const streetT = t * 0.7
    const streetD = d * 1.3
    const _x = x+rnd(-streetT, streetT)
    const _y = y+rnd(-streetT, streetT)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.street, layer.gradient)

    if (STREET_TURBULENCE) {
      times(5, () => {
        circle(x+rnd(-10, 10), y+rnd(-10, 10), rnd(1*MIN_ST_W, 1*MAX_ST_W))
      })
    } else {
      circle(_x, _y, nsrnd(_x, _y, MIN_ST_W, MAX_ST_W) + streetD)

    }
  }))


  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const qT = t * 0.9
    const qD = d * 1.1
    const _x = x+rnd(-qT, qT)
    const _y = y+rnd(-qT, qT)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.quarternary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 2*MIN_ST_W, 2*MAX_ST_W) + qD)
  }))




  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.tertiary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 3.5*MIN_ST_W, 3.5*MAX_ST_W) + d)
  }))



  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.secondary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 5*MIN_ST_W, 5*MAX_ST_W) + d)
  }))


  drawCoords(primaryAveCoords.coords, (x, y, progress, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.primary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 6.25*MIN_ST_W, 6.25*MAX_ST_W) + d)
  })
  pop()
}

function drawCoords(coords, dotFn) {
  const outsideBorders = BORDER_PADDING
    ? createBorderFn(BORDER_PADDING)
    : createBorderFn(-20/SCALE)

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


      const layer = findActiveLayer(x1, y1)
      if (layer.hideStreets) return
      setC(x1, y1, layer.colors.circle, layer.gradient)

      const trb = TURBULENCE
      times(10, i => {
        circle(x1+rnd(-trb, trb), y1+rnd(-trb, trb), 8)
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

  const getPrb = (mn, mx, coord, override=1) =>
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


  const minDrift =
    STRAIGHT_STREETS ? 100 : scaleModifier(17, 24)

    console.log('min drift', minDrift)

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
      const angleAdj = (direction === -1 ? HALF_PI : PI+HALF_PI) + rnd(-SECONDARY_ANGLE_ADJ, SECONDARY_ANGLE_ADJ)
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
  const borderFn = createBorderFn(-150/SCALE)


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
    const [nextX, nextY] = getXYRotation(angle+a, STREET_BLOCK_HEIGHT, x, y)

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

