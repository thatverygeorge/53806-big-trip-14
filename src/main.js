import {EVENTS_COUNT} from './const.js';
import SiteMenuView from './view/site-menu.js';
import FiltersView from './view/filter.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter';
import {RenderPosition, renderCustomElement} from './util/render.js';
import EventsListPresenter from './presenter/events-list.js';
import {sortEventsByDateUp} from './util/event.js';

const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort(sortEventsByDateUp);

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
renderCustomElement(navigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
renderCustomElement(filterElement, new FiltersView(generateFilter(events)), RenderPosition.BEFOREEND);

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');

const eventsListPresenter = new EventsListPresenter(tripMainElement, tripEventsElement);
eventsListPresenter.init(events);
