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
            const usersCollection = await users();
            if (!req.user || !req.user.email) {
                return res.status(400).json({ error: 'User email not found' });
            }
    
            const email = req.user.email.trim();

            const user = await usersCollection.findOne({ email: email.trim() });
            if (!user.recentVisit) {
                return res.status(200).redirect('/moods/moodpage');
            } else {
                return res.status(200).redirect('/moods/moodpage');
            }    
            //res.redirect('/moods/moodpage')
            // render('./users/home', {
            //     layout: 'main',
            //     title: 'Home'
            // }); 
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