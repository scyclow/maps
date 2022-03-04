
const Q_PI = Math.PI/4
const NEG_Q_PI = -Math.PI/4


function drawBackground() {
  push()
  background(LAYERS[0].colors.bg)

  const strokeSize = 2/SCALE


  for (let y = T-50; y < B+50; y += strokeSize) {
    for (let x = L-50; x < R+50; x += strokeSize) {
      const layer = findActiveLayer(x, y)
      drawBackgroundStroke(x, y, layer, strokeSize, LAYERS)
    }
  }
  pop()
}

function drawBackgroundStroke(x, y, layer, strokeSize, layers) {
  const baseLayer = layers[0]
  // increase/decrease rnd hue/sat for graininess
  const colorMismatch = (
    (layer.isColor && baseLayer.isDark) ||
    (baseLayer.isColor && layer.isDark)
  )

  const colorMismatchIffy = (baseLayer.isLight && layer.isDark)

  const largeLayer = (layer.ix === 0 || layer.ix === layers.length - 1)

  const strokeMultiplier =
    largeLayer && colorMismatch ? 1.25/SCALE :
    largeLayer && colorMismatchIffy ? 1.15 :
    colorMismatchIffy || colorMismatch ? 1.1 :
    1

  let diam = rnd(strokeSize, strokeSize*2) * strokeMultiplier
  let offset = strokeSize/2

  strokeWeight(diam/3.5)

  let hAdj = 0
  let sAdj = 0
  let bAdj = 0
  if (layer.gradient) {
    const d =
      dist(x, y, layer.gradient.focalPoint.x, layer.gradient.focalPoint.y)
      / dist(L, B, R, T)

    hAdj = map(d, 0, 1, 0, layer.gradient.hue)
    sAdj = map(d, 0, 1, 0, layer.gradient.sat)
    bAdj = map(d, 0, 1, 0, layer.gradient.brt)

  }

  stroke(
    hfix(hue(layer.colors.bg) + rnd(-3, 3) + hAdj),
    saturation(layer.colors.bg) + rnd(-5, 5) + sAdj,
    brightness(layer.colors.bg) + rnd(-10, 0) + bAdj,
  )
  const angle = noise(x+W, y+H)

  const [x0, y0] = getXYRotation(PI+angle+rnd(NEG_Q_PI, Q_PI), 5, x, y)
  const [x1, y1] = getXYRotation(angle+rnd(NEG_Q_PI, Q_PI), 5, x, y)

  line(x0, y0, x1, y1)
}









// function drawBackground() {
//   const adjustedDotSize = 2/SCALE


//   for (let x = L; x < W; x += adjustedDotSize) {
//     for (let y = T; y < H; y += adjustedDotSize) {
//       const activeLayer = findActiveLayer(x, y)
//       let bgC
//       let diam = rnd(adjustedDotSize, adjustedDotSize*2)
//       let offset = adjustedDotSize/2
//       if (activeLayer === 1) {
//         bgC = C.layer1.bg
//         if (layer1Dark) {
//           diam *= 1.5
//         }
//       } else if (activeLayer >= 2) {
//         bgC = C.layer2.bg
//         if (layer2Dark) {
//           diam *= 1.5
//         }
//       } else {
//         bgC = C.base.bg
//         offset *= 3
//       }
//       // fill(
//       //   hue(bgC),
//       //   saturation(bgC),
//       //   brightness(bgC) + rnd(-10, 0),
//       // )


//       // circle(x+rnd(-offset, offset), y+rnd(-offset, offset), diam)

//       const adj = dist(x, y, FOCAL_POINT.x, FOCAL_POINT.y)/dist(L, BOTTOM, FOCAL_POINT.x, FOCAL_POINT.y)

//       strokeWeight(diam/3.5)
//       stroke(
//         hfix(hue(bgC) + map(adj, 0, 1, 0, HUE_SHIFT)),
//         saturation(bgC) * map(adj, 0, 1, SAT_SHIFT, 1),
//         (brightness(bgC) + rnd(-10, 0)) * map(adj, 0, 1, BRT_SHIFT, 1),
//       )
//       const angle = noise(x, y)
//       const [x0, y0] = getXYRotation(PI+angle+rnd(-HALF_PI/2, HALF_PI/2), 5, x, y)
//       const [x1, y1] = getXYRotation(angle+rnd(-HALF_PI/2, HALF_PI/2), 5, x, y)
//       line(x0, y0, x1, y1)
//     }
//   }
// }
