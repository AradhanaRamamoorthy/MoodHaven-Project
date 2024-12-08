import {Router} from 'express';
const router = Router();
import { placesData } from '../data/index.js';
import { users } from '../config/mongoCollections.js';
import helpers from '../helpers.js';
import { ObjectId } from 'mongodb';

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
      return res.redirect('/login');
  }
  next();
}

router.post('/location', async (req, res) => {
    const { latitude, longitude, activity } = req.body;
    if(!latitude || !longitude) {
      res.status(400).json({ error: 'Invalid location data.' });
    }
    if(!activity) {
      res.status(400).json({ error: 'Activity is required.' });
    }
    try {
      res.status(200).json({ message: 'Location and activity received successfully' });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
.route('/placepage/:activity')
.get(isAuthenticated, async (req, res) => {
    const activity = req.params.activity;
    const userId = req.session.user?._id;
    if (!activity) {
      return res.status(400).send('Activity is required.');
    }
    if (!userId) {
      console.log('User ID not found in session.');
    } else {
      console.log('User ID:', userId);
    }

    try {
       const places = await placesData.getPlacesByActivities(activity);
       if (userId) {
        const userCollection = await users();
        await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { 
              $set: { searched: true, searchedPlaces: places }, 
            }
        );
      }
       res.render('users/placepage', {places: places , layout : 'mainMood'});
    } catch (error) {
      console.error('Error updating user or fetching places:', error);
      res.status(500).send('Cannot load the page.');
    }
  });

router
 .route('/reviewpage')
 .get(isAuthenticated, async (req, res) => {
   try {
     const userId = req.session.user?._id;
     const usersCollection = await users();
     const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

     if (!user || !user.searchedPlaces) {
       return res.status(404).render('error', { layout: 'main', title: 'Error', message: 'No searched places found.' });
     }

     res.render('users/review', {
       layout: 'mainReview',
       title: 'Review',
       places: user.searchedPlaces,
       userId: userId, 
     });
   } catch (error) {
     console.error('Error fetching review page:', error);
     res.status(500).render('error', { layout: 'main', title: 'Error', message: 'Internal server error.' });
   }
 });



  
export default router;