import {Router} from 'express';
const router = Router();
import userDataFunctions from '../data/Users.js';
import {users} from '../config/mongoCollections.js';
import { allInterests } from "../config/mongoCollections.js";
import { interestData } from '../data/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {ObjectId} from 'mongodb';

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

router
    .route('/signup')
    .get(async (req, res) => {
        try {
            res.render('./users/signup', {
                layout: 'login',
                title: 'Signup'
            }); 
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) =>{
        const {firstName, lastName, email, password, confirmPassword} = req.body;
        try{
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords are not matching.' });
            } 
            const usersCollection = await users();
            const existingUser = await usersCollection.findOne({ email: email.trim() });
            
            if(existingUser){
                return res.status(400).json({ error: 'User already exists with same email.' });
            }

            else{
                await userDataFunctions.addUser(firstName, lastName, email, password);
                return res.status(200).json({ redirect: '/' });
            }
        } catch (e) {
            res.status(500).json({error: e});
        }
    });

router
    .route('/')
    .get(async (req, res) => {
        try {
            res.render('./users/login', {
                layout: 'login',
                title: 'Login'
            }); 
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {email, password} = req.body;
        const usersCollection = await users();
        const user = await usersCollection.findOne({ email: email.trim() });
        try {
            if(!email || !password ){
                return res.status(400).json({ error: 'Both email and password are required.' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            if (user.recentVisit === null) {
                await usersCollection.updateOne(
                     { _id: user._id },
                     { $set: { recentVisit: new Date() } }
                 );
            }
                req.session.user = { _id: user._id.toString(), email: user.email };
                // const interestCollection = await allInterests();
                // const interests = await interestCollection.find({}).toArray();
                // const interestNames = interests.map(interest => ({
                //     interestName: interest.interestName
                // }));

                // return res.render('./users/home', {
                //     layout: 'main',
                //     title: 'Home'
                //     //interests: interestNames
                // });
                //return res.status(200).json({ redirect: '/profile-setup' });
         if (user.searched) {
            return res.status(200).json({ redirect: '/places/reviewpage' });
         } else {
            return res.status(200).json({ redirect: '/moods/moodpage' });
         }
             //Set the session for the successful login:
        //   req.session.user = { id: user._id, email: user.email };
        //   return res.status(200).json({ redirect: '/moods/moodpage' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router 
    .route('/profileSetup')
    .get(isAuthenticated, async (req, res) => {
        try {
            const interestCollection = await allInterests();
            const interests = await interestCollection.find({}).toArray();
            const interestNames = interests.map(interest => ({
                interestName: interest.interestName,
            }));

            res.render('./users/home', {
                layout: 'main',
                title: 'Complete Your Profile',
                interestNames,
            });
        } catch (error) {
            console.error('Error fetching interests:', error);
            res.status(500).send('Internal Server Error');
        }
    })
    .post(isAuthenticated, async (req, res) => {
        try {
            const { bio, interests } = req.body;
            console.log(interests);
            const user = req.session.user;

            if (!user) {
                return res.redirect('/login');
            }

            const usersCollection = await users();
            const updateData = {};
            if (bio) updateData.bio = bio;
            if (interests) updateData.interests = Array.isArray(interests) ? interests : [interests];
            console.log(updateData)
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(user.id) },
                { $set: updateData }
            );

            if (result.modifiedCount === 0) {
                throw new Error('No data updated, user may not exist or no changes made.');
            }

            res.redirect('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).render('./users/home', {
                layout: 'main',
                title: 'Complete Your Profile',
                hasError: true,
                error: 'Unable to update your profile. Please try again.',
                bio: req.body.bio || '',
                selectedInterests: req.body.interests || [],
            });
        }
    });

    router
    .route('/updateProfile')
    .get( async (req, res) => {
        try {
            console.log(req.session.user)
            const user = req.session.user; 
            console.log(user)
            if (!user) {
                return res.redirect('/login'); 
            }
    
            const usersCollection = await users();
            const userId = req.session.user.id;
            const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });

            const interestCollection = await allInterests();
            const interests = await interestCollection.find({}).toArray();
            const interestNames = interests.map(interest => ({
                interestName: interest.interestName 
             }));
            res.render('./users/updateProfile', {
                layout: 'main',
                title: 'Update Profile',
                interestNames: interestNames,

                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                bio: userData.bio || 'No bio provided.',
                interests: userData.interests || [],  
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }).post(async (req, res) => {
        console.log("inside update Profile : " , req.session.user);
        try {
            const { firstName, lastName, bio, interests } = req.body;
    
            if (!firstName || !lastName) {
                throw 'First name and last name are required.';
            }
    
            const user = req.session.user; 
            if (!user) {
                return res.redirect('/login'); 
            }
            console.log("interests : " , interests);
            const selectedInterests = interests ? interests : [];
            const updatedUser = await profileDataFunction.updateUserProfile(
                user.email,         
                firstName.trim(),   
                bio || null,        
                selectedInterests,     
                lastName.trim()     
            );
            res.redirect('/profile');
        } catch (e) {
           
    
            res.render('./users/profile', {
                layout: 'main',  
                title: 'Profile',  
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                bio: req.body.bio || 'No bio provided.',
                interests: req.body.interests || [],  
            });
        }
    });

    router
    .route('/profile')
    .get(isAuthenticated, async (req, res) => {
        try {
            const usersCollection = await users();
            const userId = req.session.user.id;

            const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (!userData) {
                return res.status(404).send('User not found');
            }

            res.render('./users/profile', {
                layout: 'main',
                title: `${userData.firstName} ${userData.lastName}'s Profile`,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                bio: userData.bio || 'No bio provided.',
                interests: userData.interests || [],
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            res.status(500).send('Error loading profile page.');
        }
    });

router  
    .route('/reset')
    .get(async (req, res) => {
        try {
            res.render('./users/reset', {
                layout: 'main',
                title: 'Forgot password'
                });
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {email} = req.body;
        const usersCollection = await users();
        const user = await usersCollection.findOne({ email: email.trim() });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

        try{
            if(!user){
                res.status(404).json({error: 'User not found'});
            }
            await usersCollection.updateOne(
                { email: email.trim() },
                { $set: { resetToken: resetToken, 
                    resetTokenExpiry: resetTokenExpiry } }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'moodhaven16@gmail.com',
                    pass: 'kuhjoufxcbpvbfve'
                }
            })

            const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
            const mailOptions = {
                from: 'moodhaven16@gmail.com',
                to: email.trim(),
                subject: 'Reset Password',
                text: `Please click on the link to reset your password: ${resetLink}. The link expires in 30 minutes`
            };
            await transporter.sendMail(mailOptions);
            res.render('./users/response', {
                layout: 'main',
                title: 'Forgot password',
                msg: 'Password reset link sent successfully to your email'
            });
        } catch (e){
            res.status(500).json({error: e});
        }
    });

router 
    .route('/reset-password')
    .get(async (req, res) => {
        const {token} = req.query;
        const usersCollection = await users();

        try{
            const user = await usersCollection.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });
            if(!user){
                res.status(400).json({error: 'Invalid or expired token'});
            }

            res.render('./users/reset-password', {
                title: 'Reset Password',
                layout: 'main', 
                token
            })
        } catch(e){
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {token, password, confirmPassword} = req.body;
        const usersCollection = await users();
        try{
            if (password !== confirmPassword) {
                res.render('./users/reset-password', {
                    layout: 'main',
                    title: 'Reset Password',
                    hasError: true,
                    error: "Passwords don't match"
                });
            }

            const user = await usersCollection.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });

            if(!user){
                res.status(400).json({error: 'Invalid or expired token'});
            }

            const hashedPassword = await bcrypt.hash(password.trim(), 10);
            await usersCollection.updateOne(
                {_id: new ObjectId(user._id)},
                {
                    $set: { password: hashedPassword, },
                    $unset: { resetToken: "", resetTokenExpiry: "" },
                }
            );
            res.status(200).render('./users/response', {
                layout: 'main',
                title: 'Reset Password',
                hasResponse: true,
                msg: 'Password reset successfully'
            })
        } catch(e){
            res.status(500).json({error: e});
        }
    })

export default router;  
