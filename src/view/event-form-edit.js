import dayjs from 'dayjs';
import {formatDate, isArrayEmpty, isStringEmpty} from '../util.js';
import {EVENT_TYPES} from '../const.js';

const createEventTypeInputTemplate = (typeToCheck) => {
  return EVENT_TYPES.map((type) => {
    return `<div class="event__type-item">
              <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === typeToCheck ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
            </div>`;
  }).join('');
};

const createPhotoTemplate = (photos) => {
  return photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  }).join('');
};

let offerID = 0;

const createOfferSelectorTemplate = (offers) => {
  return offers.map((offer) => {
    offerID++;
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerID}-1" type="checkbox" name="event-offer-${offerID}" ${offer.isChecked ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offerID}-1">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
  }).join('');
};

export const createEventFormEditTemplate = (event = {}) => {
  const {
    type = 'flight',
    price = '',
    startDate = dayjs(),
    endDate = dayjs(startDate).add(1, 'hour'),
    destination = {
      description: '',
      name: '',
      photos: [],
    },
    offers = [],
  } = event;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${createEventTypeInputTemplate(type)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    <option value="Amsterdam"></option>
                    <option value="Geneva"></option>
                    <option value="Chamonix"></option>
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(startDate, 'DD/MM/YY HH:mm')}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(endDate, 'DD/MM/YY HH:mm')}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details ${isArrayEmpty(offers) && isStringEmpty(destination.description) && isArrayEmpty(destination.photos) ? 'visually-hidden' : ''}">
                <section class="event__section  event__section--offers ${isArrayEmpty(offers) ? 'visually-hidden' : ''}">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                  <div class="event__available-offers">
                    ${!isArrayEmpty(offers) ? createOfferSelectorTemplate(offers) : ''}
                  </div>
                </section>

                <section class="event__section  event__section--destination ${isStringEmpty(destination.description) && isArrayEmpty(destination.photos) ? 'visually-hidden' : ''}">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description ${isStringEmpty(destination.description) ? 'visually-hidden' : ''}">${destination.description}</p>

                  <div class="event__photos-container ${isArrayEmpty(destination.photos) ? 'visually-hidden' : ''}">
                    <div class="event__photos-tape">
                      ${!isArrayEmpty(destination.photos) ? createPhotoTemplate(destination.photos) : ''}
                    </div>
                  </div>
                </section>
              </section>
            </form>
          </li>`;
};