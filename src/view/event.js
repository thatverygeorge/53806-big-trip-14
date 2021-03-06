import {formatDate, getDuration} from '../utils/event.js';
import AbstractView from './abstract.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const createOfferTemplate = (offers) => {
  return offers.map((offer) => {
    return offer.isChecked ? `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>` : '';
  }).join('');
};

export const createEventTemplate = (event) => {
  const {
    type,
    price,
    startDate,
    endDate,
    destination,
    offers,
    isFavorite,
  } = event;

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${formatDate(startDate, 'YYYY-MM-DD')}">${formatDate(startDate, 'MMM DD')}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destination.name}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dayjs(startDate).utcOffset(+3).format('YYYY-MM-DDTHH:mm')}">${dayjs(startDate).utcOffset(+3).format('HH:mm')}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${dayjs(endDate).utcOffset(+3).format('YYYY-MM-DDTHH:mm')}">${dayjs(endDate).utcOffset(+3).format('HH:mm')}</time>
                </p>
                <p class="event__duration">${getDuration(event)}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                ${createOfferTemplate(offers)}
              </ul>
              <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._editButtonClickHandler = this._editButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _editButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditButtonClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteButtonClickHandler);
  }
}
