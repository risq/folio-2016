import debounce from 'debounce';

const scrollSpyMargin = 40;

export default class Menu {
  constructor() {
    this.initEls();
    this.initEvents();
    this.offsets = [];
  }

  initEls() {
    this.$els = {
      body: $('body'),
      links: $('.js-menu-link'),
    };
  }

  initEvents() {
    this.$els.links.on('click', this.onLinkClick.bind(this));
    $(document).on('scroll', debounce(this.onScroll.bind(this), 100));
  }

  initScrollSpy() {
    this.offsets = this.$els.links.map((i, el) => {
      return {
        link: el,
        offset: $($(el).attr('href')).position().top - scrollSpyMargin,
      };
    }).toArray().reverse();
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

  onScroll(e) {
    console.log('onScroll');
    const scrollTop = this.$els.body.scrollTop();
    const link = this.offsets.find(project => scrollTop > project.offset).link;
    this.$els.links.not(link).removeClass('active');
    $(link).addClass('active');
  }
}
