import { Router } from 'express';
import { interestData } from '../data/index.js';
import helpers from '../helpers.js';

const router = Router();
function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router.get('/:interest/activities', isAuthenticated, async (req, res) => {
    const interestName = req.params.interest;
    
    if (!interestName || typeof interestName !== 'string' || interestName.length === 0) {
        return res.status(400).json({ error: 'Invalid interest parameter. Please provide a valid interest name.' });
    }

    try {
        let activities = await interestData.getActivitiesByInterest(interestName);
        if (activities.length > 0) {
            activities = helpers.checkArray(activities, "selectedActivity");
            res.json(activities); 
        } else {
            res.status(404).json({ message: 'No activities found for this interest.' });
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
