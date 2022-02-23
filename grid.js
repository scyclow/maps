function drawGrid() {
  TURBULENCE = rnd() < 0.85



  MIN_ST_W = 0.8
  MAX_ST_W = 1.2

  const t = TURBULENCE ? 0.5 : 1.75 // 0.5
  const d = TURBULENCE ? 0 : 1.25

  fill(0)
  stroke(0)

  const setC = (x, y, c) => {
    stroke(c)
    fill(c)
  }

  const gridStep = rnd(5, 80)

  for (let x=L; x<W; x+=rnd(5, 80)) {
    dotLine(x, T, x, B, (x, y, prg, angle) => {
      const _x = x+rnd(-t, t)
      const _y = y+rnd(-t, t)
      const layer = findActiveLayer(_x, _y)
      if (layer.hideStreets) return

      setC(_x, _y, layer.colors.primary)

      circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)
    })
  }

  for (let y=T; y<H; y+=rnd(5, 80)) {
    dotLine(L, y, R, y, (x, y, prg, angle) => {
      const _x = x+rnd(-t, t)
      const _y = y+rnd(-t, t)
      const layer = findActiveLayer(_x, _y)

      if (layer.hideStreets) return

      setC(_x, _y, layer.colors.primary)

      circle(_x, _y, rnd(2*MIN_ST_W, 2*MAX_ST_W) + d)
    })
  }
}