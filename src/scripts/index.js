'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import 'simplezoom';
import 'velocity-animate';

import '../styles/index.scss';

import Cards from './cards';

$('.js-simplezoom').simplezoom();

const cards = new Cards();

window.$ = $;
