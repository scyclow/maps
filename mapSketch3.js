// BOILERPLATE

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}




const BUFFER = 700
const SCALE = 1
let LEFT, RIGHT, TOP, BOTTOM
function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
  noiseSeed(int(rnd(10000000000000000)))

  LEFT = -width/(2*SCALE)
  RIGHT = width/(2*SCALE)
  TOP = -height/(2*SCALE)
  BOTTOM = height/(2*SCALE)


}

function draw() {

  noLoop()
  noStroke()
  translate(width/2, height/2)

  // scale(rnd(0.2, 5))
  // translate(rnd(-500,500), rnd(-500,500))

  colorMode(HSB, 360, 100, 100, 100)


  background(0)



  fill(40, 10, 90)
  scale(SCALE)

  // stroke('red')
  // fill('red')
  // rectMode(CENTER)
  // rect(0,0, width, height)

  const driftDenom = rnd() < 0.1 ? 2 : 100


  const START = Date.now()

  let primaryAveCoords

  const x = rnd()
  if (x < 0.25) {
    primaryAveCoords = generateStreetCoords(rnd(LEFT, RIGHT), BOTTOM, PI + rnd(-HALF_PI/4, HALF_PI/4))
  } else if (x < 0.5) {
    primaryAveCoords = generateStreetCoords(rnd(LEFT, RIGHT), TOP, 0 + rnd(-HALF_PI/4, HALF_PI/4))
  } else if (x < 0.75) {
    primaryAveCoords = generateStreetCoords(LEFT, rnd(TOP, BOTTOM), HALF_PI + rnd(-HALF_PI/4, HALF_PI/4))
  } else {
    primaryAveCoords = generateStreetCoords(RIGHT, rnd(TOP, BOTTOM), HALF_PI + PI + rnd(-HALF_PI/4, HALF_PI/4))

  }

  let pBranch = 0
  const secondaryAveCoords = primaryAveCoords.coords.map((coord) => {
    if (rnd() < 0.2) {
      const branch = pBranch++
      const direction = rnd() < 0.5 ? 1 : -1
      const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI
      return generateStreetCoords(coord.x, coord.y, coord.angle + angleAdj, { direction, branch })
    }
  }).filter(exists)


  const tertiaryAveCoords = secondaryAveCoords.flatMap((coords, i) => {
    let sBranch = 0
    return coords.coords.map(coord => {
      if (rnd() < 0.5) {

        const direction = rnd() < 0.5 ? 1 : -1
        const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI

        const tertiaryAveParams = {
          direction,
          driftAmt: HALF_PI/driftDenom,
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
    if (rnd() < 0.5) {
      const direction = rnd() < 0.5 ? 1 : -1
      const angleAdj = direction === -1 ? HALF_PI : PI+HALF_PI

      const quarternaryAveParams = {
        direction,
        driftAmt: HALF_PI/driftDenom,
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
      driftAmt: HALF_PI/driftDenom,
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


  const START_DRAW = Date.now()


  // strokeWeight(0)


  // stroke(25)
  // let xOffset = 215
  // let yOffset = 215
  // streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  // quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  // tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  // secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  // drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)


  // xOffset = -215
  // yOffset = -215
  // streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  // quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  // tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  // secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  // drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)

  // xOffset = 215
  // yOffset = -215
  // streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  // quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  // tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  // secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  // drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)

  // xOffset = -215
  // yOffset = 215
  // streetCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 1))
  // quarternaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 2))
  // tertiaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 4))
  // secondaryAveCoords.forEach(coords => drawCoordsLine(coords.coords, xOffset, yOffset, 6))
  // drawCoordsLine(primaryAveCoords.coords, xOffset, yOffset, 8)






  const noiseCoordList = times(0, i =>
    generateNoiseCoords(rnd(LEFT, RIGHT), rnd(TOP, BOTTOM), rnd(250, 500)),
  )


  const setNoiseColor = (x, y, c) => {
    const sum = noiseCoordList.reduce((sum, nc) => inPolygon([x, y], nc) ? sum + 1 : sum, 0)
    const h =
      sum === 0 ? hue(c) :
      sum === 1 ? hue(c) + 100 :
      sum === 2 ? hue(c) + 200 :
      hue(c) + 300

    const _color = color(hfix(h), saturation(c), brightness(c))
    fill(_color)
    stroke(_color)
  }


  // stroke(color(55, 40, 100))
  // noiseCoordList.forEach(nc => {
  //   nc.forEach((coord, ix) => {
  //     const [x0, y0] = coord
  //     const [x1, y1] = nc[ix+1] || coord

  //     dotLine(x0, y0, x1, y1, (x, y) => {
  //       circle(x, y, rnd(3*0.75, 3*1.2))
  //     })
  //   })
  // })



  noStroke()

  streetCoords.forEach(coords => drawCoords(coords.coords, (x, y, progress) => {
    // circle(x+rnd(0, 50), y+rnd(0, 50), rnd(1*0.75, 2*1.2))
    const isInPolygon = noiseCoordList.some(nc => inPolygon([x, y], nc))
    setNoiseColor(x, y, color(hfix(240), 30, 80))

    circle(x+rnd(-10, 10), y+rnd(-10, 10), rnd(1*0.75, 1*1.2))
  }))






  quarternaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const isInPolygon = noiseCoordList.some(nc => inPolygon([x, y], nc))
    setNoiseColor(x, y, color(hfix(180), 30, 80))


    circle(x, y, rnd(2*0.75, 2*1.2))
  }))




  tertiaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const isInPolygon = noiseCoordList.some(nc => inPolygon([x, y], nc))
    setNoiseColor(x, y, color(hfix(120), 30, 80))

    circle(x+rnd(-0.5, 0.5), y+rnd(-0.5, 0.5), rnd(2*0.75, 4*1.2))
  }))




  secondaryAveCoords.forEach(coords => drawCoords(coords.coords, (x, y) => {
    const isInPolygon = noiseCoordList.some(nc => inPolygon([x, y], nc))
    setNoiseColor(x, y, color(hfix(60), 30, 80))

    circle(x+rnd(-0.5, 0.5), y+rnd(-0.5, 0.5), rnd(6*0.75, 6*1.2))
  }))




  drawCoords(primaryAveCoords.coords, (x, y) => {
    const isInPolygon = noiseCoordList.some(nc => inPolygon([x, y], nc))
    setNoiseColor(x, y, color(hfix(0), 50, 80))

    circle(x+rnd(-0.5, 0.5), y+rnd(-0.5, 0.5), rnd(8*0.75, 8*1.2))
  })




  const END = Date.now()

  console.log('coords', START_DRAW - START)
  console.log('draw', END - START_DRAW)

}



const noiseXY = (cx, cy, z, maxR, noiseDivisor=1) => (progress) => {
  const angle = progress*TWO_PI
  const [rx, ry] = getXYRotation(angle, 1, cx + 1000, cy + 1000)
  const r = noise(rx/noiseDivisor, ry/noiseDivisor, z/noiseDivisor) * maxR
  return getXYRotation(angle, r, cx, cy)
}


function generateNoiseCoords(x, y, r) {
  const points = 250
  const pointFn = noiseXY(x, y, 1, r)
  return [...times(points, p => pointFn(p/points)), pointFn(1)]
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

    if (i === coords.length-1) {
      push()
      fill(255)
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
  const noiseDivisor = 5
  const blockHeight = 20
  const length = 75


  let x = startX
  let y = startY
  let angle = startAngle

  const coords = []

  for (let i=0; i<length; i++) {
    angle = map(
      noise(x/noiseDivisor, y/noiseDivisor),
      0,
      1,
      angle - driftAmt,
      angle + driftAmt,
    )
    const [nextX, nextY] = getXYRotation(angle, blockHeight, x, y)

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



















// SHAPE FNs

function drawShape(points, fns, offset=1, start=0, finish=1) {
  times(offset, o => {

    const _o = 2 * o / offset
    const adjustedPoints = int(points * (finish-start))

    fns.beforeFn(fns.drawFn, fns.xyFn, points, _o)
    times(
      points,
      p => {
        const xy = fns.xyFn(
          start + (p+_o)/(points/(finish-start)),
          p,
          points
        )

        fns.drawFn(
          xy,
          p,
          points
        )

        fns.eachFn(xy, p)
      }
    )
    fns.afterFn(fns.drawFn, fns.xyFn, points, _o)
  })
}

function pointFn([x, y]) {
  circle(x, y, 1)
}



function vertexFn([x, y]) {
  vertex(x, y)
}

function curveVertexFn([x, y]) {
  curveVertex(x, y)
}





function inPolygon(p, polygon) {
  const infLine = [width*2, height*2]
  const intersections = polygon.reduce((sum, l, i) => {
    const nextI = (i+1) % polygon.length
    const nextLine = polygon[nextI]

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