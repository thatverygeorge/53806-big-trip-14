import dayjs from 'dayjs';
import {formatDate} from '../util/event.js';
import {getRandomInteger, isArrayEmpty, isStringEmpty} from '../util/common.js';
import {EVENT_TYPES, MAX_NUMBER_OF_OFFERS, DESTINATIONS} from '../const.js';
import SmartView from './smart.js';
import {generateDestination, generateOffer} from '../mock/event.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  type: 'flight',
  price: '',
  startDate: dayjs(),
  endDate: dayjs().add(1, 'hour'),
  destination: {
    description: '',
    name: '',
    photos: [],
  },
  offers: [],
};

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

export const createEventFormEditTemplate = (data) => {
  const {
    type,
    destination,
    startDate,
    endDate,
    price,
    offers,
    isOffersExist,
    isDescriptionExists,
    isPhotosExist,
  } = data;

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
              <section class="event__details ${!isOffersExist && !isDescriptionExists && !isPhotosExist ? 'visually-hidden' : ''}">
                <section class="event__section  event__section--offers ${!isOffersExist ? 'visually-hidden' : ''}">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                  <div class="event__available-offers">
                    ${isOffersExist ? createOfferSelectorTemplate(offers) : ''}
                  </div>
                </section>

                <section class="event__section  event__section--destination ${!isDescriptionExists && !isPhotosExist ? 'visually-hidden' : ''}">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description ${!isDescriptionExists ? 'visually-hidden' : ''}">${data.destination.description}</p>

                  <div class="event__photos-container ${!isPhotosExist ? 'visually-hidden' : ''}">
                    <div class="event__photos-tape">
                      ${isPhotosExist ? createPhotoTemplate(destination.photos) : ''}
                    </div>
                  </div>
                </section>
              </section>
            </form>
          </li>`;
};

export default class EventFormEdit extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._data = EventFormEdit.parseEventToState(event);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._editButtonClickHandler = this._editButtonClickHandler.bind(this);
    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);

    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  getTemplate() {
    return createEventFormEditTemplate(EventFormEdit.parseEventToState(this._data));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setEditButtonClickHandler(this._callback.editClick);
    this.setEditFormSubmitHandler(this._callback.formSubmit);
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  reset(event) {
    this.updateData(
      EventFormEdit.parseEventToState(event),
    );
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: formatDate(this._data.startDate, 'DD/MM/YY HH:mm'),
        enableTime: true,
        time_24hr: true,
        onClose: this._startDateChangeHandler,
      },
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: formatDate(this._data.endDate, 'DD/MM/YY HH:mm'),
        minDate: formatDate(this._data.startDate, 'DD/MM/YY HH:mm'),
        enableTime: true,
        time_24hr: true,
        onClose: this._endDateChangeHandler,
      },
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      startDate: formatDate([userDate], 'YYYY-MM-DDTHH:mm:ss'),
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      endDate: formatDate([userDate], 'YYYY-MM-DDTHH:mm:ss'),
    });
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._eventTypeToggleHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationToggleHandler);
  }

  _eventTypeToggleHandler(evt) {
    evt.preventDefault();
    if (evt.target.matches('.event__type-label')) {
      const type = evt.target.textContent;
      const offers = new Array(getRandomInteger(0, MAX_NUMBER_OF_OFFERS)).fill().map(() => generateOffer(type, false));
      this.updateData({
        type,
        offers,
      });
    }
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    if (DESTINATIONS.includes(evt.target.value)) {
      const destination = generateDestination(evt.target.value);
      this.updateData({
        destination,
      });
    }
  }

  _editButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _editFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventFormEdit.parseStateToEvent(this._data));
  }

  setEditButtonClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editButtonClickHandler);
  }

  setEditFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._editFormSubmitHandler);
  }

  static parseEventToState(event) {
    return Object.assign(
      {},
      event,
      {
        isOffersExist: !isArrayEmpty(event.offers),
        isDescriptionExists: !isStringEmpty(event.destination.description),
        isPhotosExist: !isArrayEmpty(event.destination.photos),
      },
    );
  }

  static parseStateToEvent(data) {
    data = Object.assign({}, data);

    delete data.isOffersExist;
    delete data.isDescriptionExists;
    delete data.isPhotosExist;

    return data;
  }
}
