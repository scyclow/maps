


function drawStreetGrid(startX=0, startY=0) {
  push()
  translate(startX, startY)
  MIN_ST_W = 0.7
  MAX_ST_W = 1.3

  const {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords
  } = generateAllCoords()

  const t = TURBULENCE ? 1.75 : 0.5 // 0.5
  const d = TURBULENCE ? 1.25 : 0

  const nsrnd = (x, y, mn, mx) =>
  mn + noise(x/15, y/15) * (mx-mn) + rnd(-0.25, 0.25)
  // rnd(mn, mx)

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
    circle(_x, _y, nsrnd(_x, _y, 5.5*MIN_ST_W, 5.5*MAX_ST_W) + d)
  }))


  drawCoords(primaryAveCoords.coords, (x, y, progress, angle) => {
    const _x = x+rnd(-t, t)
    const _y = y+rnd(-t, t)
    const layer = findActiveLayer(_x, _y)
    if (layer.hideStreets) return

    setC(_x, _y, layer.colors.primary, layer.gradient)
    circle(_x, _y, nsrnd(_x, _y, 6.75*MIN_ST_W, 6.75*MAX_ST_W) + d)
  })
  pop()
}

function drawCoords(coords, dotFn) {

  coords.forEach((coord, i) => {
    const { x: x0, y: y0 } = coord

    if (i > 0) {
      const { x: x1, y: y1 } = coords[i-1]
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
  const densityMinimum = map(SCALE, 0.2, 1.2, 0.1, 0.17)

  const densityOverride =
    DENSITY === 0 ? 0.05 :
    DENSITY === 2 ? 0.5 :
    false


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


  const minDrift = STRAIGHT_STREETS ? 100 : 17

  PRIMARY_DRIFT = HALF_PI/minDrift
  SECONDARY_DRIFT = HALF_PI/rnd(minDrift, minDrift*2)
  TERTIARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))
  QUARTERNARY_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))
  STREET_DRIFT = HALF_PI/(HARD_CURVES ? 2 : rnd(minDrift * 3, minDrift * 6))

  BUFFER = 150/SCALE

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
  const secondaryAveCoords = primaryAveCoords.coords.map((coord, i) => {
    if (rnd() < SECONDARY_PRB && i < cutoff) {
      const branch = pBranch++
      const direction = rnd() < 0.5 ? 1 : -1
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


  let x = startX
  let y = startY
  let angle = startAngle

  const coords = []

  for (let i=0; i<length; i++) {
    angle = map(
      SOFT_CURVES ? getElevation(x, y) : noise(x+NOISE_OFFSET, y+NOISE_OFFSET),
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
        break
      }
    }


    x = nextX
    y = nextY
    coords.push({ x, y, angle })

    if (
      x < L - BUFFER ||
      x > R + BUFFER ||
      y < T - BUFFER ||
      y > B + BUFFER
    ) {
      break
    }
  }

  return {
    coords,
    direction: params.direction || 0,
    branch: params.branch || 0,
  }
}



// function drawGrid() {
//   TURBULENCE = rnd() < 0.85
//   SIMPLE = true



//   MIN_ST_W = 0.8
//   MAX_ST_W = 1.2

//   const t = TURBULENCE ? 0.5 : 1.75 // 0.5
//   const d = TURBULENCE ? 0 : 1.25

//   fill(0)
//   stroke(0)

//   const setC = (x, y, c, g) => {
//     if (g) {
//       console.log('.')
//       const d =
//         dist(x, y, g.focalPoint.x, g.focalPoint.y)
//         / dist(L, B, R, T)

//       const _c = color(
//         hfix(hue(c) + map(d, 0, 1, 0, g.hue)),
//         saturation(c) + map(d, 0, 1, 0, g.sat),
//         brightness(c) + map(d, 0, 1, 0, g.brt),
//       )
//       stroke(_c)
//       fill(_c)


//     } else {
//       stroke(c)
//       fill(c)
//     }

//   }

//   const gridStep = rnd(5, 80)

//   for (let x=L; x<W; x+=rnd(5, 80)) {
//     const _x = SIMPLE ? x : rnd(L, R)
//     dotLine(_x, T, _x, B, (x, y, prg, angle) => {
//       const _x = x+rnd(-t, t)
//       const _y = y+rnd(-t, t)
//       const layer = findActiveLayer(_x, _y)
//       if (layer.hideStreets) return

//       setC(_x, _y, layer.colors.primary, layer.gradient)

//       circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)
//     })
//   }

//   for (let y=T; y<H; y+=rnd(5, 80)) {
//     const _y = SIMPLE ? y : rnd(T, H)
//     dotLine(L, _y, R, _y, (x, y, prg, angle) => {
//       const _x = x+rnd(-t, t)
//       const _y = y+rnd(-t, t)
//       const layer = findActiveLayer(_x, _y)

//       if (layer.hideStreets) return

//       setC(_x, _y, layer.colors.primary, layer.gradient)

//       circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)
//     })
//   }
// }