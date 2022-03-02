function drawStreetGrid2() {
  const coords = generateCoords()
  for (let coord of coords) {
    coord.forEach((c, i) => {
      if (i > 0) {
        const previous = coord[i-1]
        line(previous.x, previous.y, c.x, c.y)
      }
    })
  }
}

function generateCoords() {
  const cityRadius = (dist(0,0, L, B) + 50)/SCALE
  const ave1StartAngle = rnd(360)

  const [startX, startY] = getXYRotation(ave1StartAngle, cityRadius, 0, 0)
  const { angle: startAngle } = lineStats(startX, startY, 0, 0)

  const [startX2, startY2] = getXYRotation(ave1StartAngle + rnd(HALF_PI/2, PI * 0.75), cityRadius, 0, 0)
  const { angle: startAngle2 } = lineStats(startX2, startY2, 0, 0)

  const avenue1Coords = generateAvenueCoords(startX, startY, startAngle)
  const avenue2Coords = generateAvenueCoords(startX2, startY2, startAngle2)



  const streetCoordsL = avenue1Coords.map(coord => generateAvenueCoords(coord.x, coord.y, startAngle + HALF_PI, {
    stopAtIntersections: [{ coords: avenue2Coords }]
  }))
  const streetCoordsR = avenue1Coords.map(coord => generateAvenueCoords(coord.x, coord.y, startAngle - HALF_PI, {
    stopAtIntersections: [{ coords: avenue2Coords }]
  }))

  const connectingStreetCoordsL = generateConnectingCoords(streetCoordsL)
  const connectingStreetCoordsR = generateConnectingCoords(streetCoordsR)

  return [
    avenue1Coords,
    avenue2Coords,
    ...streetCoordsL,
    ...streetCoordsR,
    ...connectingStreetCoordsL,
    ...connectingStreetCoordsR,
  ]
}

function generateConnectingCoords(streetCoords) {
  return streetCoords[0].map((_, i) => {
    return streetCoords.map((streetCoord) => streetCoord[i]).filter(x => !!x)
  })
}

function generateAvenueCoords(startX, startY, startAngle, params={}) {
  const STREET_BLOCK_HEIGHT = 20
  const BUFFER = 150/SCALE

  const driftAmt = params.driftAmt || HALF_PI/32
  const stopAtIntersections = params.stopAtIntersections || []
  const length = params.maxLen || 150
  const maxDistFromCenter = params.maxDistFromCenter || 3000

  let x = startX
  let y = startY
  let angle = startAngle

  // todo, stop at intersections


  const coords = []

  for (let i=0; i<length; i++) {
    angle = map(
      noise((x/250)+NOISE_OFFSET, (y/250)+NOISE_OFFSET),
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
        circle(x, y, 8)
        break
      }
    }

    x = nextX
    y = nextY
    coords.push({ x, y, angle })
    circle(x,y,3)

    if (dist(x, y, 0, 0) >= maxDistFromCenter) {
      break
    }
  }

  return coords

}