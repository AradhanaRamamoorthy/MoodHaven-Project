import {Router} from 'express';
const router = Router();
import { placesData } from '../data/index.js';
import userDataFunctions from '../data/Users.js';
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
    const userId = req.session.user?._id;
    if (!userId) {
      res.status(400).json({ error: 'UserId is not found' });
    }
    if(!latitude || !longitude) {
      res.status(400).json({ error: 'Invalid location data.' });
    }
    if(!activity) {
      res.status(400).json({ error: 'Activity is required.' });
    }
    try {
      const update_User_location = await userDataFunctions.updateUserLocation(userId, latitude, longitude);
      res.status(200).json({ message: 'Location and activity received successfully' });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
.route('/placepage/:activity')
.get(isAuthenticated, async (req, res) => {
    const activity = req.params.activity;
    const userId = req.session.user._id;
    if (!activity) {
      return res.status(400).send('Activity is required.');
    }
    try {
       const places = await placesData.getPlacesByActivities(activity);
        const userCollection = await users();
        await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { 
              $set: { searched: true, searchedPlaces: places }, 
            }
        );
        const user_details = await userDataFunctions.getUserById(userId);
        const user_name = `${user_details.firstName} ${user_details.lastName}`;
        if(!places || places.length === 0){
          return res.status(404).render('users/placepage', {
              title : 'Place Page',
              errors: 'Place not found!',
              hasErrors: true,
            });
          }
          for (let place of places) {
            let place_data = await placesData.getCommentsByPlaceId(place._id.toString());
            place.comments = place_data ? place_data.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
        }
        res.render('users/placepage', {
          title : 'Places Page',
          places: places.map(place => ({ ...place, user_name })) , 
          layout : 'places'
        });
      
    } catch (error) {
      console.error('Error updating user or fetching places:', error);
      res.status(500).send('Cannot load the page.');
    }
  });

  
  router.post('/toggleLike', async (req, res) => {
    const { placeId, liked } = req.body;
    const usersCollection = await users();
    const userId = req.session.user?._id;

    console.log("placeId , liked , userId : " , placeId , liked , userId);
    try {
    
      const place = await placesData.getPlaceById(placeId);
      if (!place) {
        return res.status(404).json({ success: false, message: 'Place not found' });
      }
  
     
      if (userId) {
        const usersCollection = await users();
  
        if (liked) {
         
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { savedPlaces: placeId } } 
          );
        } else {
          
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { savedPlaces: placeId } } 
          );
        }
      }
      
    
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

    


  router.post('/placepage/:place_Id/comments', async(req,res) => {
    let place_Id = req.params.place_Id;
    let { comment_Text, user_name } = req.body; 
    comment_Text = comment_Text.trim();
    user_name = user_name.trim();
    if (!comment_Text || typeof comment_Text !== 'string' || comment_Text.length === 0 || !user_name || typeof user_name !== 'string' || user_name.length === 0) {
      return res.status(400).send('Comment text and user name are required.');
    }

    try
    {
      place_Id = helpers.checkId(place_Id);
      comment_Text = helpers.checkString(comment_Text, "user_comment");
      const place = await placesData.getPlaceById(place_Id);
      if(!place)
      {
        return res.status(404).json({error : "Place not found!"});
      }
      const comment_added = {
        comment_content: comment_Text,
        comment_author: user_name,
        date: new Date().toISOString()
      };
      const updated_place = await placesData.user_comments(place_Id, comment_added);
      res.status(200).json(updated_place.comment);
    }
    catch(e)
    {
      res.status(500).json({error : "Failed to add comment!"});
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