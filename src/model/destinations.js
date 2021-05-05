import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();

    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinationByName(nameToGetBy) {
    return this._destinations.find((destination) => destination.name === nameToGetBy);
  }

  getDestinationsNames() {
    return this._destinations.map((destination) => destination.name);
  }

  static adaptToClient(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        photos: destination.pictures,
      },
    );

    delete adaptedDestination.pictures;

    return adaptedDestination;
  }
}
