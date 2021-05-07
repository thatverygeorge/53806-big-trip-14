import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffersByType(typeToGetBy) {
    return this._offers.find((offer) => offer.type === typeToGetBy).offers;
  }

  getOffersTypes() {
    if (this._offers) {
      return this._offers.map((offer) => offer.type);
    }

    return [];
  }

  static adaptToClient(offers) {
    const adaptedOffers = [];

    for (let i = 0; i < offers.offers.length; i++) {
      adaptedOffers.push(Object.assign(
        {},

        offers.offers[i],
        {
          isChecked: offers.offers[i].isChecked,
        },
      ));
    }

    return {
      type: offers.type,
      offers: adaptedOffers,
    };
  }
}
