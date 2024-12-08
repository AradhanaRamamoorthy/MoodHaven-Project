import {Router} from 'express';
import userDataFunctions from '../data/Users.js';
import {users, allInterests} from '../config/mongoCollections.js';
import passport from 'passport';
const router = Router();


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
    
            const email = req.user.email.trim();

            const user = await usersCollection.findOne({ email: email.trim() });
            if (!user.recentVisit) {
                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { recentVisit: new Date() } }
                );
                return res.status(200).redirect('/profileSetup');
            } else {
                return res.status(200).redirect('/moods/moodpage');
            }    
    })

router
    .route('/logout')
    .get((req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/')
        })
    })


export default router;