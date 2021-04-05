import {EVENTS_COUNT} from './const.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createEventsListTemplate} from './view/events-list.js';
import {createEventFormEditTemplate} from './view/event-form-edit.js';
import {createEventTemplate} from './view/event.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter';
import dayjs from 'dayjs';

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((eventA, eventB) => dayjs(eventA.startDate).valueOf() - dayjs(eventB.startDate).valueOf());

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
render(tripMainElement, createTripInfoTemplate(events), 'afterbegin');

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
render(navigationElement, createSiteMenuTemplate(), 'beforeend');

const tripCostElement = siteHeaderElement.querySelector('.trip-info');
render(tripCostElement, createTripCostTemplate(events), 'beforeend');

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
render(filterElement, createFilterTemplate(generateFilter(events)), 'beforeend');

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');
render(tripEventsElement, createSortTemplate(), 'beforeend');
render(tripEventsElement, createEventsListTemplate(), 'beforeend');

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');
render(eventsListElement, createEventFormEditTemplate(events[0]), 'beforeend');

for (let i = 1; i < EVENTS_COUNT; i++) {
  render(eventsListElement, createEventTemplate(events[i]), 'beforeend');
}
