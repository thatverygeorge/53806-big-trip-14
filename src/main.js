import {EVENTS_COUNT, DESTINATIONS} from './const.js';
import {generateEvent} from './mock/event.js';
import {RenderPosition, renderCustomElement} from './utils/render.js';
import {sortEventsByDateUp} from './utils/event.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import SiteMenuView from './view/site-menu.js';
import FilterPresenter from './presenter/filter.js';
import EventsListPresenter from './presenter/events-list.js';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort(sortEventsByDateUp);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
renderCustomElement(navigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);
filterPresenter.init();

const offersModel = new OffersModel();

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(DESTINATIONS);

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');

const eventsListPresenter = new EventsListPresenter(tripMainElement, tripEventsElement, eventsModel, filterModel, offersModel, destinationsModel);
eventsListPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  eventsListPresenter.createEvent(evt.target);
});
