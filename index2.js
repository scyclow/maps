function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'map-' + Date.now(), 'jpg');
  }
}

function setup() {
  const size = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(size, size)
  colorMode(HSB, 360, 100, 100, 100)
}

function draw() {
  const c = setColors('s', 100)
  noLoop()
  background(0)

  const x0 = rnd(0, width)
  const x1 = rnd(0, width)
  const y0 = rnd(0, height)
  const y1 = rnd(0, height)
  strokeWeight(0)
  const points = 500
  times(25, i => {
    fill(color(5, 10+i*2.5, 100-i))
    drawShape(
      points, {
        drawFn: vertexFn,
        xyFn: createNoiseShape(x0,y0, i/20, 300 - (i*10), 0.25),

        beforeFn(drawFn, xyFn, points) {
          beginShape()
          drawFn(xyFn(-1/points))
          drawFn(xyFn(-1/points))
          // drawFn(xyFn(-1/points))
        },

        afterFn(drawFn, xyFn, points) {
          // drawFn(xyFn(0/points))
          drawFn(xyFn(0/points))
          endShape()
        },
      },
    )

    drawShape(
      points, {
        drawFn: vertexFn,
        xyFn: createNoiseShape(x1,y1, i/20, 300 - (i*10), 0.25),

        beforeFn(drawFn, xyFn, points) {
          beginShape()
          drawFn(xyFn(-1/points))
          drawFn(xyFn(-1/points))
          // drawFn(xyFn(-1/points))
        },

        afterFn(drawFn, xyFn, points) {
          // drawFn(xyFn(0/points))
          drawFn(xyFn(0/points))
          endShape()
        },
      },
    )
  })

  noFill()
  strokeWeight(2)
  stroke(color('#00ff00'))
  drawShape(
    points, {
      drawFn: vertexFn,
      xyFn: createNoiseShape(x1,y1, 0, 200, 0.25),

      beforeFn(drawFn, xyFn, points) {
        beginShape()
        drawFn(xyFn(-1/points))
        drawFn(xyFn(-1/points))
        // drawFn(xyFn(-1/points))
      },

      afterFn(drawFn, xyFn, points) {
        // drawFn(xyFn(0/points))
        drawFn(xyFn(0/points))
        endShape()
      },
    },
  )

  drawShape(
    points, {
      drawFn: vertexFn,
      xyFn: createNoiseShape(x0,y0, 0, 300, 0.25),

      beforeFn(drawFn, xyFn, points) {
        beginShape()
        drawFn(xyFn(-1/points))
        drawFn(xyFn(-1/points))
        // drawFn(xyFn(-1/points))
      },

      afterFn(drawFn, xyFn, points) {
        // drawFn(xyFn(0/points))
        drawFn(xyFn(0/points))
        endShape()
      },
    },
  )

  strokeWeight(3)
  stroke(color(60, 60, 20))

  const createPolygon = createNoiseShape(x0,y0, 0, 300, 0.25)
  const createPolygon2 = createNoiseShape(x1,y1, 0, 200, 0.25)

  const an = rnd(QUARTER_PI/2, QUARTER_PI)
  const an2 = rnd(0, QUARTER_PI/2)
  const polygons = [
    {
      angleAdj: () => an*rnd(),
      // angleAdj: (x, y) => noise(x*10, y*10)*TWO_PI,
      points: times(100, p => createPolygon(p/100))
    },
    {
      angleAdj: () => an2*rnd(),
      // angleAdj: (x, y) => noise(x*10, y*10)*TWO_PI,
      points: times(100, p => createPolygon2(p/100))
    },

  ]

  const xBlockSize = int(rnd(10, 50))
  const yBlockSize = int(rnd(10, 50))

  drawGrid(xBlockSize, yBlockSize, polygons)

  strokeWeight(1)
  stroke(color(60, 40, 60))
  drawGrid(xBlockSize, yBlockSize, polygons)
}


function drawGrid(xBlockSize, yBlockSize, polygons) {
  for (let _x = width; _x > 0; _x -= xBlockSize) {

    let x = _x
    let y = height
    let originalAngle = -HALF_PI

    let q = 0
    while (x >= 0 && y >= 0 && x <= width && y <= height) {
      const firstMatchingPolygon = polygons.find(poly => inPolygon([x, y], poly.points))

      const angle = noise(x, y)/20 + originalAngle + (firstMatchingPolygon?.angleAdj?.(x, y)||0)
      const newX = x + cos(angle) * yBlockSize
      const newY = y + sin(angle) * yBlockSize

      line(x, y, newX, newY)

      x = newX
      y = newY
      q++
      if (q > 100000) return console.log('oops')
    }
  }

  for (let _y = height; _y > 0; _y -= yBlockSize) {

    let x = width
    let y = _y
    let originalAngle = PI

    let q = 0

    while (x >= 0 && y >= 0 && x <= width && y <= height) {
      const firstMatchingPolygon = polygons.find(poly => inPolygon([x, y], poly.points))

      const angle = noise(x, y)/20 + originalAngle + (firstMatchingPolygon?.angleAdj?.(x, y)||0)
      const newX = x + cos(angle) * yBlockSize
      const newY = y + sin(angle) * yBlockSize

      line(x, y, newX, newY)


      x = newX
      y = newY
      q++
      if (q > 100000) return console.log('oops')
    }

  }
}





