const fs = require('fs')
const globals = [
  'Q_PI',
  'NEG_Q_PI',
  'LAYERS',
  'NOISE_OFFSET',
  'SIZE',
  'SCALE',
  'SCALE_ADJ',
  'HASH',
  'SCALE',
  'COLOR_RULE',
  'LAYER_N',
  'BASE_RULE',
  'HUE_DIFF',
  'FORCE_GRADIENTS',
  'HARD_CURVES',
  'DASH_RATE',
  'STREET_TURBULENCE',
  'NOISE_DIVISOR',
  'DENSITY',
  'TURBULENCE',
  'IGNORE_STREET_CAP',
  'KINKED_STREET_FACTOR',
  'HARD_BORDER',
  'BORDER_BLEED',
  'BORDER_DRIFT',
  'BORDER_THICKNESS',
  'BORDER_PADDING',
  'ROTATION',
  'STRAIGHT_STREETS',
  'X_OFF',
  'Y_OFF',
  'MISPRINT_ROTATION',
  'MAX_GRADIENT',
  'GRAIN',
  'SMUDGE',
  'STAR_MAP',
  'LOW_INK',
  'HUE_RULE',
  'SHADOW_X',
  'SHADOW_Y',
  'SHADOW_MAGNITUDE',
  'MIN_ST_W',
  'MAX_ST_W',
  'INVERT_STREETS',
  'LIGHTEN_DARKS',
  'IS_MISPRINT'
].sort((a, b) => b.length - a.length)





const util = fs.readFileSync('./util.js', 'utf8')
const bg = fs.readFileSync('./bg.js', 'utf8')
const grid = fs.readFileSync('./grid.js', 'utf8')
const border = fs.readFileSync('./border.js', 'utf8')
const layerRules = fs.readFileSync('./layerRules.js', 'utf8')
const index = fs.readFileSync('./index.js', 'utf8')


let script = util + bg + grid + border + layerRules + index



for (let i=0; i < globals.length; i++) {
  // console.log(globals[i])
  script = script.replaceAll(globals[i], 'g'+i)
}

console.log(script)
fs.writeFileSync('./premin.js', script)
// console.log(script.replace('MAX_GRADIENT', ''))


