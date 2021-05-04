import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const makeItemsUnique = (items) => {
  return [...new Set(items)];
};

export const getEventsTypes = (events) => {
  return events.map((event) => event.type.toUpperCase());
};

export const countPriceByType = (events, type) => {
  const eventsOfType = events.filter((event) => event.type === type.toLowerCase());
  return {
    label: type,
    data: eventsOfType.reduce((accumulator, event) => accumulator + event.price, 0),
  };
};

export const countEventsTypes = (events, type) => {
  return {
    label: type,
    data: events.filter((event) => event.type === type.toLowerCase()).length,
  };
};

export const countDurationByType = (events, type) => {
  const eventsOfType = events.filter((event) => event.type === type.toLowerCase());

  let duration = 0;

  eventsOfType.forEach((event) => {
    const startDate = dayjs(event.startDate);
    const endDate = dayjs(event.endDate);

    const difference = endDate.diff(startDate);

    if (duration === 0) {
      duration = dayjs.duration(difference);
    } else {
      duration = duration.add(dayjs.duration(difference));
    }
  });

  return {
    label: type,
    data: duration.asMilliseconds(),
  };
};

export const getSortedChartData = (dataToSort) => {
  const sorted = dataToSort.sort((a, b) => b.data - a.data);
  const labels = sorted.map((item) => item.label);
  const data = sorted.map((item) => item.data);

  return [labels, data];
};
