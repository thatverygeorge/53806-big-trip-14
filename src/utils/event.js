import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const formatDuration = (duration) => {
  let days = dayjs.duration(duration).days();
  let hours = dayjs.duration(duration).hours();
  let minutes = dayjs.duration(duration).minutes();

  days = days > 9 ? days : `0${days}`;
  hours = hours > 9 ? hours : `0${hours}`;
  minutes = minutes > 9 ? minutes : `0${minutes}`;

  if (hours === 0 || hours === '00') {
    return `${minutes}M`;
  } else if (days === 0 || days === '00') {
    return `${hours}H ${minutes}M`;
  }

  return `${days}D ${hours}H ${minutes}M`;
};

export const getDuration = (event) => {
  const startDate = dayjs(event.startDate);
  const endDate = dayjs(event.endDate);

  const difference = endDate.diff(startDate);

  return formatDuration(dayjs.duration(difference).asMilliseconds());

  // let minutes = dayjs.duration(difference).minutes();
  // minutes = minutes > 9 ? minutes : `0${minutes}`;

  // let hours = dayjs.duration(difference).hours();
  // hours = hours > 9 ? hours : `0${hours}`;

  // let days = dayjs.duration(difference).days();
  // days = days > 9 ? days : `0${days}`;

  // if (endDate.diff(startDate, 'minute') < 60) {
  //   return `${minutes}M`;
  // } else if (endDate.diff(startDate, 'hour') < 24) {
  //   return `${hours}H ${minutes}M`;
  // }

  // return `${days}D ${hours}H ${minutes}M`;
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
