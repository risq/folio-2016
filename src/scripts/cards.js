import Bluebird from 'bluebird';
import EventEmitter from 'eventemitter3';
import transceiver from 'transceiver';

const router = transceiver.channel('router');

const gridRows = 3;
const gridCols = 4;
const propagationTime = 400;

export default class Cards {
  constructor() {
    this.initEls();
    this.initEvents();

    this.projectSelectView = false;
    this.events = new EventEmitter();

    setTimeout(() => this.initCards(), 500);
  }

  initEls() {
    this.$els = {
      cards: $('.js-card').sort((a, b) => this.getCardIndex($(a)) - this.getCardIndex($(b))),
      videos: $('.js-card-video'),
      headerCard: $('.js-card-header'),
      projectsCard: $('.js-card-projects'),
      projectsBack: $('.js-projects-back'),
    };
  }

  initEvents() {
    this.$els.cards.on('click', this.onCardClick.bind(this));
    this.$els.projectsCard.on('click', this.onProjectsCardClick.bind(this));
    this.$els.projectsBack.on('click', this.onProjectsBackClick.bind(this));
    this.$els.headerCard.on('click', this.onHeaderCardClick.bind(this));
  }

  initCards() {
    return this.propagate(0, [], $card => $card.removeClass('flipped'));
  }

  onCardClick(e) {
    const $card = $(e.currentTarget);

    if (this.projectSelectView) {
      const targetProject = $card.attr('data-target-project');
      const $targetProject = targetProject ? $(`#${targetProject}`) : null;

      if ($targetProject && $targetProject.length) {
        this.viewProject($card, $targetProject)
          .then(() => {
            this.$els.cards.removeClass('show-secondary');
            this.projectSelectView = false;
            this.events.emit('projects:show');
          });
      }
    }
  }

  onProjectsCardClick(e) {
    const index = this.getCardIndex(this.$els.projectsCard);

    if (!this.projectSelectView) {
      this.playVideos();
      return this.propagate(index, [0], $card => $card.addClass('show-secondary'))
        .then(() => {
          this.projectSelectView = true;
        });
    }
  }

  onProjectsBackClick(e) {
    const index = this.getCardIndex(this.$els.projectsBack);

    if (this.projectSelectView) {
      return this.propagate(index, [], $card => $card.removeClass('show-secondary'))
        .then(() => {
          this.projectSelectView = false;
        });
    }
  }

  onHeaderCardClick(e) {
    e.preventDefault();
    router.request('navigateToHome');
    this.$els.headerCard.removeClass('card-header--content-mode');

    return this.propagate(0, [0], $card => $card.removeClass('flipped'))
      .then(() => {
        this.playVideos();
      });
  }

  viewProject($projectCard, $targetProject) {
    this.$els.headerCard.removeClass('show-secondary');

    return this.propagate(this.getCardIndex($projectCard), [0], $card => $card.addClass('flipped'))
      .then(() => {
        this.stopVideos();
        this.$els.headerCard.addClass('card-header--content-mode');
      })
      .then(() => router.request('navigateToProject', $targetProject));
  }

  propagate(centerIndex, exclude = [], callback) {
    const centerPos = this.getPosFromIndex(centerIndex);
    let maxTime = 0;

    this.$els.cards.each((i, el) => {
      const $card = $(el);
      const pos = this.getPosFromIndex(i);

      console.log(i, $card);

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
