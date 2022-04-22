function drawBorder() {
  if (HARD_BORDER) {
    const space =
      BORDER_PADDING < 50
        ? rnd(1.7, 2.1)
        : rnd(1.98, 2.02)



    dotRect(X_OFF, Y_OFF, W-(BORDER_PADDING*space), H-(BORDER_PADDING*space), (x, y) => {
      const layer = BORDER_BLEED ? findActiveLayer(x, y, true) : LAYERS[0]

      if (layer.hideStreets || hideStreetsOverride(layer.ix)) return

      setC(x+X_OFF, y+Y_OFF, layer.colors.circle, layer.gradient)
      circle(x, y, nsrnd(x, y, BORDER_THICKNESS/SCALE, BORDER_THICKNESS*2.5/SCALE))
    })



  }
}