import debounce from 'debounce';

const scrollSpyMargin = 100;

export default class Menu {
  constructor() {
    this.initEls();
    this.initEvents();
    this.offsets = [];
  }

  initEls() {
    this.$els = {
      contentWrapper: $('.js-contentWrapper'),
      links: $('.js-menu-link'),
    };
  }

  initEvents() {
    this.$els.links.on('click', this.onLinkClick.bind(this));
    this.$els.contentWrapper.on('scroll', debounce(this.onScroll.bind(this), 100));
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
      this.$els.contentWrapper.animate({
        scrollTop: $targetProject.position().top,
      });
    }

    return false;
  }

  onScroll(e) {
    const scrollTop = this.$els.contentWrapper.scrollTop();
    console.log('onScroll', scrollTop);
    const link = this.offsets.find(project => scrollTop > project.offset).link;
    this.$els.links.not(link).removeClass('active');
    $(link).addClass('active');
  }
}
