'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import 'fluidbox';
import 'velocity-animate';

import '../styles/index.scss';

import Cards from './cards';

$('.js-fluidbox').fluidbox();

const cards = new Cards();

window.$ = $;
