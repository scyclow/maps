// BOILERPLATE

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}

let ellapsed = 0
function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
  noiseSeed(int(rnd(10000000000000000)))

  HUE = int(rnd(0,360))
  DARK_C = color(HUE, 26, 25)
  LIGHT_C = color(hfix(HUE+288), 6, 91)

  PRIMARY_C = color(hfix(HUE+70), 56, 95)

  ACCENT1_C = color(hfix(HUE+40), 100, 75)
  ACCENT1_L_C = color(hfix(HUE+70), 85, 95)
  ACCENT1_D_C = color(hfix(HUE+35), 65, 25)

  ACCENT2_C = color(hfix(HUE+215), 100, 65)
  ACCENT2_L_C = color(hfix(HUE+250), 75, 80)
  ACCENT2_D_C = color(hfix(HUE+210), 100, 45)

  NOISE_LEVEL = 1800

  const angle = rnd(1, 3)
  GEN_ANGLE = () => rnd() < 0.5 ? angle : 1
  L_ANGLE = GEN_ANGLE()
  L_ANGLE_RND = rnd() < 0.1
  R_ANGLE = GEN_ANGLE()
  R_ANGLE_RND = rnd() < 0.1


}

const BUFFER = 400


function draw() {
  ellapsed++
  // resetRandomSeed()
  noLoop()
  noFill()
  translate(width/2, height/2)

  // scale(rnd(0.2, 5))
  // translate(rnd(-500,500), rnd(-500,500))

  colorMode(HSB, 360, 100, 100, 100)


  background(0)

  // stroke(ACCENT2_C)
  // drawTree(0, height/2, PI, 20, 0, 8)
  // stroke(ACCENT1_C)
  // drawTree(0, height/2, PI, 20, 0, 8)


  // stroke(color(hfix(HUE-20), 56, 65))
  // drawTree(0, height/2, PI, 20, 0, 4)
  // times(3, i => {
  //   stroke(color(hfix(HUE+170+10*i), 56-(5*i), 85-(7*i), 50))
  //   drawTree(0, height/2, PI, 20, 0, 6-i)
  // })

  // stroke(color(hfix(HUE+70), 56, 95))
  stroke(255)
  // drawTree(0, height/2, PI, 20, 0, 6)



  // generateGrid()


  // const blockHeight = 10

  // // avenues pop off both sides
  // const boulevards = [[]]
  // // streets pop off one side
  // const avenues = []

  // const mainBoulevard = boulevards[0]
  // let x = 0
  // let y = height/2
  // const angle = PI
  // for (let i = height/2; i > -height/2; i -= blockHeight) {
  //   mainBoulevard.push([x, y])
  //   ;([x, y] = getXYRotation(angle, blockHeight, x, y))
  // }

  drawGrid()
}













function drawGrid() {

  noFill()
  const startX = 0
  const startY = (height/2) + BUFFER
  const noiseDivisor = 200
  const blockHeight = 20
  const angleDivisor = 3

  const avenueCoords = generateStreetCoords(startX, startY, PI, blockHeight, angleDivisor, noiseDivisor)



  const streetCoordsList = []

  avenueCoords.forEach(coord => {
    streetCoordsList.push(generateStreetCoords(coord[0], coord[1], HALF_PI*1.5, blockHeight, angleDivisor, noiseDivisor))
    streetCoordsList.push(generateStreetCoords(coord[0], coord[1], HALF_PI+PI, blockHeight, angleDivisor, noiseDivisor))
  })

  const branchCoordList = []
  streetCoordsList.forEach(street => {
    street.forEach(coord => {

      branchCoordList.push(generateStreetCoords(coord[0], coord[1], PI, blockHeight, angleDivisor, noiseDivisor, 1))
      branchCoordList.push(generateStreetCoords(coord[0], coord[1], 0, blockHeight, angleDivisor, noiseDivisor, 1))
    })
  })


  strokeWeight(5)
  beginShape()
  avenueCoords.forEach(coord => {
    vertex(coord[0], coord[1])
  })
  endShape()


  strokeWeight(3)
  streetCoordsList.forEach(streetCoords => {
    beginShape()
    streetCoords.forEach(coord => {
      vertex(coord[0], coord[1])
    })
    endShape()
  })


  strokeWeight(1)
  branchCoordList.forEach((branchCoords, i) => {
    beginShape()
    branchCoords.forEach((coord, j) => {
      // circle(coord[0], coord[1], 5)
      vertex(coord[0], coord[1])
    })
    endShape()
  })
}



function generateStreetCoords(startX, startY, startAngle, blockHeight, angleDivisor, noiseDivisor, limit=10000) {
  const coords = [[startX, startY]]
  let x = startX
  let y = startY
  let angle = startAngle
  let i = 0

  while (
    y <= height/2 + BUFFER
    && y >= -height/2 - BUFFER
    && x <= width/2 + BUFFER
    && x >= -width/2 - BUFFER
    && i<limit
  ) {
    const _angle = map(
      noise(x/noiseDivisor, y/noiseDivisor),
      0,
      1,
      angle - HALF_PI/angleDivisor,
      angle + HALF_PI/angleDivisor,
    )
    const [nextX, nextY] = getXYRotation(_angle, blockHeight, x, y)
    coords.push([nextX, nextY])
    x = nextX
    y = nextY
    i++
  }
  return coords
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








// UTILS

function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    sin(deg) * radius + cx,
    cos(deg) * radius + cy,
  ]
}



function times(t, fn) {
  for (let i = 0; i < t; i++) fn(i)
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