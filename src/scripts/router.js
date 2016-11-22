import Bluebird from 'bluebird';
import EventEmitter from 'eventemitter3';
import transceiver from 'transceiver';

const channel = transceiver.channel('router');

export default class Router {
  constructor() {
    this.initEls();

    this.page = 'index';
    channel.reply({
      navigateToHome: this.navigateToHome.bind(this),
      navigateToProject: this.navigateToProject.bind(this),
    });
  }

  initEls() {
    this.$els = {
      body: $('body'),
      content: $('.js-content'),
    };
  }

  navigateToHome() {
    console.log('navigateToHome');
    this.$els.content.addClass('content--pre-show');
    setTimeout(() => {
      this.$els.content
        .removeClass('content--show')
        .removeClass('content--pre-show');
    }, 500);
    this.page = 'home';
  }

  navigateToProject($targetProject) {
    this.$els.content.addClass('content--pre-show');
    this.$els.body.scrollTop($targetProject.position().top);

    this.$els.content
      .removeClass('content--pre-show')
      .addClass('content--show');

    this.page = 'project';
  }
}
