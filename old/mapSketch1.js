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
  colorMode(HSB, 360, 100, 100, 100)



  const HUE = 6
  LINE_C = color(HUE, 87, 62)
  LINE_C_DARK = color(hfix(HUE - 5), 95, 45)

  // NOISE_LEVEL = 1800

  // const angle = rnd(1, 3)
  // GEN_ANGLE = () => rnd() < 0.5 ? angle : 1
  // L_ANGLE = GEN_ANGLE()
  // L_ANGLE_RND = rnd() < 0.1
  // R_ANGLE = GEN_ANGLE()
  // R_ANGLE_RND = rnd() < 0.1


}


function draw() {
  ellapsed++
  noLoop()
  noStroke()
  translate(width/2, height/2)


  for (let x=-width/2; x<width/2; x+=2)
  for (let y=-height/2; y<height/2; y+=2) {
    fill(
      45,
      30,
      map(
        noise((x+1000)/1000, (y+1000)/1000),
        0,
        1,
        50,
        90

      ),
    )
    circle(x, y, 3)
  }




  const allCoords = [
    generateCoords(rnd(-width/2, width/2), height/2, PI),
    generateCoords(-width/2, rnd(-height/2, height/2), HALF_PI),
    generateCoords(rnd(-width/2, width/2), -height/2, 0),
    generateCoords(width/2, rnd(-height/2, height/2), PI+HALF_PI),
    // generateCoords(rnd(-width/2, width/2), height/2, PI),
    // generateCoords(-width/2, rnd(-height/2, height/2), HALF_PI),
    // generateCoords(rnd(-width/2, width/2), -height/2, 0),
    // generateCoords(width/2, rnd(-height/2, height/2), PI+HALF_PI),
  ]


  // allCoords.forEach(coords => {
  //   coords.forEach(coord => {
  //     if (rnd() < 0.1) {
  //       allCoords.push(
  //         generateCoords(coord[0], coord[1], rnd(TWO_PI))
  //       )
  //     }
  //   })
  // })



  const lineNoiseValue = (x, y) => noise((x+20000)/100, (y+20000)/100)
  fill(
    hue(LINE_C),
    saturation(LINE_C),
    10
  )


  allCoords.forEach(coords => drawGrid3(coords, (x, y) => {
    circle(x, y, rnd(7, 9))
  }))


  allCoords.forEach(coords => drawGrid3(coords, (x, y) => {
    fill(
      hue(LINE_C) + map(lineNoiseValue(x, y), 0, 1, -10, 10),
      saturation(LINE_C),
      brightness(LINE_C) + map(lineNoiseValue(x, y), 0, 1, -10, 10)
    )
    circle(x, y, rnd(2.5, 6))
  }))

  allCoords.forEach(coords => drawGrid3(coords, (x, y) => {
    fill(
      hue(LINE_C) + map(lineNoiseValue(x, y), 0, 1, -15, 10),
      saturation(LINE_C),
      brightness(LINE_C) + map(lineNoiseValue(x, y), 0, 1, -30, 10)
    )
    circle(x+rnd(2), y+rnd(2), rnd(1, 4))
  }))

}

function drawGrid3(coords, dotFn) {
  coords.forEach((coord, i) => {

    if (i > 0) {
      const [x0, y0] = coord
      const [x1, y1] = coords[i-1]

      dotLine(x0, y0, x1, y1, dotFn)

    }
  })
}


function dotLine(x1, y1, x2, y2, dotFn) {
  // return line (x1, y1, x2, y2)
  const d = dist(x1, y1, x2, y2)
  const angle = atan2(x2 - x1, y2 - y1)

  let x = x1
  let y = y1
  for (let i = 0; i <= d; i++) {
    dotFn(x, y);

    ([x, y] = getXYRotation(angle, 1, x, y))
  }
}


function generateCoords(startX, startY, startAngle) {
  const noiseDivisor = 5
  // const blockHeight = 20
  // const coordsLength = 1000

  const blockHeight = 5
  const coordsLength = 4000

  const coords = []


  let x = startX
  let y = startY
  let angle = startAngle
  let i=0
  while (y <= height/2 && i < coordsLength) {
    angle = map(
      noise(x/noiseDivisor, y/noiseDivisor),
      0,
      1,
      angle - HALF_PI/2,
      angle + HALF_PI/2,
    )
    const [nextX, nextY] = getXYRotation(angle, blockHeight, x, y)
    coords.push([nextX, nextY])
    x = nextX
    y = nextY
    i++
  }



  return coords

}



