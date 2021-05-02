import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDuration = (event) => {
  const startDate = dayjs(event.startDate);
  const endDate = dayjs(event.endDate);

  const difference = endDate.diff(startDate);

  let minutes = dayjs.duration(difference).minutes();
  minutes = minutes > 9 ? minutes : `0${minutes}`;

  let hours = dayjs.duration(difference).hours();
  hours = hours > 9 ? hours : `0${hours}`;

  const months = dayjs.duration(difference).months();
  let days = dayjs.duration(difference).days();
  days = days + (months * 30);
  days = days > 9 ? days : `0${days}`;

  if (endDate.diff(startDate, 'minute') < 60) {
    return `${minutes}M`;
  } else if (endDate.diff(startDate, 'hour') < 24) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${days}D ${hours}H ${minutes}M`;
  }
};

export const sortEventsByDateUp = (eventA, eventB) => {
  return dayjs(eventA.startDate).valueOf() - dayjs(eventB.startDate).valueOf();
};

export const sortEventsByPriceDown = (eventA, eventB) => {
  return dayjs(eventB.price).valueOf() - dayjs(eventA.price).valueOf();
};

export const sortEventsByDurationDown = (eventA, eventB) => {
  const eventADuration = dayjs(eventA.endDate).diff(dayjs(eventA.startDate));
  const eventBDuration = dayjs(eventB.endDate).diff(dayjs(eventB.startDate));
  return eventBDuration - eventADuration;
};
