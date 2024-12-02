import { reviews, places } from '../config/mongoCollections.js';

async function getCollections() {
  return {
    reviews: await reviews(),
    places: await places(),
  };
}

export { getCollections };
