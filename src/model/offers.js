import Observer from '../utils/observer.js';
import {MAX_NUMBER_OF_OFFERS} from '../const.js';
import {generateOffer} from '../mock/event.js';
import {getRandomInteger} from '../utils/common.js';

export default class Offers extends Observer {
  constructor() {
    super();
  }

  getOffersByType(typeToGetBy) {
    return new Array(getRandomInteger(0, MAX_NUMBER_OF_OFFERS)).fill().map(() => generateOffer(typeToGetBy, false));
  }
}
