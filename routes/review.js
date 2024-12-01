import { Router } from 'express';
import { reviews, places, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = Router();
const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;
router.post('/review', async (req, res) => {
  const { userId, placeId, rating, savePlace } = req.body;

  if (!userId || !placeId || !rating) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!isValidObjectId(userId) || !isValidObjectId(placeId)) {
    return res.status(400).json({ error: 'Invalid userId or placeId.' });
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
  }

  try {
    const reviewsCollection = await reviews();
    const placesCollection = await places();
    const usersCollection = await users();
    const place = await placesCollection.findOne({ _id: new ObjectId(placeId) });
    if (!place) {
      return res.status(404).json({ error: 'Place not found.' });
    }
    const placeReviewDoc = await reviewsCollection.findOne({ placeId: new ObjectId(placeId) });

    if (!placeReviewDoc) {
      const newReviewDoc = {
        placeId: new ObjectId(placeId),
        reviews: [
          {
            userId: new ObjectId(userId),
            rating,
          },
        ],
        avgRating: rating,
      };

      await reviewsCollection.insertOne(newReviewDoc);
    } else {
      const existingReviewIndex = placeReviewDoc.reviews.findIndex(
        (review) => String(review.userId) === userId
      );

      if (existingReviewIndex !== -1) {
        placeReviewDoc.reviews[existingReviewIndex].rating = rating;
      } else {
        placeReviewDoc.reviews.push({
          userId: new ObjectId(userId),
          rating,
        });
      }
      const avgRating =
        placeReviewDoc.reviews.reduce((acc, review) => acc + review.rating, 0) /
        placeReviewDoc.reviews.length;
      await reviewsCollection.updateOne(
        { placeId: new ObjectId(placeId) },
        { $set: { reviews: placeReviewDoc.reviews, avgRating } }
      );
    }
    if (savePlace) {
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $addToSet: {
            savedPlaces: {
              placeId: new ObjectId(placeId),
              placeName: place.placeName, 
            },
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        console.log(`User ${userId} already saved the place.`);
      }
    }

    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'An error occurred while submitting the review.' });
  }
});

export default router;
