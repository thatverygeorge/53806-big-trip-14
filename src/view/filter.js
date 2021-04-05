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
            <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name} &nbsp; ${filter.count}</label>
          </div>`;
};

export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};
