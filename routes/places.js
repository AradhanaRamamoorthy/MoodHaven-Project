import {Router} from 'express';
const router = Router();
import { placesData } from '../data/index.js';


router.post('/location', async (req, res) => {
    const { latitude, longitude, activity } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Invalid location data.' });
    }
    if (!activity) {
      return res.status(400).json({ error: 'Activity is required.' });
    }
    try {
      res.status(200).json({ message: 'Location and activity received successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing location.' });
    }
  });

  router.get('/placepage/:activity', async (req, res) => {
    const activity = req.params.activity;
    if (!activity) {
      return res.status(400).send('Activity is required.');
    }
    try {
       const places = await placesData.getPlacesByActivities(activity);
       res.render('users/placepage', {places: places , layout : 'mainMood'});
    } catch (error) {
      res.status(500).send('Cannot load the page.');
    }
  });

  
export default router;