import {Router} from 'express';
import passport from 'passport';
const router = Router();

router
    .route('/google')
    .get(passport.authenticate('google', {scope: ['profile', 'email']}));

router
    .route('/google/callback')
    .get(passport.authenticate('google', 
        {failureRedirect: '/'}), 
        (req, res) =>{
            res.render('./users/home', {
                layout: 'main',
                title: 'Home'
            }); 
    })

export default router;