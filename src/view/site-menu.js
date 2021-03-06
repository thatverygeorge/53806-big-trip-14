import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

export const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" id="${MenuItem.EVENTS}" href="#">Table</a>
            <a class="trip-tabs__btn" id="${MenuItem.STATS}" href="#">Stats</a>
          </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuItem(menuItem) {
    this.getElement().querySelector('.trip-tabs__btn--active').classList.remove('trip-tabs__btn--active');

    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'A') {
      this._callback.menuClick(evt.target.id);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
