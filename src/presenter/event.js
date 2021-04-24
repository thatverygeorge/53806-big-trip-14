import EventFormEditView from '../view/event-form-edit.js';
import EventView from '../view/event.js';
import {RenderPosition, renderCustomElement, replace, remove} from '../util/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsListComponent, changeData, changeMode) {
    this._eventsListComponent = eventsListComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventFormEditCopmponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEventEditButtonClick = this._handleEventEditButtonClick.bind(this);
    this._handleFormEditButtonClick = this._handleFormEditButtonClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormEditCopmponent = this._eventFormEditCopmponent;

    this._eventComponent = new EventView(event);
    this._eventFormEditCopmponent = new EventFormEditView(event);

    this._eventComponent.setEditButtonClickHandler(this._handleEventEditButtonClick);
    this._eventComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);

    this._eventFormEditCopmponent.setEditButtonClickHandler(this._handleFormEditButtonClick);
    this._eventFormEditCopmponent.setEditFormSubmitHandler(this._handleEditFormSubmit);


    if (prevEventComponent === null || prevEventFormEditCopmponent === null) {
      renderCustomElement(this._eventsListComponent, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventFormEditCopmponent, prevEventFormEditCopmponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormEditCopmponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormEditCopmponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventFormEditCopmponent, this._eventComponent);
    document.addEventListener('keydown', this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormEditCopmponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventFormEditCopmponent.reset(this._event);
      this._replaceFormToEvent();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleEventEditButtonClick() {
    this._replaceEventToForm();
  }

  _handleFormEditButtonClick() {
    this._eventFormEditCopmponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleEditFormSubmit(event) {
    this._changeData(event);
    this._replaceFormToEvent();
  }

  _handleFavoriteButtonClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}
