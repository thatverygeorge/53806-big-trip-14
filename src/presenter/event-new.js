import EventFormEditView from '../view/event-form-edit.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {remove, renderCustomElement, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

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
  isNewEvent: true,
};

export default class EventNew {
  constructor(eventListContainer, noEventComponent, changeData, offersModel, destinationsModel) {
    this._eventListContainer = eventListContainer;
    this._noEventComponent = noEventComponent;

    this._changeData = changeData;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventFormEditComponent = null;

    this._handleFormEditButtonClick = this._handleFormEditButtonClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleEventTypeChange = this._handleEventTypeChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
  }

  init(buttonNew) {
    if (this._eventFormEditComponent !== null) {
      return;
    }

    this._noEventComponent.getElement().classList.add('visually-hidden');

    this._buttonNew = buttonNew;

    this._currentType = BLANK_EVENT.type;
    this._currentDestinationName = BLANK_EVENT.destination.name;

    BLANK_EVENT.offers = this._offersModel.getOffersByType(BLANK_EVENT.type);

    this._eventFormEditComponent = new EventFormEditView(BLANK_EVENT);
    this._eventFormEditComponent.setEditButtonClickHandler(this._handleFormEditButtonClick);
    this._eventFormEditComponent.setEditFormSubmitHandler(this._handleEditFormSubmit);
    this._eventFormEditComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
    this._eventFormEditComponent.setEventTypeChangeHandler(this._handleEventTypeChange);
    this._eventFormEditComponent.setDestinationChangeHandler(this._handleDestinationChange);

    renderCustomElement(this._eventListContainer, this._eventFormEditComponent, RenderPosition.AFTERBEGIN);

    this._buttonNew.disabled = true;
    this._buttonNew.blur();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventFormEditComponent === null) {
      return;
    }

    remove(this._eventFormEditComponent);
    this._eventFormEditComponent = null;

    this._noEventComponent.getElement().classList.remove('visually-hidden');

    this._buttonNew.disabled = false;
    document.removeEventListener('keydown', this._escKeyDownHandler);

  }

  _handleEditFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, event),
    );
    this.destroy();
  }

  _handleFormEditButtonClick() {
    this.destroy();
  }

  _handleDeleteButtonClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleEventTypeChange(type) {
    if (this._currentType === type) {
      return;
    }

    this._currentType = type;
    return this._offersModel.getOffersByType(type);
  }

  _handleDestinationChange(name) {
    if (this._currentDestinationName === name) {
      return;
    }

    this._currentDestinationName = name;
    return this._destinationsModel.getDestinationByName(name);
  }
}
