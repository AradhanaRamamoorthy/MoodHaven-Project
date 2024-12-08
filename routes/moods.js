import { Router } from 'express';
const router = Router();
import { moodsData } from '../data/index.js';
import helpers from '../helpers.js';

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router
    .route('/moodpage')
    .get(isAuthenticated, async(req,res) => {
        try{
            let moodList = await moodsData.getAllMoods();
            return res.render('./users/moodQuestionnaire', 
            {
                layout : 'mainMood',
                title : 'Moods Page',
                moods : moodList
            });
        }
        catch(e)
        {
            return res.status(500).json({status : 500, error : e});
        }
    });
    
router
    .route('/activitypage')
    .post(isAuthenticated, async (req, res) => {
        const usermood = req.body.usermood; 

        try {
            if (!usermood) {
                return res.status(400).render('errorPage', { 
                    status: 400, 
                    error: "No mood is selected" 
                }); 
            }

            const moodSelected = await moodsData.getMoodByName(usermood);
            if (!moodSelected) {
                return res.status(404).render('errorPage', { 
                    status: 404, 
                    error: "Mood not found" 
                });
            }

            const associated_Interests = moodSelected.interest;
            return res.status(200).render('./users/interests', {
                selectedMood: moodSelected.moodName,
                interests: associated_Interests,
                layout: 'mainInterests'
            });
        } catch (e) {
            return res.status(500).render('errorPage', { 
                status: 500, 
                error: "Internal Server Error. Please try again later." 
            });
        }
    });     
export default router; 