// function drawGrid2(coords) {
//   coords.forEach((coord, i) => {
//     const [x, y] = coord
//     line(x, y, x-15, y-15)
//   })
// }


// function drawGrid1(coords, allCoords) {
//   beginShape()
//   coords.forEach((coord, i) => {
//     vertex(coord[0], coord[1])

//     if (i > 0) {
//       const c1 = coord
//       const c2 = coords[i-1]

//       allCoords.forEach(coordList => {
//         coordList.forEach((_coord, _i) => {
//           if (_i > 0) {
//             const c3 = _coord
//             const c4 = coordList[_i-1]
//             // debugger
//             const intersection = intersects(c1, c2, c3, c4)
//             if (intersection) {
//               circle(intersection[0], intersection[1], 6)
//             }
//           }
//         })
//       })

//     }
//   })
//   endShape()
// }




















// function generateGrid() {
//   const avenueCoords = [getAvenueCoords(0, height/2, PI)]
//   const streetCoords = []

//   outterLoop: for (let i=0; i< avenueCoords.length; i++) {
//     const ave = avenueCoords[i]

//     innerLoop: for (let j=0; j<ave.length; j++) {
//       const coord = ave[j]
//       if (rnd() < 0.05) {
//         avenueCoords.push(getAvenueCoords(coord[0], coord[1], rnd(HALF_PI, PI)))
//         break innerLoop
//       }
//     }
//   }

//   avenueCoords.forEach(ave => {
//     ave.forEach((coord, i) => {
//       if (i) {
//         line(
//           ave[i-1][0],
//           ave[i-1][1],
//           coord[0],
//           coord[1],
//         )
//       }
//     })
//   })
// }



// function getAvenueCoords(x, y, angle) {
//   let _x = x
//   let _y = y

//   const coords = [[x, y]]

//   for (let i = 0; i < 50; i++) {
//     ([_x, _y] = getXYRotation(
//       angle,
//       10,
//       _x,
//       _y
//     ))
//     coords.push([_x, _y])
//   }

//   return coords
// }












// function drawTree(x, y, angle, points, stack=0, strokeW=5) {
//   const trees = []
//   strokeWeight(strokeW)

//   drawShape(points, {
//     drawFn:  curveVertexFn,
//     xyFn: createVineFunction(x, y, points, ((height*rnd(0.7, 1))/(stack+1))/points, angle),
//     eachFn([x, y], p) {

//       if (stack > 1) return
//       const l = rnd()
//       const r = rnd()

//       if (l > 0.75) {
//         trees.push([x, y, angle-HALF_PI/(L_ANGLE_RND ? GEN_ANGLE() : L_ANGLE), points, stack+1, strokeW*0.66])
//         // drawTree(x, y, angle-HALF_PI/2, points, stack+1)
//       }
//       if (r > 0.75) {
//         trees.push([x, y, angle+HALF_PI/(R_ANGLE_RND ? GEN_ANGLE() : R_ANGLE), points, stack+1, strokeW*0.66])
//         // drawTree(x, y, angle+HALF_PI/2, points, stack+1)
//       }
//     },
//     beforeFn(drawFn, xyFn, points) {
//       beginShape()
//     },
//     afterFn(drawFn, xyFn, points) {
//       endShape()
//     },
//   })

//   trees.forEach((args) => drawTree(...args))
// }


// function createVineFunction(x, y, points, distance, rotation) {
//   const coords = [
//     [x, y]
//   ]

//   let [_x, _y] = [x, y]
//   times(points, p => {
//     ([_x, _y] = getXYRotation(
//       rotation + noise(_x/(NOISE_LEVEL), _y/(NOISE_LEVEL), ellapsed/500)*HALF_PI - HALF_PI/2,
//       distance,
//       _x,
//       _y
//     ))

//     coords.push([_x, _y])
//   })
//   return (progress, p) => {
//     return coords[p]
//   }
// }








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