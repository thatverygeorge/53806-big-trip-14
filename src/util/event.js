import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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
