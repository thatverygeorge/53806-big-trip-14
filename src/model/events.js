import Observer from '../utils/observer.js';
import {formatDate} from '../utils/event.js';
import {getRandomInteger} from '../utils/common.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events = []) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedDestination = Object.assign(
      {},
      event.destination,
      {
        photos: event.destination.pictures,
      },
    );

    delete adaptedDestination.pictures;

    const adaptedOffers = [];

    for (let i = 0; i < event.offers.length; i++) {
      adaptedOffers.push(Object.assign(
        {},
        event.offers[i],
        {
          isChecked: Boolean(getRandomInteger(0, 1)),
        },
      ));
    }

    const adaptedEvent = Object.assign(
      {},
      event,
      {
        id: parseInt(event.id),
        price: event.base_price,
        startDate: event.date_from,
        endDate: event.date_to,
        isFavorite: event.is_favorite,
        destination: adaptedDestination,
        offers: adaptedOffers,
      },
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedDestination = Object.assign(
      {},
      event.destination,
      {
        pictures: event.destination.photos,
      },
    );

    delete adaptedDestination.photos;

    const adaptedOffers = [];

    for (let i = 0; i < event.offers.length; i++) {
      adaptedOffers.push(Object.assign(
        {},
        event.offers[i],
      ));

      delete adaptedOffers[i].isChecked;
    }

    const adaptedEvent = Object.assign(
      {},
      event,
      {
        id: event.id.toString(),
        'base_price': event.price,
        'date_from': formatDate(event.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        'date_to': formatDate(event.endDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        'is_favorite': event.isFavorite,
        destination: adaptedDestination,
        offers: adaptedOffers,
      },
    );

    delete adaptedEvent.price;
    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
