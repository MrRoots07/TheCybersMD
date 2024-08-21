const fs = require('fs');
const cfonts = require('cfonts');
const spin = require('spinnies');
const { color, bgcolor } = require('./color')

const infoBot = JSON.parse(fs.readFileSync('./dono/config.json'));
const textoBanner = infoBot.textoBanner

const bannerTexto = textoBanner.includes(' ') ? textoBanner.split(' ').join(' | ') : textoBanner;

var cores = ["red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "redBright", "greenBright", "yellowBright", "blueBright", "magentaBright", "cyanBright", "whiteBright"];
const cor1 = cores[Math.floor(Math.random() * (cores.length))];
const cor2 = cores[Math.floor(Math.random() * (cores.length))];
const cor3 = cores[Math.floor(Math.random() * (cores.length))];
const cor4 = cores[Math.floor(Math.random() * (cores.length))];
const cor5 = cores[Math.floor(Math.random() * (cores.length))];

const banner = cfonts.render((bannerTexto), {
  font: 'tiny',
  align: 'center',
  colors: [`${cor1}`, `${cor3}`, `${cor4}`, `${cor2}`],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: '0',
  gradrient: [`${cor4}`, `${cor2}`],
  independentGradient: false,
  transitionGradient: false,
  env: 'node'
});

const banner2 = cfonts.render((`Uma simples base para desenvovedores.`), {
  font: 'console',
  align: 'center',
  gradrient: [`${cor4}`, `${cor2}`],
  colors: [`${cor3}`, `${cor1}`, `${cor5}`],
  lineHeight: 1
});

const spinner = {
  "interval": 100,
  "frames": [
    "|",
    "/",
    "-",
    "\\"
  ]
};

let globalSpinner;
const getGlobalSpinner = () => {
  if (!globalSpinner) globalSpinner = new spin({ color: 'pink', succeedColor: 'greenBright', spinner });
  return globalSpinner;
}

spins = getGlobalSpinner(false)

const start = (id, text) => {
  spins.add(id, { text: text });
};

const infopd = (id, text) => {
  spins.update(id, { text: text });
};

const success = (id, text) => {
  spins.succeed(id, { text: text });
};

const close = (id, text) => {
  spins.fail(id, { text: text });
};

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = { color, bgcolor, banner, banner2, start, infopd, success, close, sleep }