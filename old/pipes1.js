// start with square land

// bodies of water (polygon)

// rivers (thick lines)

// greenery (polygon)
  // small & larger interspersed throughout

// submaps (polygon)
  // these overlap with one another and take precidence

//



// Polygon types
  // polygon shifts random angle of roads entering it
  // polygon shifts to perpendicular angle
  // polygon stops roads entering them
    // have road on border of polygon
    // have grid internal to polygon



// color pallet: https://www.reddit.com/gallery/q958if






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
  background(c[3])
  stroke(0)
  strokeWeight(2)


  const polygons = times(6, p => ({
    angleAdj: random(QUARTER_PI/2, QUARTER_PI),
    points: genPolygon(4)
  }))



  // fill(c[2])
  // strokeWeight(0)
  // polygons.forEach(polygon => {
  //   beginShape()
  //   polygon.points.forEach(([x, y], i) => {
  //     // const nextLine = polygon.points[(i+1)%polygon.points.length]
  //     vertex(x, y)
  //   })
  //   endShape()
  // })

  const yBlockSize = rnd(20, 80)
  const xBlockSize = yBlockSize * (rnd() < 0.5 ? rnd(0.25, 0.6) : rnd(1.7, 2.5))




  const drawGrid = (s) => {

    for (let _x = width; _x > 0; _x -= xBlockSize) {

      let x = _x
      let y = height
      let originalAngle = -HALF_PI

      let q = 0
noFill()
      // beginShape()
      while (x >= 0 && y >= 0 && x <= width && y <= height) {
        const firstMatchingPolygon = polygons.find(poly => inPolygon([x, y], poly.points))

        const angle = originalAngle + (firstMatchingPolygon?.angleAdj||0)
        const newX = x + cos(angle) * yBlockSize
        const newY = y + sin(angle) * yBlockSize
        // curveVertex(x, y)

        dotLine(x, y, newX, newY, s)


        x = newX
        y = newY
        q++
        if (q > 100000) return console.log('oops')
      }
      endShape()
    }
    for (let _y = height; _y > 0; _y -= yBlockSize) {
// beginShape()

      let x = width
      let y = _y
      let originalAngle = PI

      let q = 0

      while (x >= 0 && y >= 0 && x <= width && y <= height) {
        const firstMatchingPolygon = polygons.find(poly => inPolygon([x, y], poly.points))

        const angle = originalAngle + (firstMatchingPolygon?.angleAdj||0)
        const newX = x + cos(angle) * yBlockSize
        const newY = y + sin(angle) * yBlockSize

        dotLine(x, y, newX, newY, s)
        // curveVertex(x, y, )


        x = newX
        y = newY
        q++
        if (q > 100000) return console.log('oops')
      }
// endShape()
    }




    for (let _x = 0; _x < width; _x += xBlockSize) {

      let x = _x
      let y = 0
      let originalAngle = HALF_PI

      let q = 0

      while (x >= 0 && y >= 0 && x <= width && y <= height) {
        const firstMatchingPolygon = polygons.find(poly => inPolygon([x, y], poly.points))

        const angle = originalAngle + (firstMatchingPolygon?.angleAdj||0)
        const newX = x + cos(angle) * yBlockSize
        const newY = y + sin(angle) * yBlockSize

        dotLine(x, y, newX, newY, s)


        x = newX
        y = newY
        q++
        if (q > 100000) return console.log('oops')
      }
    }

    for (let _y = 0; _y < height; _y += yBlockSize) {

      let x = 0
      let y = _y
      let originalAngle = 0

      let q = 0

      while (x >= 0 && y >= 0 && x <= width && y <= height) {
        const firstMatchingPolygon = polygons.find(poly => inPolygon([x, y], poly.points))

        const angle = originalAngle + (firstMatchingPolygon?.angleAdj||0)
        const newX = x + cos(angle) * yBlockSize
        const newY = y + sin(angle) * yBlockSize

        dotLine(x, y, newX, newY, s)


        x = newX
        y = newY
        q++
        if (q > 100000) return console.log('oops')
      }
    }
  }


  strokeWeight(4)
  stroke(c[12])
  drawGrid(5)

  strokeWeight(2)
  stroke(c[6])
  drawGrid(2)

  translate(3,3)

  strokeWeight(4)
  stroke(c[11])
  drawGrid(5)

  strokeWeight(2)
  stroke(c[5])
  drawGrid(2)

  translate(3,3)

  strokeWeight(4)
  stroke(c[10])
  drawGrid(5)

  strokeWeight(2)
  stroke(c[4])
  drawGrid(2)

  translate(3,3)

  strokeWeight(4)
  stroke(c[9])
  drawGrid(5)

  strokeWeight(2)
  stroke(c[8])
  drawGrid(2)

  translate(3,3)

  strokeWeight(4)
  stroke(c[9])
  drawGrid(5)

  strokeWeight(2)
  stroke(c[7])
  drawGrid(2)




  // strokeWeight(10)


  // times(5000, i => {
  //   const p = [random(0, width), random(0, height)]
  //   if (
  //     polygons.some(poly => inPolygon(p, poly.points))
  //   ) stroke('red')
  //   else stroke('black')

  //   point(...p)
  // })
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



function dotLine(x1, y1, x2, y2, s) {
  return line (x1, y1, x2, y2)
  const d = dist(x1, y1, x2, y2)
  const angle = atan2(x2 - x1, y2 - y1)

  let x = x1
  let y = y1
  for (let i = 0; i <= d; i++) {
    strokeWeight(rnd(s, s*1.2))
    point(x, y);

    ([x, y] = getXYRotation(angle, 1, x, y))
  }
}



function genPolygon(sides=4) {
  const x1 = rnd(0, width)
  const y1 = rnd(0, height)

  const polygon = [[x1, y1]]
  times(sides-1, (i) => {
    const _x = polygon[i][0]
    const _y = polygon[i][1]

    const x = rnd(-width, width)
    const y = rnd(-height, height)
    polygon.push([x, y])
  })
  return polygon
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

function drawCircle (points, getXY) {
  beginShape()
  curveVertex(...getXY(-1))
  for (let p = 0; p <= points + 1; p++) {
    curveVertex(...getXY(p))
  }
  endShape()
}


const getXYRotation = (deg, radius, cx=0, cy=0, rotation=0) => {
  return [
    sin(deg) * radius + cx ,
    cos(deg) * radius + cy ,
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
