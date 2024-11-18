import { Router } from 'express';
const router = Router();
import { moodsData } from '../data/index.js';
import helpers from '../helpers.js';

router.route('/moodpage')
    .get(async(req,res) => {
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
router.route('/activitypage')
    .post(async(req,res) => {
    const usermood = req.body.usermood;
    try
    { //Should be a render error call 
        if(!usermood){
            return res
                .status(400)
                .json({status : 400, error : "No mood is selected"});
            }
        let moodSelected = await moodsData.getMoodByName(usermood);
        if(!moodSelected) {
            return res.status(404).json({status : 404, error : "Mood not found"});
        }
        let associated_Interests = moodSelected.interest;

        //Should be rendered for the interest page
        return res.json(associated_Interests);
    }
    catch(e)
    {
        return res.status(500).json({ status: 500, error: e });
    }
    });
export default router; 