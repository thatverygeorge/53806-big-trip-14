import {createCustomElement} from '../util.js';

const createFilterItemTemplate = (filter, isChecked) => {
  return `<div class="trip-filters__filter">
            <input
              id="filter-${filter.name}"
              class="trip-filters__filter-input
              visually-hidden" type="radio"
              name="trip-filter"
              value="${filter.name}"
              ${isChecked ? 'checked' : ''}
              ${filter.count === 0 ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
          </div>`;
};

export const createFiltersTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filters {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  getElement() {
    if(!this._element) {
      this._element = createCustomElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
