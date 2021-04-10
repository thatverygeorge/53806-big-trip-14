import {EVENTS_COUNT} from './const.js';
import TripInfoView from './view/trip-info.js';
import SiteMenuView from './view/site-menu.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filter.js';
import SortView from './view/sort.js';
import EventsListView from './view/events-list.js';
import EventFormEditView from './view/event-form-edit.js';
import EventView from './view/event.js';
import NoEventView from './view/no-event.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter';
import {renderCustomElement, RenderPosition, isArrayEmpty} from './util.js';
import dayjs from 'dayjs';

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((eventA, eventB) => dayjs(eventA.startDate).valueOf() - dayjs(eventB.startDate).valueOf());

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
renderCustomElement(navigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
renderCustomElement(filterElement, new FiltersView(generateFilter(events)).getElement(), RenderPosition.BEFOREEND);

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');

const renderEvent = (eventsList, event) => {
  const eventComponent = new EventView(event);
  const eventFormEditCopmponent = new EventFormEditView(event);

  const replaceEventToForm = () => {
    eventsList.replaceChild(eventFormEditCopmponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventsList.replaceChild(eventComponent.getElement(), eventFormEditCopmponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventFormEditCopmponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  eventFormEditCopmponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  renderCustomElement(eventsList, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

if (isArrayEmpty(events)) {
  renderCustomElement(tripEventsElement, new NoEventView().getElement(), RenderPosition.BEFOREEND);
} else {
  const tripInfoComponent = new TripInfoView(events);
  renderCustomElement(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
  renderCustomElement(tripInfoComponent.getElement(), new TripCostView(events).getElement(), RenderPosition.BEFOREEND);

  renderCustomElement(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

  const tripEventsListComponent = new EventsListView();
  renderCustomElement(tripEventsElement, tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    renderEvent(tripEventsListComponent.getElement(), events[i]);
  }
}
