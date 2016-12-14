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
      scrollToProjects: this.scrollToProjects.bind(this),
      scrollToSkills: this.scrollToSkills.bind(this),
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
      },
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
    this.$els.page.skills.addClass('hidden');
    this.$els.page.projects.removeClass('hidden');
    this.$els.contentMenu
      .removeClass('hidden');

    this.$els.content
      .removeClass('hidden');

    this.$els.contentWrapper.scrollTop($targetProject.position().top);
    this.page = 'project';
  }

  navigateToSkills() {
    this.$els.contentWrapper.scrollTop(0);
    this.$els.pageName.text('compétences');
    this.$els.page.projects.addClass('hidden');
    this.$els.page.skills.removeClass('hidden');
    this.$els.contentMenu
      .addClass('hidden');

    this.$els.content
      .removeClass('hidden');

    this.page = 'skills';
  }

  scrollToProjects() {
    $('body').animate({
      scrollTop: this.$els.page.projects.offset().top,
    });
  }

  scrollToSkills() {
    $('body').animate({
      scrollTop: this.$els.page.skills.offset().top,
    });
  }
}
