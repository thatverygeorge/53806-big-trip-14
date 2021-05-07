const containers = document.querySelectorAll('.page-body__container');

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

export const isOnline = () => {
  return window.navigator.onLine;
};
