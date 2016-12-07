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
      contentMenu: $('.js-contentMenu'),
      contentWrapper: $('.js-contentWrapper'),
      pageName: $('.js-pageName'),
      pages: $('.js-contentPage'),
      page: {
        projects: $('.js-contentPage[data-page="projects"]'),
        skills: $('.js-contentPage[data-page="skills"]'),
      }
    };
  }

  navigateToHome() {
    if (this.page !== 'home') {
        this.$els.content
          .addClass('hidden');
        this.$els.contentMenu
          .addClass('hidden');
      this.page = 'home';
    }
  }

  navigateToProject($targetProject) {
    this.$els.pageName.text('projets');
    this.$els.page.skills.hide();
    this.$els.page.projects.show();
    this.$els.contentMenu
      .removeClass('hidden');

    this.$els.content
      .removeClass('hidden');

    this.$els.contentWrapper.scrollTop($targetProject.position().top);
    this.page = 'project';
  }

  navigateToSkills() {
    this.$els.pageName.text('compétences');
    this.$els.page.projects.hide();
    this.$els.page.skills.show();
    this.$els.contentMenu
      .addClass('hidden');

    this.$els.content
      .removeClass('hidden');

    this.page = 'skills';
  }
}
