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
  try{
    if(!userId){
      return res.status(400).redirect('/');
    }
    if(!latitude || !longitude){
      res.status(400).json({ error: 'Invalid location data.' });
    }
    if(!activity){
      res.status(400).json({ error: 'Activity is required.' });
    }

    const userCollection = await users();
    const updateUser = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { temporaryLocation: { latitude, longitude}}}
    )
    if (updateUser.matchedCount === 0) {
      console.log('No user found with the given ID.');
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Location updated successfully.'})
  } catch(e){
    res.status(500).json({ error: e });
  }
});

router
.route('/placepage/:activity')
.get(isAuthenticated, async (req, res) => {
    let activity = req.params.activity;
    const userId = req.session.user._id;
    try
    {
      activity = helpers.checkString(activity, "activity");
    }
    catch(e){
      return res.status(400).render('users/interests', {
        title : 'Interest Page',
        errors: 'Activity is not selected to fetch the relevant places!',
        hasErrors: true,
      });
    }
    try {
      const places = await placesData.getPlacesByActivities(activity);
      if(!places || places.length === 0)
        {
         return res.status(404).render('users/placepage', {
           title : 'Place Page',
           errors: 'No places found for this selected activity!',
           hasErrors: true,
         });
        }
      const userCollection = await users();
      const user = await userCollection.findOne({ _id: new ObjectId(userId) });
      if(!user || !user.temporaryLocation){
        return res.status(404).json({ error: 'User not found.' });
      }
      const {latitude, longitude} = user.temporaryLocation;
       
        
        await userCollection.updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            { 
              $set: { searched: true, searchedPlaces: places }, 
            });
        const user_details = await userDataFunctions.getUserById(userId);
        let user_profilePic = `${user_details.profilePic}`;
        if(!user_details)
        {
          return res.status(404).render('users/placepage', {
            title : 'Place Page',
            errors: 'No user found to view the places!',
            hasErrors: true,
          });
        }
        const user_name = `${user_details.firstName} ${user_details.lastName}`;
          for (let place of places) {
            let place_data = await placesData.getCommentsByPlaceId(place._id.toString());
            place.comments = place_data ? place_data.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
        }
        const sortedPlaces = await placesData.sortPlaces(places, latitude, longitude);
        const savedPlaces = user.savedPlaces || [];
        sortedPlaces.forEach(place => {
          place.liked = savedPlaces.includes(place._id.toString());
        });
        if (userId) {
          const userCollection = await users();
          await userCollection.updateOne(
              { _id: new ObjectId(userId) },
              { 
                $set: { searched: true, searchedPlaces: places }, 
              }
          );
        }
        res.status(200).render('users/placepage', {
          title : 'Places Page',
          places: sortedPlaces.map(place => ({ ...place, user_name, user_profilePic })), 
          layout : 'places',
          user: req.session.user
        });
      
    } 
    catch (e) {
      res.status(500).json({error : e});
    }
  });

  
  router
  .route('/toggleLike')
  .post(isAuthenticated, async (req, res) => {
    const { placeId, liked } = req.body;
    const userId = req.session.user?._id;

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

 router.route('/placepage/:place_Id/comments')
  .post(isAuthenticated, async (req, res) => {
    let place_Id = req.params.place_Id;
    let { comment_Text, user_name, user_profilePic } = req.body; 
    const userId = req.session.user._id;
    try
    {
      place_Id = helpers.checkId(place_Id);
      comment_Text = helpers.checkString(comment_Text, "user_comment");
      user_name = helpers.checkString(user_name, "userName");
    }
    catch(e)
    {
      return res.status(400).json({ error: 'Comment values cannot be empty' });
    }
    try
    {
      const place = await placesData.getPlaceById(place_Id);
      if(!place)
      {
        return res.status(404).render('users/placepage', { 
          title: 'Place Page',
          status: 404, 
          error: "No place found for the placeId!" ,
          hasErrors: true
        });
      }
      const comment_added = {
        comment_content: comment_Text,
        comment_author: user_name,
        user_Id: userId,
        user_profilePic: user_profilePic,
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
       return res.status(404).render('error', { layout: 'main', user: req.session.user, title: 'Error', message: 'No searched places found.' });
     }

     res.render('users/review', {
       layout: 'mainReview',
       title: 'Review',
       places: user.searchedPlaces,
       userId: userId, 
       user: req.session.user
     });
   } catch (error) {
     console.error('Error fetching review page:', error);
     res.status(500).render('error', { layout: 'main', user: req.session.user, title: 'Error', message: 'Internal server error.' });
   }
 });



  
export default router;
