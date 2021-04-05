import dayjs from 'dayjs';
import {formatDate} from '../util.js';

const getTripStartAndEndDates = (events) => {
  let startDate = events[0].startDate;
  let endDate = events[events.length - 1].endDate;

  endDate = formatDate(startDate, 'MMM') === formatDate(endDate, 'MMM') ? formatDate(endDate, 'DD') : formatDate(endDate, 'MMM DD');
  startDate = formatDate(startDate, 'MMM DD');

  return [startDate, endDate];
};

const getTripInfoTitle = (destinationsNames) => {
  const uniqueDestinationsNames = Array.from(new Set(destinationsNames));
  const firstDestinationName = destinationsNames[0];
  const lastDestinationName = destinationsNames[destinationsNames.length - 1];
  const middleDestinationName = uniqueDestinationsNames[1] !== lastDestinationName ? uniqueDestinationsNames[1] : uniqueDestinationsNames[2];

  switch (uniqueDestinationsNames.length) {
    case 1:
      return firstDestinationName;
    case 2:
      return `${firstDestinationName} &mdash; ${lastDestinationName}`;
    case 3:
      return `${firstDestinationName} &mdash; ${middleDestinationName} &mdash; ${lastDestinationName}`;
    default:
      return `${firstDestinationName} &mdash; ... &mdash; ${lastDestinationName}`;
  }
};

export const createTripInfoTemplate = (events) => {
  events = events.sort((eventA, eventB) => dayjs(eventA.startDate).valueOf() - dayjs(eventB.startDate).valueOf());
  const [startDate, endDate] = getTripStartAndEndDates(events);
  const destinationsNames = events.map((currentEvent) => currentEvent.destination.name);
  const tripInfoTitle = getTripInfoTitle(destinationsNames);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${tripInfoTitle}</h1>

              <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
            </div>
          </section>`;
};
