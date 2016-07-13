'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import 'jquery';
import 'velocity-animate';
import '../styles/index.scss';
import Cards from './cards';

const cards = new Cards();
