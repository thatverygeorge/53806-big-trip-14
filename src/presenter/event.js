import EventFormEditView from '../view/event-form-edit.js';
import EventView from '../view/event.js';
import {RenderPosition, renderCustomElement, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsListComponent, changeData, changeMode, offersModel, destinationsModel) {
    this._eventsListComponent = eventsListComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventComponent = null;
    this._eventFormEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEventEditButtonClick = this._handleEventEditButtonClick.bind(this);
    this._handleFormEditButtonClick = this._handleFormEditButtonClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleEventTypeChange = this._handleEventTypeChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
  }

  init(event) {
    this._event = event;

    this._currentType = this._event.type;
    this._currentDestinationName = this._event.destination.name;

    const prevEventComponent = this._eventComponent;
    const prevEventFormEditCopmponent = this._eventFormEditComponent;

    this._eventComponent = new EventView(event);
    this._eventFormEditComponent = new EventFormEditView(event);

    this._eventComponent.setEditButtonClickHandler(this._handleEventEditButtonClick);
    this._eventComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);

    this._eventFormEditComponent.setEditButtonClickHandler(this._handleFormEditButtonClick);
    this._eventFormEditComponent.setEditFormSubmitHandler(this._handleEditFormSubmit);
    this._eventFormEditComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
    this._eventFormEditComponent.setEventTypeChangeHandler(this._handleEventTypeChange);
    this._eventFormEditComponent.setDestinationChangeHandler(this._handleDestinationChange);

    if (prevEventComponent === null || prevEventFormEditCopmponent === null) {
      renderCustomElement(this._eventsListComponent, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventFormEditComponent, prevEventFormEditCopmponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormEditCopmponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventFormEditComponent, this._eventComponent);
    document.addEventListener('keydown', this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormEditComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventFormEditComponent.reset(this._event);
      this._replaceFormToEvent();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleEventEditButtonClick() {
    this._replaceEventToForm();
  }

  _handleFormEditButtonClick() {
    this._eventFormEditComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleEditFormSubmit(update) {

    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      update,
    );

    this._replaceFormToEvent();
  }

  _handleFavoriteButtonClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  _handleDeleteButtonClick(event) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
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
