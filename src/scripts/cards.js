import $ from 'jquery';

const gridRows = 3;
const gridCols = 4;
const propagationTime = 400;

export default class Cards {
  constructor() {
    this.initEls();
    this.initEvents();

    console.log(this.getPosFromIndex(5), this.getPosFromIndex(6));
    console.log(this.getPosFromIndex(5), this.getPosFromIndex(4));
  }

  initEls() {
    this.$els = {
      cards: $('.js-card').sort((a, b) => +a.getAttribute('data-cardIndex') - +b.getAttribute('data-cardIndex')),
      content: $('.js-content'),
    };
  }

  initEvents() {
    this.$els.cards.on('click', this.onCardClick.bind(this));
  }

  onCardClick(e) {
    const $card = $(e.currentTarget);
    console.log(this.getPosFromIndex($card.attr('data-cardIndex')));
    this.propagate($card.attr('data-cardIndex'));
  }

  propagate(centerIndex) {
    const centerPos = this.getPosFromIndex(centerIndex);
    let maxTime = 0;

    this.$els.cards.each((i, el) => {
      const $card = $(el);
      const pos = this.getPosFromIndex(i);

      if (pos.col !== 0 || pos.row !== 0) {
        const time = this.getDistance(centerPos, pos) * propagationTime;
        maxTime = time > maxTime ? time : maxTime;
        setTimeout(() => $card.addClass('flipped'), time);
      }
    });

    setTimeout(() => {
      this.$els.cards.first().addClass('card-header--show-nav');
      this.$els.content.fadeIn();
    }, maxTime + 500);
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
}
