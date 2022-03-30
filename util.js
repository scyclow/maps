const setC = (x, y, c, g) => {

  if (g) {
    const d = g.useElevation
      ? getElevation(x, y) * 10
      : dist(x, y, g.focalPoint.x, g.focalPoint.y)
        / dist(L, B, R, T)

    const _c = color(
      hfix(hue(c) + map(d, 0, 1, 0, g.hue)),
      saturation(c) + map(d, 0, 1, 0, g.sat),
      brightness(c) + map(d, 0, 1, 0, g.brt),
    )
    stroke(_c)
    fill(_c)


  } else {
    stroke(c)
    fill(c)
  }
}

const noop = () => {}


function scaleModifier(mn, mx) {
  return map(
    max(0, 0.35 - SCALE),
    0,
    0.15,
    mn,
    mx
  )
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
}

const outsideBorders = (x, y) =>
  x < L + BORDER_PADDING ||
  x > R - BORDER_PADDING ||
  y < T + BORDER_PADDING ||
  y > B - BORDER_PADDING

function dotLine(x1, y1, x2, y2, dotFn, ignoreFn=noop) {
  const { d, angle } = lineStats(x1, y1, x2, y2)

  let x = x1
  let y = y1
  for (let i = 0; i <= d; i++) {
    if (ignoreFn(x, y)) return
    dotFn(x, y, i/d, angle);

    ([x, y] = getXYRotation(angle, 1, x, y))
  }
}

function dotRect(x, y, w, h, dotFn) {
  dotLine(x-w/2, y-h/2, x+w/2, y-h/2, dotFn)
  dotLine(x-w/2, y+h/2, x+w/2, y+h/2, dotFn)
  dotLine(x-w/2, y-h/2, x-w/2, y+h/2, dotFn)
  dotLine(x+w/2, y-h/2, x+w/2, y+h/2, dotFn)
}


function chance(...chances) {
  const total = chances.reduce((t, c) => t + c[0], 0)
  const seed = rnd()
  let sum = 0
  for (let i = 0; i < chances.length; i++) {
    sum += chances[i][0] / total
    if (seed <= sum) return chances[i][1]
  }
}

const lineStats = (x1, y1, x2, y2) => ({
  d: dist(x1, y1, x2, y2),
  angle: atan2(x2 - x1, y2 - y1)
})


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

const rndint = (mn, mx) => int(rnd(mn, mx))
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
const nsrnd = (x, y, mn, mx) => mn + noise(x/15, y/15) * (mx-mn) + rnd(-0.25, 0.25)


const posOrNeg = () => prb(0.5) ? 1 : -1

const sample = (a) => a[int(rnd(a.length))]
const exists = x => !!x
const last = a => a[a.length-1]
const hfix = h => ((h%360) + 360) % 360

const luminance = c => (299*red(c) + 587*green(c) + 114*blue(c))/1000
const contrast = (c1, c2) => (luminance(c1) - luminance(c2))/255
