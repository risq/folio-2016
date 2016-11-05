export default class Cards {
  constructor() {
    this.initEls();
    this.initEvents();
  }

  initEls() {
    this.$els = {
      links: $('.js-menu-link'),
    };
  }

  initEvents() {
    this.$els.links.on('click', this.onLinkClick.bind(this));
  }

  onLinkClick(e) {
    e.preventDefault();
    const $link = $(e.currentTarget);
    const $targetProject = $($link.attr('href'));

    if ($targetProject && $targetProject.length) {
      $('body').animate({
        scrollTop: $targetProject.position().top,
      });
    }

    return false;
  }
}
