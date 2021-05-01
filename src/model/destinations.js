import Observer from '../utils/observer.js';
import {generateDestination} from '../mock/event.js';

export default class Destinations extends Observer {
  constructor() {
    super();

    this._destinations = [];
  }

  getDestinationByName(nameToGetBy) {
    return this._destinations.find((destination) => destination.name === nameToGetBy);
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    this._destinations = destinations.map((destination) => generateDestination(destination));
  }
}
