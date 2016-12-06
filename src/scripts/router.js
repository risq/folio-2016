import Bluebird from 'bluebird';
import EventEmitter from 'eventemitter3';
import transceiver from 'transceiver';

const channel = transceiver.channel('router');

export default class Router {
  constructor() {
    this.initEls();

    this.page = 'home';
    channel.reply({
      navigateToHome: this.navigateToHome.bind(this),
      navigateToProject: this.navigateToProject.bind(this),
      navigateToSkills: this.navigateToSkills.bind(this),
    });
  }

  initEls() {
    this.$els = {
      body: $('body'),
      content: $('.js-content'),
      contentWrapper: $('.js-contentWrapper'),
    };
  }

  navigateToHome() {
    if (this.page !== 'home') {
        this.$els.content
          .addClass('content--hidden');
      this.page = 'home';
    }
  }

  navigateToProject($targetProject) {

    this.$els.content
      .removeClass('content--hidden');

      this.$els.contentWrapper.scrollTop($targetProject.position().top);
    this.page = 'project';
  }

  navigateToSkills() {
    this.$els.content
      .removeClass('content--hidden');

    this.page = 'skills';
  }
}
