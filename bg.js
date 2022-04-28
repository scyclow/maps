function drawBackground(t, b, l, r) {
  push()
  const baseLayer = LAYERS[0]
  background(baseLayer.colors.bg)

  const outsideBorders = createBorderFn(BORDER_PADDING)
  const baseStrokeSize = 2/SCALE

  const strokeParams = LAYERS.map((layer, ix) => {
    const colorOnDark = layer.isColor && baseLayer.isDark
    const lightOnDark = layer.isLight && baseLayer.isDark
    const darkOnColor = baseLayer.isColor && layer.isDark
    const colorMismatch = colorOnDark || darkOnColor

    const darkOnLight = (baseLayer.isLight && layer.isDark)
    const largeLayer = (ix === 0 || ix === LAYERS.length - 1)

    return {
      potentialMismatch: colorMismatch || darkOnLight,
      multiplier: (
        largeLayer && layer.gradient ? map(SCALE, 0.2, 1.2, 2.6, 1.5) :
        largeLayer && darkOnColor ? max(1, 1.1/SCALE) :
        largeLayer && colorOnDark ? max(1, 0.75/SCALE) :
        largeLayer && darkOnLight ? max(1, 1.5/SCALE) :
        colorMismatch ? max(1, 1/SCALE) :
        darkOnLight ? max(1, 0.7/SCALE) :
        lightOnDark ? max(1, 0.7/SCALE) :
        1
      )
    }
  })

  const buffer = 5/SCALE
  for (let y = t-buffer; y < b+buffer; y += baseStrokeSize) {
    let strokeSize = baseStrokeSize
    for (let x = l-buffer; x < r+buffer; x += strokeSize) {
      const layer = !BORDER_BLEED && BORDER_PADDING > 0 && outsideBorders(x, y)
        ? LAYERS[0]
        : findActiveLayer(x, y)
      strokeSize = baseStrokeSize/strokeParams[layer.ix].multiplier
      drawBackgroundStroke(x, y, layer, strokeSize, strokeParams[layer.ix])
    }
  }
  pop()
}

function drawBackgroundStroke(x, y, layer, strokeSize, strokeParams) {
  if (LOW_INK && prb(0.5)) return
  const diam = rnd(strokeSize, strokeSize*2) * strokeParams.multiplier/3.5
  const offset = strokeParams.multiplier > 1 ? diam*2 : 0
  const e = getElevation(x, y)

  strokeWeight(diam)

  let hAdj = 0
  let sAdj = 0
  let bAdj = 0
  if (layer.gradient) {

    const d = layer.gradient.useElevation
      ? e * 10
      : dist(x, y, layer.gradient.focalPoint.x, layer.gradient.focalPoint.y)
        / dist(L, B, R, T)

    hAdj = map(d, 0, 1, 0, layer.gradient.hue)
    sAdj = map(d, 0, 1, 0, layer.gradient.sat)
    bAdj = map(d, 0, 1, 0, layer.gradient.brt)
  }


  const { bShadow, sShadow } = getShadow(x, y, e, layer)


  const hGrain = GRAIN * 45 + 3
  const sGrain = GRAIN * 10 + 5
  const bGrain = GRAIN * 5 * (strokeParams.potentialMismatch ? 0 : 1)
  stroke(
    adjColor(
      hfix(hue(layer.colors.bg) + hAdj + rnd(-hGrain, hGrain)),
      saturation(layer.colors.bg) + sAdj + rnd(-sGrain, sGrain) + sShadow,
      brightness(layer.colors.bg) + bAdj + rnd(-10 - bGrain, 0) - bShadow,
    )
  )
  const angle = noise(x+NOISE_OFFSET, y+NOISE_OFFSET)

  const [x0, y0] = getXYRotation(
    PI + angle + rnd(-QUARTER_PI, QUARTER_PI),
    5,
    x + rnd(-offset, offset+SMUDGE),
    y + rnd(-offset, offset)
  )
  const [x1, y1] = getXYRotation(
    angle + rnd(-QUARTER_PI, QUARTER_PI),
    5,
    x,
    y
  )

  line(x0, y0, x1, y1)
}

function getShadow(x, y, e, layer) {
  const shadow = max(
    0,
    getElevation(x+SHADOW_X, y+SHADOW_Y) - e,
  ) * SHADOW_MAGNITUDE * (NOISE_DIVISOR*SCALE)/300

  const l = map(luminance(layer.colors.bg), 0, 255, 0.5, 1)
  const g = layer.gradient ? min(abs(layer.gradient.hue)/50, 1)*4 : 1
  let bShadow = 0, sShadow = 0
  if (layer.isDark) {
    bShadow = shadow * 500
    sShadow = shadow * 500

  } else if (layer.isColor) {
    magnitude = g * 150 * l
    bShadow = shadow * magnitude
    sShadow = shadow * magnitude * (layer.gradient ? 4 : 2)

  } else if (layer.isLight) {
    bShadow = shadow*100*g
    sShadow = shadow*100*g
  }

  return { sShadow, bShadow }
}