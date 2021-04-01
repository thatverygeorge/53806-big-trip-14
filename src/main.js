import {createTripInfoTemplate} from './view/trip-info.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createEventsListTemplate} from './view/events-list.js';
import {createEventFormEditTemplate} from './view/event-form-edit.js';
import {createEventFormAddTemplate} from './view/event-form-add.js';
import {createEventTemplate} from './view/event.js';

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
render(tripMainElement, createTripInfoTemplate(), 'afterbegin');

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
render(navigationElement, createSiteMenuTemplate(), 'beforeend');

const tripCostElement = siteHeaderElement.querySelector('.trip-info');
render(tripCostElement, createTripCostTemplate(), 'beforeend');

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
render(filterElement, createFilterTemplate(), 'beforeend');

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');
render(tripEventsElement, createSortTemplate(), 'beforeend');
render(tripEventsElement, createEventsListTemplate(), 'beforeend');

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');
render(eventsListElement, createEventFormEditTemplate(), 'beforeend');
render(eventsListElement, createEventFormAddTemplate(), 'beforeend');

for (let i = 0; i < EVENT_COUNT; i++) {
  render(eventsListElement, createEventTemplate(), 'beforeend');
}
