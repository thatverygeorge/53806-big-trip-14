import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger} from '../util/common.js';
import {formatDate} from '../util/event.js';

import {
  EVENT_TYPES,
  DESTINATIONS,
  DESCRIPTIONS,
  MAX_NUMBER_OF_SENTENCES,
  MAX_NUMBER_OF_OFFERS
} from '../const.js';

const getRandomDescription = () => {
  const finalDescription = [];
  const descriptionLength = getRandomInteger(1, MAX_NUMBER_OF_SENTENCES);

  while (finalDescription.length !== descriptionLength) {
    DESCRIPTIONS.forEach((description) => {
      if (getRandomInteger(0, 1) && finalDescription.length !== descriptionLength) {
        finalDescription.push(description);
      }
    });
  }

  return `${finalDescription.join('. ')}.`;
};

export const generateDestination = (givenName) => {
  const description = getRandomDescription();
  const name = givenName ? givenName : DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)];

  return {
    description,
    name,
    photos: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: `Rando, photo for ${name} event.`,
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: `Rando, photo for ${name} event.`,
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: `Rando, photo for ${name} event.`,
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: `Rando, photo for ${name} event.`,
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: `Rando, photo for ${name} event.`,
      },
    ],
  };
};

export const generateOffer = (type, isChecked) => {
  switch (type) {
    case 'taxi':
    case 'bus':
    case 'train':
      return {
        title: 'Some offer title',
        price: getRandomInteger(1, 10) * 10,
        isChecked,
      };
    case 'ship':
    case 'transport':
    case 'drive':
      return {
        title: 'Some offer title',
        price: getRandomInteger(1, 10) * 10,
        isChecked,
      };
    case 'flight':
    case 'check-in':
    case 'sightseeing':
    case 'restaurant':
      return {
        title: 'Some offer title',
        price: getRandomInteger(1, 10) * 10,
        isChecked,
      };
  }
};

export const generateEvent = () => {
  const type = EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];
  const startDate = dayjs()
    .subtract(getRandomInteger(0, 2), 'day')
    .subtract(getRandomInteger(0, 5), 'hour')
    .subtract(getRandomInteger(0, 55), 'minute');
  const endDate = dayjs(startDate)
    .add(getRandomInteger(1, 5), 'day')
    .add(getRandomInteger(1, 10), 'hour')
    .add(getRandomInteger(5, 55), 'minute');
  const offers = new Array(getRandomInteger(0, MAX_NUMBER_OF_OFFERS)).fill().map(() => generateOffer(type, Boolean(getRandomInteger(0, 1))));

  return {
    id: nanoid(),
    type,
    price: getRandomInteger(1, 10) * 100,
    startDate: formatDate(startDate, 'YYYY-MM-DDTHH:mm:ss'),
    endDate: formatDate(endDate, 'YYYY-MM-DDTHH:mm:ss'),
    destination: generateDestination(),
    offers,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
