function drawGrid() {
  TURBULENCE = rnd() < 0.85 ? 0.5 : 3 // 0.5
  MIN_ST_W = 0.8
  MAX_ST_W = 1.2

  fill(0)
  for (let x=L; x<W; x+=30) {
    dotLine(x, T, x, B, (x, y, prg, angle) => {
      circle(x+rnd(-TURBULENCE, TURBULENCE), y+rnd(-TURBULENCE, TURBULENCE), rnd(2*MIN_ST_W, 2*MAX_ST_W))
    })
  }
}