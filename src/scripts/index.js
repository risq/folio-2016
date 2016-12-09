'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import 'simplezoom';
import 'velocity-animate';

import debounce from 'debounce';

import '../styles/index.scss';

import Router from './router';
import Cards from './cards';
import Menu from './menu';

$('.js-simplezoom').simplezoom();

const router = new Router();
const cards = new Cards();
const menu = new Menu();

cards.events.on('projects:show', () => {
  menu.initScrollSpy();
});

$(window).on('resize', debounce(onResize, 200));

window.$ = $;

function onResize() {
  menu.initScrollSpy();
}
