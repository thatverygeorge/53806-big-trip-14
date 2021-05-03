const containers = document.querySelectorAll('.page-body__container');

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isArrayEmpty = (array) => {
  return !array.length;
};

export const isStringEmpty = (string) => {
  return !string.length;
};

export const hideListStyleLine = () => {
  Array.from(containers).forEach((container) => container.classList.add('page-body__container--without-line'));
};

export const showListStyleLine = () => {
  Array.from(containers).forEach((container) => container.classList.remove('page-body__container--without-line'));
};
