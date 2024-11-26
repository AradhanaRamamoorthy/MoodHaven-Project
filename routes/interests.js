import { Router } from 'express';
import { interestData } from '../data/index.js';  
const router = Router();

router.get('/:interest/activities', async (req, res) => {
    const interestName = req.params.interest;
    try {
        const activities = await interestData.getActivitiesByInterest(interestName);
        if (activities.length > 0) {
            res.json(activities); 
        } else {
            res.status(404).json({ message: 'No activities found for this interest.' });
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/placepage', async (req, res) => {
    const activity = req.body.activity;
    console.log(activity);
    if (!activity) {
        return res.status(400).json({ error: "Invalid or missing activity." });
    }
    res.render('users/placepage', { selectedActivity: activity });
});


export default router;