function drawShape(points, fns, offset=1) {
  times(offset, o => {

    fns.beforeFn(fns.drawFn, fns.xyFn, points)
    times(
      points,
      p => fns.drawFn(
        fns.xyFn((p+(2*o/offset))/points, p, points), p, points
      )
    )
    fns.afterFn(fns.drawFn, fns.xyFn, points)
  })
}

function vertexFn([x, y]) {
  curveVertex(x, y)
}


function calcR(x, y, z, progress, exponent = 1) {
  const [_x, _y] = getXYRotation(progress*TWO_PI, 2, x+100, y+100)
  return noise(_x, _y, z) ** exponent
}

function createNoiseShape(x, y, z, baseRadius, exponent=1) {
  return progress => {
    const radius = baseRadius * calcR(x, y, z, progress, exponent)
    return getXYRotation(progress*TWO_PI, radius, x, y)
  }
}

function createNoiseShape2(x, y, z, baseRadius) {
  const noiseShape = createNoiseShape(x, y, z, baseRadius/2)
  return progress => {
    const [x0, y0] = noiseShape(progress)
    return createNoiseShape(x0, y0, z, baseRadius/2)(progress)

  }
}














function setColors(colorPalette="s",colorAlpha=20) {
  const light = [
    { c: color(0, 0, 100, colorAlpha), type: "l" }, // white
    { c: color(150, 55, 95, colorAlpha), type: "l" }, // lighter green
    { c: color(200, 55, 100, colorAlpha), type: "l" }, // sky blue
    { c: color(90, 7, 95, colorAlpha), type: "l" }, // yellow off-white
    { c: color(25, 9, 95, colorAlpha), type: "l" }, // rose red
    { c: color(130, 50, 85, colorAlpha), type: "l" }, // cool light green
  ]
  const med = [
    { c: color(0, 75, 100, colorAlpha), type: "m" }, // red
    { c: color(165, 80, 75, colorAlpha), type: "m" }, // cool green
    // { c: color(30, 45, 100, colorAlpha), type: "m" }, // light orange
    { c: color(285, 50, 35, colorAlpha), type: "m" }, // washed purple
  ]
  const dark = [
    { c: color(0, 0, 0, colorAlpha), type: "d" },
    { c: color(250, 72, 31, colorAlpha), type: "d" },
    { c: color(100, 92, 41, colorAlpha), type: "d" },
    { c: color(90, 7, 5, colorAlpha), type: "l" }, // yellow off-dark
  ]
  const o = [...light, ...med, ...dark]
  const s = [light[0].c, dark[0].c, color(0, 0, 5, colorAlpha)]
  const contrast = (c) => {
    if (c.type === 'l') return sample([...med, ...dark])
    if (c.type === 'm') return sample([...light, ...dark])
    else return sample([...light, ...med])
  }

  return o.map(x => x.c)
  // if ("set" === colorPalette) {
  //   const l = med[0].c
  //   const d = med[2].c
  //   c1 = l
  //   c2 = d
  //   c3 = l
  //   c4 = d
  //   c5 = dark[1].c
  // } else if ("bw" === colorPalette) {
  //   c1 = sample(s)
  //   c2 = sample(s, c1)
  //   c3 = sample(s)
  //   c4 = sample(s, c1)
  //   c5 = sample(s, c4)
  // } else {
  //   const light = sample(o)
  //   const med = sample(o);
  //   c1 = light.c
  //   c2 = contrast(light).c
  //   c3 = sample(o).c
  //   c4 = contrast(light).c
  //   c5 = med.c
  // }

}






function inPolygon(p, polygon) {
  const infLine = [p[0], height]
  const intersections = polygon.reduce((sum, line, i) => {
    const nextI = (i+1) % polygon.length
    const nextLine = polygon[nextI]

    return intersects(p, infLine, line, nextLine)
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
  return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1)

}


function times(i, fn) {
  const a = []
  for (let _i = 0; _i < i; _i++) {
    a.push(fn(_i))
  }
  return a
}

function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    sin(deg) * radius + cx,
    cos(deg) * radius + cy,
  ]
}

let __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16)

function rnd(mn, mx) {
  __randomSeed ^= __randomSeed << 13
  __randomSeed ^= __randomSeed >> 17
  __randomSeed ^= __randomSeed << 5
  const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

const prb = x => rnd() < x
const posOrNeg = () => prb(0.5) ? 1 : -1