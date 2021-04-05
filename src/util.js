import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const formatDuration = (duration) => {
  let days;
  let hours;
  let minutes;

  if (duration < 60) {
    return `${duration}M`;
  } else if (duration < 60 * 24) {
    hours = Math.floor((duration / 60)).toString();
    hours = hours.length > 1 ? hours : `0${hours}`;

    minutes = (duration % 60).toString();
    minutes = minutes.length > 1 ? minutes : `0${minutes}`;

    return `${hours}H ${minutes}M`;
  } else {
    days = Math.floor((duration / (60 * 24))).toString();
    days = days.length > 1 ? days : `0${days}`;

    hours = Math.floor((duration % (60 * 24) / 60)).toString();
    hours = hours.length > 1 ? hours : `0${hours}`;

    minutes = (duration % (60 * 24) % 60).toString();
    minutes = minutes.length > 1 ? minutes : `0${minutes}`;

    return `${days}D ${hours}H ${minutes}M`;
  }
};

export const isArrayEmpty = (array) => {
  return !array.length;
};

export const isStringEmpty = (string) => {
  return !string.length;
};
