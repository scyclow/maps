// BOILERPLATE

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}

let ellapsed = 0

let LEFT, RIGHT, TOP, BOTTOM
function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
  noiseSeed(int(rnd(10000000000000000)))

  LEFT = -width/2
  RIGHT = width/2
  TOP = -height/2
  BOTTOM = height/2


  const angle = rnd(1, 3)
  GEN_ANGLE = () => rnd() < 0.5 ? angle : 1
  L_ANGLE = GEN_ANGLE()
  L_ANGLE_RND = rnd() < 0.1
  R_ANGLE = GEN_ANGLE()
  R_ANGLE_RND = rnd() < 0.1


}

const BUFFER = 400


function draw() {

  // resetRandomSeed()
  noLoop()
  noStroke()
  translate(width/2, height/2)

  // scale(rnd(0.2, 5))
  // translate(rnd(-500,500), rnd(-500,500))

  colorMode(HSB, 360, 100, 100, 100)


  background(0)

  fill(40, 10, 90)
  scale(0.25)
  // scale(rnd(0.25, 1))

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

  const secondaryAveCoords = primaryAveCoords.map(coord => {
    if (rnd() < 0.2) {
      const direction = rnd() < 0.5 ? HALF_PI : PI+HALF_PI
      return generateStreetCoords(coord[0], coord[1], coord[2] + direction)
    }
  }).filter(exists)


  const tertiaryAveParams = {
    driftAmt: HALF_PI/driftDenom,
    stopAtIntersections: [
      primaryAveCoords,
      ...secondaryAveCoords,
    ]
  }
  const tertiaryAveCoords = secondaryAveCoords.flatMap(coords => coords.map(coord => {
    if (rnd() < 0.5) {
      const direction = rnd() < 0.5 ? HALF_PI : PI+HALF_PI
      return generateStreetCoords(coord[0], coord[1], coord[2] + direction, tertiaryAveParams)
    }
  }).filter(exists))

  const quarternaryAveParams = {
    driftAmt: HALF_PI/driftDenom,
    stopAtIntersections: [
      primaryAveCoords,
      ...secondaryAveCoords,
      ...tertiaryAveCoords
    ]
  }
  const quarternaryAveCoords = tertiaryAveCoords.flatMap(coords => coords.map(coord => {
    if (rnd() < 0.5) {
      const direction = rnd() < 0.5 ? HALF_PI : PI+HALF_PI
      return generateStreetCoords(coord[0], coord[1], coord[2] + direction, quarternaryAveParams)
    }
  }).filter(exists))

  const streetParams = {
    driftAmt: HALF_PI/driftDenom,
    stopAtIntersections: [
      primaryAveCoords,
      ...secondaryAveCoords,
      ...tertiaryAveCoords,
      ...quarternaryAveCoords
    ]
  }
  const streetCoords = secondaryAveCoords.flatMap(coords => coords.flatMap(coord => [
    generateStreetCoords(coord[0], coord[1], coord[2] + HALF_PI, streetParams),
    generateStreetCoords(coord[0], coord[1], coord[2] + HALF_PI + PI, streetParams),
  ]))


  const START_DRAW = Date.now()


  fill(0, 30, 80)
  drawCoords(primaryAveCoords, (x, y) => {
    circle(x+rnd(-0.5, 0.5), y+rnd(-0.5, 0.5), rnd(4*0.75, 5*1.2))
  })

  fill(60, 30, 80)
  secondaryAveCoords.forEach(coords => drawCoords(coords, (x, y) => {
    circle(x+rnd(-0.5, 0.5), y+rnd(-0.5, 0.5), rnd(3*0.75, 4*1.2))
  }))


  fill(120, 30, 80)
  tertiaryAveCoords.forEach(coords => drawCoords(coords, (x, y) => {
    circle(x+rnd(-0.5, 0.5), y+rnd(-0.5, 0.5), rnd(3*0.75, 4*1.2))
  }))

  fill(180, 30, 80)
  quarternaryAveCoords.forEach(coords => drawCoords(coords, (x, y) => {
    circle(x, y, rnd(3*0.75, 4*1.2))
  }))

  fill(240, 30, 80)
  streetCoords.forEach(coords => drawCoords(coords, (x, y, progress) => {
    // circle(x+rnd(0, 50), y+rnd(0, 50), rnd(1*0.75, 2*1.2))
    circle(x, y, rnd(1*0.75, 2*1.2))
  }))


  const END = Date.now()

  console.log('coords', START_DRAW - START)
  console.log('draw', END - START_DRAW)

}




function drawCoords(coords, dotFn) {
  coords.forEach((coord, i) => {

    if (i > 0) {
      const [x0, y0] = coord
      const [x1, y1] = coords[i-1]

      // strokeWeight(1)
      // stroke(255)
      // line(x0, y0, x1, y1)
      dotLine(x0, y0, x1, y1, dotFn)

    }
  })
}


function findIntersectionPoint(c1, c2, coordLists) {
  return coordLists.some(coordList => intersects(c1, c2, coordList[0], last(coordList)))
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
      const c1 = [x, y]
      const c2 = [nextX, nextY]
      const intersectionPoint = findIntersectionPoint(c1, c2, stopAtIntersections)
      if (intersectionPoint) {
        circle(x, y, 8)
        break
      }
    }


    x = nextX
    y = nextY
    coords.push([x, y, angle])
  }

  return coords
}


function dotLine(x1, y1, x2, y2, dotFn) {
  const d = dist(x1, y1, x2, y2)
  const angle = atan2(x2 - x1, y2 - y1)

  let x = x1
  let y = y1
  for (let i = 0; i <= d; i++) {
    dotFn(x, y, i/d);

    ([x, y] = getXYRotation(angle, 1, x, y))
  }
}




















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