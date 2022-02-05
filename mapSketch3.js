/* TODO

Maps of the Hyperreal
Maps of Hyperreality
Maps of the Imaginary
Maps of Ideas

- circle clouds?
- square clouds?
- break turbulence out by level
- turbulence adjsuts with scale
- modify grid algo so outgrowth is most likely at begnining of branch (center of primary), and gets less likey as it goes out
  - then i can zoom waaaay out
- logic for cloud borders
- on double inverted cloud p3, make overlap color either the same as bg or more different
- green clouds don't look very good on dark bgs
  - well, a lot of colors don't look great on dark bg. explore using p3 for clouds  on p2/b&w base

- increase length of primary street w/o increasing secondary street numbers
- play around with other avenue types having extreme turbulence
- lighter, pastell palette
- dark bg + single color strokes


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
    SECONDARY_PRB, TERTIARY_PRB, QUARTERNARY_PRB, CLOUDS, COLOR_SCHEME, IGNORE_STREET_CAP,
    C, STREET_TURBULENCE

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
  noiseSeed(int(rnd(10000000000000000)))

  SCALE = rnd(0.2, 1.2)

  LEFT = -width/(2*SCALE)
  RIGHT = width/(2*SCALE)
  TOP = -height/(2*SCALE)
  BOTTOM = height/(2*SCALE)

  STREET_BLOCK_HEIGHT = 20 // can go up to maybe 200?
  TURBULENCE = rnd() < 0.7 ? 0.5 : 5 // 0.5
  STREET_TURBULENCE = rnd() < 0.2

  const hardCurves = rnd() < 0.1

  PRIMARY_DRIFT = HALF_PI/16
  SECONDARY_DRIFT = HALF_PI/rnd(16, 25)
  TERTIARY_DRIFT = HALF_PI/(hardCurves ? 2 : rnd(50, 100)) // baseDriftDenom
  QUARTERNARY_DRIFT = HALF_PI/(hardCurves ? 2 : rnd(50, 100)) // baseDriftDenom
  STREET_DRIFT = HALF_PI/(hardCurves ? 2 : rnd(50, 100)) // baseDriftDenom

  SECONDARY_PRB = 0.2
  TERTIARY_PRB = 0.2//0.5
  QUARTERNARY_PRB = 0.4//0.5

  CLOUDS =
    rnd() < 0.5 ? 0 :
    rnd() < 0.75 ? 1 :
    2

  IGNORE_STREET_CAP = rnd() < 0.05


  const csSeed = rnd()
  COLOR_SCHEME =
    csSeed < 0.5 ? 0 :  // both colors
    csSeed < 0.75 ? 1 : // bw base, color cloud
    2                   // color base, bw cloud

  colorMode(HSB, 360, 100, 100, 100)

  C = getColorPalette()
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
    streetCoords,
    noiseCoordList
  } = generateAllCoords()



  const START_DRAW = Date.now()



  const setNoiseColor = (x, y, c) => {
    const sum = countCloudOverlaps(x, y, noiseCoordList)
    const hAdj = + rnd(-10, 10)

    let _color
    if (sum === 0) {
      _color = color(
        hfix(hue(c) + hAdj),
        (COLOR_SCHEME == 1) ? 0 : saturation(c),
        brightness(c),
      )

    } else if (sum === 1 && C.cloud1Street) {
      _color = C.cloud1Street
    } else if (sum === 1) {
      _color = color(
        hfix(hue(c) + 200 + hAdj),
        (COLOR_SCHEME == 2) ? 0 : saturation(c) + 10,
        brightness(c),
      )
    } else if (sum === 2 && C.cloud2Street) {
      _color = C.cloud2Street
    } else if (sum === 2) {
      _color = color(
        hfix(hue(c) + 40 + hAdj),
        (COLOR_SCHEME == 2) ? 0 : saturation(c) + 10,
        brightness(c),
      )
    } else {

    }

    fill(_color)
    stroke(_color)
  }

  console.log('coords', START_DRAW - START)


  background(C.bg2)

  // nice bg colors:
    // (359, 50, 20) (along with 0 sat streets)
    // (178, 50, 20) (along with 0 sat streets)


// BACKGROUND
  const START_BG = Date.now()
  drawBackground(noiseCoordList)

  const END_BG = Date.now()
  console.log('bg', END_BG - START_BG)



  // stroke(color(55, 40, 100))
  stroke(color(55, 0, 70))
  // noiseCoordList.forEach(nc => {
  //   nc.coords.forEach((coord, ix) => {
  //     const [x0, y0] = coord
  //     const [x1, y1] = nc.coords[ix+1] || coord

  //     dotLine(x0, y0, x1, y1, (x, y) => {
  //       circle(x, y, rnd(3*0.75, 3*1.2))
  //     })
  //   })
  // })




  noStroke()


  streetCoords.forEach(coords => drawCoords(coords.coords, noiseCoordList, (x, y, progress) => {
    // circle(x+rnd(0, 50), y+rnd(0, 50), rnd(1*0.75, 2*1.2))
    setNoiseColor(x, y, C.street)

    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(1*0.75, 1*1.2))
    if (STREET_TURBULENCE) {
      times(5, () => {
        circle(x+rnd(-10, 10), y+rnd(-10, 10), rnd(1*0.75, 1*1.2))
      })
    }
  }))






  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, noiseCoordList, (x, y) => {
    setNoiseColor(x, y, C.quarternary)
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(2*0.75, 2*1.2))
  }))




  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, noiseCoordList, (x, y) => {
    setNoiseColor(x, y, C.tertiary)
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(2*0.75, 4*1.2))
  }))




  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, noiseCoordList, (x, y) => {
    setNoiseColor(x, y, C.secondary)
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(6*0.75, 6*1.2))
  }))




  drawCoords(primaryAveCoords.coords, noiseCoordList, (x, y) => {
    setNoiseColor(x, y, C.primary)
    circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(8*0.75, 8*1.2))
  })


  const END = Date.now()

  console.log('draw', END - END_BG)

}

function drawBackground(noiseCoordList) {
  for(let x=LEFT; x<width/SCALE; x+=2) {
    for(let y=TOP; y<height/SCALE; y+=2) {
      const cloudOverlaps = countCloudOverlaps(x, y, noiseCoordList)
      if (cloudOverlaps === 1) {
        fill(C.cloudBg1)
      } else if (cloudOverlaps === 2) {
        fill(C.cloudBg2)
      } else {
        fill(
          hue(C.bg1),
          saturation(C.bg1),
          brightness(C.bg1) + rnd(-10, 0),
        )
      }
      circle(x+rnd(-3, 3), y+rnd(-3, 3), rnd(2, 4))
    }
  }
}

function generateAllCoords() {

  let primaryCoordArgs
  const argSeed = rnd()
  if (argSeed < 0.25) {
    primaryCoordArgs = [rnd(LEFT, RIGHT), BOTTOM, PI + rnd(-HALF_PI/4, HALF_PI/4)]
  } else if (argSeed < 0.5) {
    primaryCoordArgs = [rnd(LEFT, RIGHT), TOP, 0 + rnd(-HALF_PI/4, HALF_PI/4)]
  } else if (argSeed < 0.75) {
    primaryCoordArgs = [LEFT, rnd(TOP, BOTTOM), HALF_PI + rnd(-HALF_PI/4, HALF_PI/4)]
  } else {
    primaryCoordArgs = [RIGHT, rnd(TOP, BOTTOM), HALF_PI + PI + rnd(-HALF_PI/4, HALF_PI/4)]
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
      generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI, streetParams),
      generateStreetCoords(coord.x, coord.y, coord.angle + HALF_PI + PI, streetParams),
    ]
  }))

  const noiseCoordList = times(CLOUDS, i =>
    generateNoiseCoords(rnd(LEFT, RIGHT), rnd(TOP, BOTTOM), rnd(500/SCALE, 1000/SCALE)),
  )

  return {
    primaryAveCoords,
    secondaryAveCoords,
    tertiaryAveCoords,
    quarternaryAveCoords,
    streetCoords,
    noiseCoordList,
  }
}

function getColorPalette() {

  const bg1Hue = hfix(rnd(360))
  const bg2Hue = hfix(rnd(360))


  const p1 = {
    primary: color(hfix(0), 60, 80),
    secondary: color(hfix(60), 40, 80),
    tertiary: color(hfix(120), 40, 80),
    quarternary: color(hfix(180), 40, 80),
    street: color(hfix(240), 40, 80),
    bg1: color(bg1Hue, 50, 20),
    bg2: color(bg2Hue, 20, 20),
    circle: color(255),
    cloudBg1: color(
      hfix(bg1Hue+120),
      COLOR_SCHEME === 2 ? 0 : 70,
      COLOR_SCHEME === 2 ? 0 : 30,
    ),
    cloudBg2: color(
      hfix(bg1Hue+300),
      COLOR_SCHEME === 2 ? 0 : 70,
      COLOR_SCHEME === 2 ? 0 : 30,
    ),
  }

  const h = hfix(rnd(360))

  const p2 = {
    primary: color(hfix(h+20), 50, 80),
    secondary: color(hfix(h+60), 40, 80),
    tertiary: color(hfix(h+90), 40, 80),
    quarternary: color(hfix(h+180), 40, 80),
    street: color(hfix(h+240), 40, 80),
    bg1: color(bg1Hue, 35, 20),
    bg2: color(bg2Hue, 20, 20),
    circle: color(255),
    cloudBg1: color(
      hfix(bg1Hue+120),
      COLOR_SCHEME === 2 ? 0 : 70,
      COLOR_SCHEME === 2 ? 0 : 30,
    ),
    cloudBg2: color(
      hfix(bg1Hue+300),
      COLOR_SCHEME === 2 ? 0 : 70,
      COLOR_SCHEME === 2 ? 0 : 30,
    ),
  }


  const bgh = hfix(rnd(360))
  const dark = color(hfix(bgh+180), 30, 15)
  const p3CloudBg1 = color(
    hfix(bg1Hue+120),
    COLOR_SCHEME === 2 ? 0 : 55,
    COLOR_SCHEME === 2 ? 80 : 95,
  )
  const p3CloudBg2 = color(
    hfix(bg1Hue+300),
    COLOR_SCHEME === 2 ? 0 : 55,
    COLOR_SCHEME === 2 ? 80 : 95,
  )
  const p3InvertCloud = rnd() < 0.5
  const p3 = {
    primary: dark,
    secondary: dark,
    tertiary: dark,
    quarternary: dark,
    street: dark,
    bg1: color(bg1Hue, 55, 95), // looks good at (344, 90, 100) with dark blue strokes
    bg2: color(hfix(bg1Hue+rnd(-20, 20)), 50, 95),
    circle: dark,
    cloudBg1: p3CloudBg1,
    cloudBg2: p3CloudBg1,
    cloud1Street: p3InvertCloud ? inverseColor(p3CloudBg1) : dark,
    cloud2Street: p3InvertCloud ? inverseColor(p3CloudBg2) : dark,
    cloud1Circle: p3InvertCloud ? inverseColor(p3CloudBg1) : dark,
    cloud2Circle: p3InvertCloud ? inverseColor(p3CloudBg2) : dark,
  }

  const output = rnd()
  console.log('OUTPUT', output)
  return output < 0.5 ? p2 : p3
}

const inverseColor = c => color(
  hfix(hue(c) + 180),
  saturation(c),
  saturation(c) > 0 ? brightness(c) : 0
)



const distFromNoiseShapeCenter = (x, y, z, angle, maxR, noiseDivisor=1) => {
  const [rx, ry] = getXYRotation(angle, 1, x + 1000, y + 1000)
  return noise(rx/noiseDivisor, ry/noiseDivisor, z/noiseDivisor) * maxR
}

const noiseXY = (cx, cy, z, maxR, noiseDivisor=1) => (progress) => {
  const angle = progress*TWO_PI
  const r = distFromNoiseShapeCenter(cx, cy, z, angle, maxR, noiseDivisor)
  return getXYRotation(angle, r, cx, cy)
}


function generateNoiseCoords(x, y, r) {
  const points = 250
  const pointFn = noiseXY(x, y, 1, r)
  return {
    x, y, r,
    coords: [...times(points, p => pointFn(p/points)), pointFn(1)]
  }
}



function drawCoords(coords, noiseCoordList, dotFn) {
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
      const cloudOverlaps = countCloudOverlaps(x0, y0, noiseCoordList)

      if (cloudOverlaps === 1 && C.cloud1Circle) {
        fill(C.cloud1Circle)
      } else if (cloudOverlaps === 2 && C.cloud2Circle) {
        fill(C.cloud2Circle)
      } else {
        fill(C.circle)
      }
      noStroke()
      circle(x0, y0, 8)

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
    dotFn(x, y, i/d);

    ([x, y] = getXYRotation(angle, 1, x, y))
  }
}


const lineStats = (x1, y1, x2, y2) => ({
  d: dist(x1, y1, x2, y2),
  angle: atan2(x2 - x1, y2 - y1)
})



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



function countCloudOverlaps(x, y, noiseCoordList) {
  return noiseCoordList.reduce((sum, nc) => inCloud({ x, y }, nc) ? sum + 1 : sum, 0)
}


function inCloud(p, polygon) {
  const { d, angle } = lineStats(polygon.x, polygon.y, p.x, p.y)
  return d < distFromNoiseShapeCenter(polygon.x, polygon.y, 1, angle, polygon.r)
}

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