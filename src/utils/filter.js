import dayjs from 'dayjs';
import {FilterType} from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events
    .filter((event) => dayjs(event.startDate).isSame(dayjs(), 'minute') || dayjs(event.startDate).isAfter(dayjs(), 'minute')),
  [FilterType.PAST]: (events) => events
    .filter((event) => dayjs(event.endDate).isBefore(dayjs(), 'minute')),
};
