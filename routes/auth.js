import {Router} from 'express';
import userDataFunctions from '../data/Users.js';
import {users, allInterests} from '../config/mongoCollections.js';
import passport from 'passport';
const router = Router();
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';


router
    .route('/google')
    .get(passport.authenticate('google', {scope: ['profile', 'email']}));

router
    .route('/google/callback')
    .get(passport.authenticate('google', 
        {failureRedirect: '/'}), 
        async (req, res) =>{
            if (req.user) {
                req.session.user = req.user; 
              }
            const usersCollection = await users();
            //console.log(req.session.user)
            if (!req.session.user || !req.user.email) {
                return res.status(400).json({ error: 'User email not found' });
            }
    
            let email = req.user.email.trim();
            email = helpers.checkEmail(email, 'email')
            const user = await usersCollection.findOne({ email: email });
            if (user.recentVisit === null || user.interests.length === 0) {
                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { recentVisit: new Date().toISOString() } }
                );
                return res.status(200).redirect('/profileSetup');
            }
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { recentVisit: new Date().toISOString() } }
            );
            if (user.searched) {
                return res.status(200).redirect('/places/reviewpage');
            } else {
                return res.status(200).redirect('/moods/moodpage');
            }
    })

router
    .route('/logout')
    .get(async (req, res, next) => {
        const user = req.session.user;
        req.logout(async (err) => {
            if (err) { return next(err); }
            const usersCollection = await users();
            await usersCollection.updateOne(
                {_id: new ObjectId(user._id)},
                { $unset: { temporaryLocation: {} } }
            );
            res.redirect('/')
        })
    })


export default router;