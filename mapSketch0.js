// BOILERPLATE

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'numisma-' + Date.now(), 'png');
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


function draw() {
  ellapsed++
  resetRandomSeed()
  // noLoop()
  noFill()
  translate(width/2, height/2)

  // scale(rnd(0.2, 5))
  // translate(rnd(-500,500), rnd(-500,500))

  colorMode(HSB, 360, 100, 100, 100)


  background(DARK_C)

  // stroke(ACCENT2_C)
  // drawTree(0, height/2, PI, 20, 0, 8)
  // stroke(ACCENT1_C)
  // drawTree(0, height/2, PI, 20, 0, 8)


  // stroke(color(hfix(HUE-20), 56, 65))
  // drawTree(0, height/2, PI, 20, 0, 4)
  times(3, i => {
    stroke(color(hfix(HUE+170+10*i), 56-(5*i), 85-(7*i), 50))
    drawTree(0, height/2, PI, 20, 0, 6-i)
  })

  stroke(color(hfix(HUE+70), 56, 95))
  drawTree(0, height/2, PI, 20, 0, 6)


}




function drawTree(x, y, angle, points, stack=0, strokeW=5) {
  const trees = []
  strokeWeight(strokeW)

  drawShape(points, {
    drawFn:  curveVertexFn,
    xyFn: createVineFunction(x, y, points, ((height*rnd(0.7, 1))/(stack+1))/points, angle),
    eachFn([x, y], p) {

      if (stack > 1) return
      const l = rnd()
      const r = rnd()

      if (l > 0.75) {
        trees.push([x, y, angle-HALF_PI/(L_ANGLE_RND ? GEN_ANGLE() : L_ANGLE), points, stack+1, strokeW*0.66])
        // drawTree(x, y, angle-HALF_PI/2, points, stack+1)
      }
      if (r > 0.75) {
        trees.push([x, y, angle+HALF_PI/(R_ANGLE_RND ? GEN_ANGLE() : R_ANGLE), points, stack+1, strokeW*0.66])
        // drawTree(x, y, angle+HALF_PI/2, points, stack+1)
      }
    },
    beforeFn(drawFn, xyFn, points) {
      beginShape()
    },
    afterFn(drawFn, xyFn, points) {
      endShape()
    },
  })

  trees.forEach((args) => drawTree(...args))
}


function createVineFunction(x, y, points, distance, rotation) {
  const coords = [
    [x, y]
  ]

  let [_x, _y] = [x, y]
  times(points, p => {
    ([_x, _y] = getXYRotation(
      rotation + noise(_x/(NOISE_LEVEL), _y/(NOISE_LEVEL), ellapsed/500)*HALF_PI - HALF_PI/2,
      distance,
      _x,
      _y
    ))

    coords.push([_x, _y])
  })
  return (progress, p) => {
    return coords[p]
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