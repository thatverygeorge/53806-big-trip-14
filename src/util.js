import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const renderCustomElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createCustomElement = (template) => {
  const container = document.createElement('div');
  container.innerHTML = template;

  return container.firstChild;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDuration = (startDate, endDate) => {
  dayjs.extend(duration);
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  const difference = endDate.diff(startDate);

  let minutes = dayjs.duration(difference).minutes();
  minutes = minutes > 9 ? minutes : `0${minutes}`;

  let hours = dayjs.duration(difference).hours();
  hours = hours > 9 ? hours : `0${hours}`;

  let days = dayjs.duration(difference).days();
  days = days > 9 ? days : `0${days}`;

  if (endDate.diff(startDate, 'minute') < 60) {
    return `${minutes}M`;
  } else if (endDate.diff(startDate, 'hour') < 24) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${days}D ${hours}H ${minutes}M`;
  }
};

export const isArrayEmpty = (array) => {
  return !array.length;
};

export const isStringEmpty = (string) => {
  return !string.length;
};
