import { Router } from 'express';
import { reviews, places, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validateReviewData } from '../data/review.js';

const router = Router();

router.post('/review', async (req, res) => {
  const { userId, placeId, rating, savePlace } = req.body;

  try {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(placeId)) {
      return res.status(400).json({ error: 'Invalid user or place ID.' });
    }

    await validateReviewData(userId, placeId, rating);

    const trimmedUserId = userId.trim();
    const trimmedPlaceId = placeId.trim();
    const reviewsCollection = await reviews();
    const placesCollection = await places();
    const usersCollection = await users();

    const place = await placesCollection.findOne({ _id: new ObjectId(trimmedPlaceId) });
    if (!place) {
      return res.status(404).json({ error: 'Place not found.' });
    }

    const placeReviewDoc = await reviewsCollection.findOne({ placeId: new ObjectId(trimmedPlaceId) });

    if (!placeReviewDoc) {
      const newReviewDoc = {
        placeId: new ObjectId(trimmedPlaceId),
        reviews: [
          {
            userId: new ObjectId(trimmedUserId),
            rating,
          },
        ],
        avgRating: rating,
      };

      await reviewsCollection.insertOne(newReviewDoc);
    } else {
      const existingReviewIndex = placeReviewDoc.reviews.findIndex(
        (review) => String(review.userId) === trimmedUserId
      );

      if (existingReviewIndex !== -1) {
        placeReviewDoc.reviews[existingReviewIndex].rating = rating;
      } else {
        placeReviewDoc.reviews.push({
          userId: new ObjectId(trimmedUserId),
          rating,
        });
      }

      const avgRating =
        placeReviewDoc.reviews.reduce((acc, review) => acc + review.rating, 0) /
        placeReviewDoc.reviews.length;
      await reviewsCollection.updateOne(
        { placeId: new ObjectId(trimmedPlaceId) },
        { $set: { reviews: placeReviewDoc.reviews, avgRating } }
      );
    }

    if (savePlace) {
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(trimmedUserId) },
        {
          $addToSet: {
            savedPlaces: {
              placeId: new ObjectId(trimmedPlaceId),
              placeName: place.placeName,
            },
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(400).json({ error: 'Place already saved by the user.' });
      }
    }

    res.status(200).json({ message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: error.message || 'An error occurred while submitting the review.' });
  }
});

export default router;
