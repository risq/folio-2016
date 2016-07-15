import Bluebird from 'bluebird';

const gridRows = 3;
const gridCols = 4;
const propagationTime = 400;

export default class Cards {
  constructor() {
    this.initEls();
    this.initEvents();

    this.page = 'index';
  }

  initEls() {
    this.$els = {
      cards: $('.js-card').sort((a, b) => this.getCardIndex($(a)) - this.getCardIndex($(b))),
      videos: $('.js-card-video'),
      headerCard: $('.js-card-header'),
      projectsCard: $('.js-card-projects'),
      content: $('.js-content'),
    };
  }

  initEvents() {
    this.$els.cards.on('click', this.onCardClick.bind(this));
    this.$els.projectsCard.on('click', this.onProjectsCardClick.bind(this));
  }

  onCardClick(e) {
    const $card = $(e.currentTarget);
    if (this.page === 'projects-select') {
      this.viewProject($card)
        .then(() => {
          const targetProject = $card.attr('data-target-project');
          const $targetProject = targetProject ? $(`#${targetProject}`) : null;

          if ($targetProject && $targetProject.length) {
            console.log($targetProject, $targetProject.offset());
            $('body').scrollTop($targetProject.position().top);
          }
        });
    }
  }

  onProjectsCardClick(e) {
    const index = this.getCardIndex(this.$els.projectsCard);
    this.$els.projectsCard.addClass('active');
    this.playVideos();
    this.propagate(index, 'show-image', [0, index])
      .then(() => {
        this.page = 'projects-select';
      });
  }

  viewProject($projectCard) {
    this.$els.headerCard.removeClass('show-image');
    return this.propagate(this.getCardIndex($projectCard), 'flipped', [0])
      .then(() => {
        this.stopVideos();
        this.$els.headerCard.addClass('card-header--show-nav');
        this.$els.content.fadeIn();
      });
  }

  propagate(centerIndex, cardClass, exclude = []) {
    const centerPos = this.getPosFromIndex(centerIndex);
    let maxTime = 0;

    this.$els.cards.each((i, el) => {
      const $card = $(el);
      const pos = this.getPosFromIndex(i);

      if (exclude.indexOf(i) === -1) {
        const time = this.getDistance(centerPos, pos) * propagationTime;
        maxTime = time > maxTime ? time : maxTime;
        setTimeout(() => $card.addClass(cardClass), time);
      }
    });

    return new Bluebird(resolve => setTimeout(resolve, maxTime + 500));
  }

  playVideos() {
    this.$els.videos.each((i, video) => video.play());
  }

  stopVideos() {
    this.$els.videos.each((i, video) => video.pause());
  }

  getCardFromPos(col, row) {
    return this.$els.cards[row * gridRow + col];
  }

  getPosFromIndex(index) {
    return {
      index,
      row: Math.floor(index / (gridRows + 1)),
      col: index % gridCols,
    };
  }

  getDistance(posA, posB) {
    return Math.sqrt((posA.row - posB.row) * (posA.row - posB.row) + (posA.col - posB.col) * (posA.col - posB.col));
  }

  getCardIndex($card) {
    return parseInt($card.attr('data-cardIndex'), 10) || -1;
  }
}
