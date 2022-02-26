


function drawStreetGrid() {
  TURBULENCE = rnd() < 0.85
  MIN_ST_W = 0.8
  MAX_ST_W = 1.2
  IGNORE_STREET_CAP = rnd() < 0.75
  STREET_TURBULENCE = rnd() < 0.1

  const {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords
  } = generateAllCoords()

  const t = TURBULENCE ? 0.5 : 1.75 // 0.5
  const d = TURBULENCE ? 0 : 1.25

  streetCoords.forEach(coords => drawCoords(coords.coords, (x, y, progress, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.street, layer.gradient)

    // setDotColor(x, y, 'street')
    // circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(1*MIN_ST_W, 1*MAX_ST_W))
    if (STREET_TURBULENCE) {
      times(5, () => {
        circle(x+rnd(-10, 10), y+rnd(-10, 10), rnd(1*MIN_ST_W, 1*MAX_ST_W))
      })
    } else {
      circle(_x, _y, rnd(MIN_ST_W, MAX_ST_W) + d)

    }
  }))


  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.quarternary, layer.gradient)
    circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)

    // setDotColor(x, y, 'quarternary')
    // circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(2*MIN_ST_W, 2*MAX_ST_W))
  }))




  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.tertiary, layer.gradient)
    circle(_x, _y, rnd(3.5*MIN_ST_W, 3.5*MAX_ST_W) + d)
    // setDotColor(x, y, 'tertiary')
    // circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(3.5*MIN_ST_W, 3.5*MAX_ST_W))
  }))




  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y, p, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.secondary, layer.gradient)
    circle(_x, _y, rnd(6*MIN_ST_W, 6*MAX_ST_W) + d)
    // setDotColor(x, y, 'secondary')
    // circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(6*MIN_ST_W, 6*MAX_ST_W))
  }))


  drawCoords(primaryAveCoords.coords, (x, y, progress, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.primary, layer.gradient)
    circle(_x, _y, rnd(8*MIN_ST_W, 8*MAX_ST_W) + d)
    // setDotColor(x, y, 'primary')
    // circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(8*MIN_ST_W, 8*MAX_ST_W))
  })
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

    if (i === coords.length-1 && !IGNORE_STREET_CAP && !STREET_TURBULENCE) {
      push()

      const layer = findActiveLayer(x0, y0)
      if (layer.hideStreets) return
      setC(x0, y0, layer.colors.circle, layer.gradient)
      noStroke()

      const trb = TURBULENCE
      times(10, i => {
        circle(x0+rnd(-trb, trb), y0+rnd(-trb, trb), 8)
      })

      pop()
    }
  })
}






function generateAllCoords() {
  const densityMinimum = map(SCALE, 0.2, 1.2, 0.1, 0.15)
  const useDensityMax = rnd() < 0.15

  SECONDARY_PRB = useDensityMax ? 0.2 : rnd(densityMinimum, 0.2)
  TERTIARY_PRB = useDensityMax ? 0.2 : rnd(densityMinimum, 0.2)
  QUARTERNARY_PRB = useDensityMax ? 0.4 : rnd(densityMinimum*2, 0.4)
  STREET_PRB = useDensityMax ? 1 : rnd(0.25, 1)

  HARD_CURVES = rnd() < 0.1
  STREET_BLOCK_HEIGHT = 20 // can go up to maybe 200?


  const minDrift = rnd() < 0.05 ? 100 : 17

  PRIMARY_DRIFT = HALF_PI/minDrift
  SECONDARY_DRIFT = HALF_PI/rnd(minDrift, minDrift*2)
  TERTIARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))
  QUARTERNARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))
  STREET_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))


  let primaryCoordArgs
  const argSeed = rnd()

  const buff = 50
  if (argSeed < 0.25) {
    primaryCoordArgs = [rnd(L-buff, R+buff), B+buff, PI + rnd(-HALF_PI/4, HALF_PI/4)]
  } else if (argSeed < 0.5) {
    primaryCoordArgs = [rnd(L-buff, R+buff), T-buff, 0 + rnd(-HALF_PI/4, HALF_PI/4)]
  } else if (argSeed < 0.75) {
    primaryCoordArgs = [L-buff, rnd(T-buff, B+buff), HALF_PI + rnd(-HALF_PI/4, HALF_PI/4)]
  } else {
    primaryCoordArgs = [R+buff, rnd(T-buff, B+buff), HALF_PI + PI + rnd(-HALF_PI/4, HALF_PI/4)]
  }

  const primaryAveCoords = generateStreetCoords(...primaryCoordArgs, {
    driftAmt: PRIMARY_DRIFT,
    maxLen: 300
  })

  const cutoff = 150

  let pBranch = 0
  const secondaryAveCoords = primaryAveCoords.coords.map((coord, i) => {
    if (rnd() < SECONDARY_PRB && i < cutoff) {
      const branch = pBranch++
      const direction = rnd() < 0.5 ? 1 : -1
      const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI
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
      if (rnd() < TERTIARY_PRB && i < cutoff) {

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
    return [
      rnd() < STREET_PRB && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI, streetParams),
      rnd() < STREET_PRB && generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI + PI, streetParams),
    ].filter(exists)
  }))

  // const cloudCoordList = times(CLOUDS, i =>
  //   generateCloudCoords(
  //     rnd(L, R),
  //     rnd(T, B),
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


function generateStreetCoords(startX, startY, startAngle, params={}) {
  const BUFFER = 700

  const driftAmt = params.driftAmt || HALF_PI/16
  const stopAtIntersections = params.stopAtIntersections || []
  const length = params.maxLen || 150


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
      x < T - BUFFER ||
      x > B + BUFFER ||
      y < L - BUFFER ||
      y > R + BUFFER
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


function drawGrid() {
  TURBULENCE = rnd() < 0.85
  SIMPLE = true



  MIN_ST_W = 0.8
  MAX_ST_W = 1.2

  const t = TURBULENCE ? 0.5 : 1.75 // 0.5
  const d = TURBULENCE ? 0 : 1.25

  fill(0)
  stroke(0)

  const setC = (x, y, c, g) => {
    if (g) {
      console.log('.')
      const d =
        dist(x, y, g.focalPoint.x, g.focalPoint.y)
        / dist(L, B, R, T)

      const _c = color(
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

  const gridStep = rnd(5, 80)

  for (let x=L; x<W; x+=rnd(5, 80)) {
    const _x = SIMPLE ? x : rnd(L, R)
    dotLine(_x, T, _x, B, (x, y, prg, angle) => {
      const _x = x+rnd(-t, t)
      const _y = y+rnd(-t, t)
      const layer = findActiveLayer(_x, _y)
      if (layer.hideStreets) return

      setC(_x, _y, layer.colors.primary, layer.gradient)

      circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)
    })
  }

  for (let y=T; y<H; y+=rnd(5, 80)) {
    const _y = SIMPLE ? y : rnd(T, H)
    dotLine(L, _y, R, _y, (x, y, prg, angle) => {
      const _x = x+rnd(-t, t)
      const _y = y+rnd(-t, t)
      const layer = findActiveLayer(_x, _y)

      if (layer.hideStreets) return

      setC(_x, _y, layer.colors.primary, layer.gradient)

      circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)
    })
  }
}