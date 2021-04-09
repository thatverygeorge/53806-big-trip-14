import {EVENTS_COUNT} from './const.js';
import TripInfoView from './view/trip-info.js';
import SiteMenuView from './view/site-menu.js';
import TripCostView from './view/trip-cost.js';
import FiltersView from './view/filter.js';
import SortView from './view/sort.js';
import EventsListView from './view/events-list.js';
import EventFormEditView from './view/event-form-edit.js';
import EventView from './view/event.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter';
import {renderCustomElement, RenderPosition} from './util.js';
import dayjs from 'dayjs';

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((eventA, eventB) => dayjs(eventA.startDate).valueOf() - dayjs(eventB.startDate).valueOf());

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
renderCustomElement(tripMainElement, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
renderCustomElement(navigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

const tripCostElement = siteHeaderElement.querySelector('.trip-info');
renderCustomElement(tripCostElement, new TripCostView(events).getElement(), RenderPosition.BEFOREEND);

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
renderCustomElement(filterElement, new FiltersView(generateFilter(events)).getElement(), RenderPosition.BEFOREEND);

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');
renderCustomElement(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const tripEventsListComponent = new EventsListView();
renderCustomElement(tripEventsElement, tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

const renderEvent = (eventsList, event) => {
  const eventComponent = new EventView(event);
  const eventFormEditCopmponent = new EventFormEditView(event);

  const replaceEventToForm = () => {
    eventsList.replaceChild(eventFormEditCopmponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventsList.replaceChild(eventComponent.getElement(), eventFormEditCopmponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEventToForm();
  });

  eventFormEditCopmponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });

  renderCustomElement(eventsList, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < EVENTS_COUNT; i++) {
  renderEvent(tripEventsListComponent.getElement(), events[i]);
}
