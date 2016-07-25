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
      projectsBack: $('.js-projects-back'),
    };
  }

  initEvents() {
    this.$els.cards.on('click', this.onCardClick.bind(this));
    this.$els.projectsCard.on('click', this.onProjectsCardClick.bind(this));
    this.$els.projectsBack.on('click', this.onProjectsBackClick.bind(this));
  }

  onCardClick(e) {
    const $card = $(e.currentTarget);

    if (this.page === 'projects-select') {
      const targetProject = $card.attr('data-target-project');
      const $targetProject = targetProject ? $(`#${targetProject}`) : null;

      if ($targetProject && $targetProject.length) {
        this.viewProject($card)
          .then(() => {
            $('body').scrollTop($targetProject.position().top);

            this.$els.content
              .removeClass('content--pre-show')
              .addClass('content--show');

            this.page = 'project';
          });
      }
    }
  }

  onProjectsCardClick(e) {
    const index = this.getCardIndex(this.$els.projectsCard);

    if (this.page === 'index') {
      this.playVideos();
      this.propagate(index, [0], $card => $card.addClass('show-image'))
        .then(() => {
          this.page = 'projects-select';
        });
    }
  }

  onProjectsBackClick(e) {
    const index = this.getCardIndex(this.$els.projectsBack);

    if (this.page === 'projects-select') {
      this.propagate(index, [], $card => $card.removeClass('show-image'))
        .then(() => {
          this.page = 'index';
        });
    }
  }

  viewProject($projectCard) {
    this.$els.headerCard.removeClass('show-image');

    return this.propagate(this.getCardIndex($projectCard), [0], $card => $card.addClass('flipped'))
      .then(() => {
        this.stopVideos();
        this.$els.headerCard.addClass('card-header--show-nav');
        this.$els.content.addClass('content--pre-show');
      }).delay(500);
  }

  propagate(centerIndex, exclude = [], callback) {
    const centerPos = this.getPosFromIndex(centerIndex);
    let maxTime = 0;

    this.$els.cards.each((i, el) => {
      const $card = $(el);
      const pos = this.getPosFromIndex(i);

      if (exclude.indexOf(i) === -1) {
        const time = this.getDistance(centerPos, pos) * propagationTime;
        maxTime = time > maxTime ? time : maxTime;
        setTimeout(() => callback($card), time);
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
