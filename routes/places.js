import {Router} from 'express';
const router = Router();
import { placesData } from '../data/index.js';
import helpers from '../helpers.js';


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

  router.get('/placepage/:activity', async (req, res) => {
    let selected_Activity = req.params.activity;
    try //New
    {
      selected_Activity = helpers.checkString(selected_Activity);
    }
    catch(e)
    {
      return res.status(400).render('users/interests',
        {
        title : 'Interest Page',
        errors: 'You must select an activity!',
        hasErrors: true,
        selected_activity : selected_Activity
        });
    } 
    try
    {
        const places = await placesData.getPlacesByActivities(selected_Activity);
        if(!places || places.length === 0){
        return res.status(404).render('users/placepage', {
            title : 'Place Page',
            errors: 'Place not found!',
            hasErrors: true,
          });
        }
    return res.status(200).render('users/placepage', {
         places: places , 
         layout : 'mainMood'
      });
    } 
    catch(e) {
      res.status(500).json({error : e});
    }
  });

  
export default router;