import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventView from '../view/no-event.js';
import LoadingView from '../view/loading.js';
import {RenderPosition, renderCustomElement, remove} from '../utils/render.js';
import EventPresenter from './event.js';
import EventNewPresenter from './event-new.js';
import {sortEventsByDateUp, sortEventsByPriceDown, sortEventsByDurationDown} from '../utils/event.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import {hideListStyleLine, showListStyleLine} from '../utils/common.js';

export default class EventsList {
  constructor(tripMainElement, tripEventsElement, buttonNew, eventsModel, filterModel, offersModel, destinationsModel, api) {
    this._tripMainElement = tripMainElement;
    this._tripEventsElement = tripEventsElement;
    this._buttonNew = buttonNew;

    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._api = api;

    this._eventsCount = this._getEvents().length;

    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._noEventComponent = new NoEventView();
    this._eventsListComponent = new EventsListView();
    this._tripInfoComponent = null;
    this._tripCostComponent = null;
    this._sortComponent = null;
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsPresenters = {};
    this._eventNewPresenter = new EventNewPresenter(this._eventsListComponent, this._noEventComponent, this._handleViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    this._buttonNew.disabled = false;

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderEventsList();
  }

  destroy() {
    this._buttonNew.disabled = true;
    this._buttonNew.blur();

    this._clearEventsList();

    remove(this._noEventComponent);
    remove(this._sortComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(this._buttonNew);
  }

  _getEvents(isSource) {
    let filterType = this._filterModel.getFilter();

    if (isSource) {
      filterType = FilterType.EVERYTHING;
    }

    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.PRICE_DOWN:
        return filtredEvents.sort(sortEventsByPriceDown);
      case SortType.DURATION_DOWN:
        return filtredEvents.sort(sortEventsByDurationDown);
    }

    return filtredEvents.sort(sortEventsByDateUp);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEventsList();
    this._renderEventsList();
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventsPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._api.updateEvent(update).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        });
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventsPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearEventsList();
        this._eventsCount = this._getEvents().length;
        this._renderEventsList();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList({resetSortType: true});
        this._eventsCount = this._getEvents().length;
        this._renderEventsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        showListStyleLine();
        this._clearEventsList();
        this._eventsCount = this._getEvents().length;
        this._renderEventsList();
        break;
    }
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }
    this._tripInfoComponent = new TripInfoView(this._getEvents(true));
    renderCustomElement(this._tripMainElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost() {
    if (this._tripCostComponent !== null) {
      remove(this._tripCostComponent);
      this._tripCostComponent = null;
    }
    this._tripCostComponent = new TripCostView(this._getEvents(true));
    renderCustomElement(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    renderCustomElement(this._tripEventsElement, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    renderCustomElement(this._tripEventsElement, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);

    eventPresenter.init(event);
    this._eventsPresenters[event.id] = eventPresenter;
  }

  _renderEvents() {
    const events = this._getEvents();
    for (let i = 0; i < events.length; i++) {
      this._renderEvent(events[i]);
    }
  }

  _renderNoEvents() {
    hideListStyleLine();
    renderCustomElement(this._tripEventsElement, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    renderCustomElement(this._tripEventsElement, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearEventsList({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    Object.values(this._eventsPresenters).forEach((presenter) => presenter.destroy());
    this._eventsPresenters = {};

    remove(this._sortComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderEventsList() {
    if (this._isLoading) {
      this._renderLoading();
      hideListStyleLine();
      return;
    }

    if (this._eventsCount === 0) {
      this._renderNoEvents();
    } else {
      remove(this._noEventComponent);

      showListStyleLine();

      this._renderTripInfo();
      this._renderTripCost();
      this._renderSort();
      this._renderList();
      this._renderEvents();
    }
  }
}
