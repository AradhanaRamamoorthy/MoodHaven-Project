import { reviews, places } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

async function getCollections() {
  const reviewsCollection = await reviews();
  const placesCollection = await places();

  return {
    reviews: reviewsCollection,
    places: placesCollection,
  };
}

const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

async function validateReviewData(userId, placeId, rating) {
  if (!userId || !placeId || rating === undefined) {
    throw new Error('Missing required fields (userId, placeId, or rating).');
  }

  if (typeof userId !== 'string' || typeof placeId !== 'string') {
    throw new Error('userId and placeId must be strings.');
  }

  const trimmedUserId = userId.trim();
  const trimmedPlaceId = placeId.trim();

  if (!isValidObjectId(trimmedUserId) || !isValidObjectId(trimmedPlaceId)) {
    throw new Error('Invalid userId or placeId.');
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('Rating must be a number between 1 and 5.');
  }

  const { places } = await getCollections();
  const place = await places.findOne({ _id: new ObjectId(trimmedPlaceId) });

  if (!place) {
    throw new Error('Place not found.');
  }

  if (!place.placeName || typeof place.placeName !== 'string') {
    throw new Error('Place name is invalid or missing.');
  }
}



export { getCollections, validateReviewData };
