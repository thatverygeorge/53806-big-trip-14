import {MenuItem, UpdateType, FilterType} from './const.js';
import {RenderPosition, renderCustomElement, remove} from './utils/render.js';
import {hideListStyleLine} from './utils/common.js';
import {sortEventsByDateUp} from './utils/event.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import FilterPresenter from './presenter/filter.js';
import EventsListPresenter from './presenter/events-list.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic k8buZ9Gca8GXk5H';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const navigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteMenuComponent = new SiteMenuView();

const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);
filterPresenter.init();

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const pageMain = document.querySelector('.page-main');
const tripEventsElement = pageMain.querySelector('.trip-events');

const buttonNew = document.querySelector('.trip-main__event-add-btn');

const eventsListPresenter = new EventsListPresenter(tripMainElement, tripEventsElement, buttonNew, eventsModel, filterModel, offersModel, destinationsModel, api);
eventsListPresenter.init();

buttonNew.addEventListener('click', (evt) => {
  evt.preventDefault();

  eventsListPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  eventsListPresenter.init();

  eventsListPresenter.createEvent();
});

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.EVENTS:
      eventsListPresenter.init();
      filterPresenter.init();
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.EVENTS);
      tripEventsElement.classList.remove('trip-events--hidden');
      break;
    case MenuItem.STATS:
      eventsListPresenter.destroy();
      filterPresenter.disableFilters();
      statisticsComponent = new StatsView(eventsModel.getEvents());
      renderCustomElement(tripEventsElement, statisticsComponent, RenderPosition.AFTEREND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      hideListStyleLine();
      tripEventsElement.classList.add('trip-events--hidden');
      break;
  }
};

renderCustomElement(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

Promise
  .all([
    api.getEvents(),
    api.getDestinations(),
    api.getOffers(),
  ])
  .then(([events, destinations, offers]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    eventsModel.setEvents(UpdateType.INIT, events.slice().sort(sortEventsByDateUp));
  });
