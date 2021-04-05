import dayjs from 'dayjs';

const eventToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events
    .filter((event) => dayjs(event.startDate).isSame(dayjs(), 'minute') || dayjs(event.startDate).isAfter(dayjs(), 'minute')).length,
  past: (events) => events
    .filter((event) => dayjs(event.endDate).isBefore(dayjs(), 'minute')).length,
};

export const generateFilter = (events) => {
  return Object.entries(eventToFilterMap).map(([filterName, eventsCount]) => {
    return {
      name: filterName,
      count: eventsCount(events),
    };
  });
};
