import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventView from '../view/no-event.js';
import {RenderPosition, renderCustomElement, remove} from '../util/render.js';
import {isArrayEmpty, updateItem} from '../util/common.js';
import EventPresenter from './event.js';

export default class EventsList {
  constructor(tripMainElement, tripEventsElement) {
    this._tripMainElement = tripMainElement;
    this._tripEventsElement = tripEventsElement;

    this._noEventComponent = new NoEventView();
    this._sortComponent = new SortView();
    this._eventsListComponent = null;
    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._eventsPresenters = {};

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._renderEventsList();
  }

  _handleModeChange() {
    Object.values(this._eventsPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventsPresenters[updatedEvent.id].init(updatedEvent);
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._events);
    renderCustomElement(this._tripMainElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost() {
    this._tripCostComponent = new TripCostView(this._events);
    renderCustomElement(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    renderCustomElement(this._tripEventsElement, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    this._eventsListComponent = new EventsListView();
    renderCustomElement(this._tripEventsElement, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventsPresenters[event.id] = eventPresenter;
  }

  _renderEvents() {
    for (let i = 0; i < this._events.length; i++) {
      this._renderEvent(this._events[i]);
    }
  }

  _renderNoEvents() {
    renderCustomElement(this._tripEventsElement, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _clearEventsList() {
    Object.values(this._eventsPresenters).forEach((presenter) => presenter.destroy());

    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
    remove(this._sortComponent);
    remove(this._eventsListComponent);

    this._renderNoEvents();
  }

  _renderEventsList() {
    if (isArrayEmpty(this._events)) {
      this._renderNoEvents();
    } else {
      this._renderTripInfo();
      this._renderTripCost();
      this._renderSort();
      this._renderList();
      this._renderEvents();
    }
  }
}
