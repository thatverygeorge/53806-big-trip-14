import dayjs from 'dayjs';
import {FilterType} from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events
    .filter((event) => dayjs(event.startDate).isSame(dayjs(), 'day') ||
      dayjs(event.startDate).isAfter(dayjs(), 'day') ||
      (dayjs(event.startDate).isBefore(dayjs(), 'day') && dayjs(event.endDate).isAfter(dayjs(), 'day'))),
  [FilterType.PAST]: (events) => events
    .filter((event) => dayjs(event.endDate).isBefore(dayjs(), 'day') ||
      (dayjs(event.startDate).isBefore(dayjs(), 'day') && dayjs(event.endDate).isAfter(dayjs(), 'day'))),
};
