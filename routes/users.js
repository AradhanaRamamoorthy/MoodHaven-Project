import {Router} from 'express';
const router = Router();
import userDataFunctions from '../data/Users.js';
import profileDataFunction from '../data/profile.js'
import {users} from '../config/mongoCollections.js';
import { allInterests } from "../config/mongoCollections.js";
import { interestData } from '../data/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import {ObjectId} from 'mongodb';
import { placesData } from '../data/index.js';
import helpers from '../helpers.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

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
        let {firstName, lastName, email, password, confirmPassword} = req.body;
        try{
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                return res.status(400).json({ error: 'All fields are required.' });
            }
            firstName = helpers.checkString(firstName, 'firstName');
            lastName = helpers.checkString(lastName, 'lastName');
            email = helpers.checkEmail(email, 'email');
            password = helpers.checkString(password, 'password');
            confirmPassword = helpers.checkString(confirmPassword, 'confirmPassword');

            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords are not matching.' });
            } 

            const usersCollection = await users();
            const existingUser = await usersCollection.findOne({ email: email });
            
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
        let {email, password} = req.body;
        try{
            email = helpers.checkEmail(email, 'email');
            password = helpers.checkString(password, 'password');

            if(!email || !password ){
                return res.status(400).json({ error: 'Both email and password are required.' });
            }
        } catch (e) {
            res.status(500).json({error: e});
        }
        const usersCollection = await users();
        const user = await usersCollection.findOne({ email: email });
        try {
            if (!user) {
                return res.status(404).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(404).json({ error: 'Invalid email or password.' });
            }

            req.session.user = { _id: user._id.toString(), email: user.email };
            if (user.recentVisit === null || user.interests.length === 0) {
                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { recentVisit: new Date().toISOString() } }
                );
                return res.status(200).json({ redirect: '/profileSetup'});
            }
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { recentVisit: new Date().toISOString() } }
            );
            if (user.searched) {
                return res.status(200).json({ redirect: '/places/reviewpage' });
            } else {
                return res.status(200).json({ redirect: '/moods/moodpage' });
            }
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
                layout: 'mainProfile',
                title: 'Complete Your Profile',
                interestNames,
                user: req.session.user
            });
        } catch (error) {
            res.status(500).json({ error: e });
        }
    })
    .post(isAuthenticated, async (req, res) => {
        try {
            let { bio, interests } = req.body;
            const user = req.session.user;

                if(typeof bio !== 'string'){
                    throw `Bio must be a string`
                }
                if(bio.length !== 0 && bio.trim().length === 0){
                    throw `Bio can't be a string with just spaces`
                }
        
            interests = helpers.checkInterests(interests, 'interests');
            const updatedUser = await profileDataFunction.completeProfile(user.email, bio, interests);

            res.redirect('/profile');
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router
    .route('/updateProfile')
    .get(isAuthenticated, async (req, res) => {
        try {
            const usersCollection = await users();
            const userId = req.session.user._id;
            const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });

            const interestCollection = await allInterests();
            const interests = await interestCollection.find({}).toArray();
            const userInterests = userData.interests || [];
            const interestNames = interests.map(interest => ({
                interestName: interest.interestName,
                checked: userInterests.includes(interest.interestName) 
            }));

            res.render('./users/updateprofile', {
                layout: 'mainProfile',
                title: 'Update Profile',
                interestNames: interestNames,
                user: req.session.user,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                bio: userData.bio || '',
                interests: userData.interests || [], 
                profilePic: userData.profilePic || '' 
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })
    .post(isAuthenticated, upload.single("profilePic"), async (req, res) => {
        try {
            let { firstName, lastName, bio, interests } = req.body;
            const userId = req.session.user._id; 
            const usersCollection = await users();
            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

            firstName = helpers.checkString(firstName, 'firstName');
            lastName = helpers.checkString(lastName, 'Last Name');

                if(typeof bio !== 'string'){
                    throw `Bio must be a string`
                }
                if(bio.length !== 0 && bio.trim().length === 0){
                    throw `Bio can't be a string with just spaces`
                }

            if(interests){
                interests = helpers.checkInterests(interests, 'interests');
            }

            let profilePic = user.profilePic;
            if (req.file) {
                const oldImagePath = path.join(__dirname, "..", "public", "images", path.basename(user.profilePic));
                if (user.profilePic !== "/public/images/default.png" && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                profilePic = `/public/images/${req.file.filename}`;
            }
            const selectedInterests = interests ? interests : user.interests;

            const updatedUser = await profileDataFunction.updateUserProfile(
                user.email,         
                firstName.trim(),   
                bio ,        
                selectedInterests,     
                lastName.trim(),
                profilePic     
            );
            res.status(200).json({ redirect: '/profile' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router
    .route('/profile')
    .get(isAuthenticated, async (req, res) => {
        try {
            const usersCollection = await users();
            const userId = req.session.user._id;
            const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });
            let firstName = userData.firstName;
            let lastName = userData.lastName;
            let email = userData.email;
            let bio = userData.bio || '';
            let interests = userData.interests || [];
    
            firstName = helpers.checkString(firstName, 'firstName');
            lastName = helpers.checkString(lastName, 'Last Name');
            email = helpers.checkEmail(email, 'email');

                if(typeof bio !== 'string'){
                    throw `Bio must be a string`
                }
                if(bio.length !== 0 && bio.trim().length === 0){
                    throw `Bio can't be a string with just spaces`
                }

            if(interests){
                interests = helpers.checkInterests(interests, 'interests');
            }
            const savedPlacesIds = userData.savedPlaces || [];
            if (!Array.isArray(savedPlacesIds)) {

                throw 'Saved Places must be an array.';

            }
            let savedPlaces = [];
            
            for (let placeId of savedPlacesIds) {
                try {
                    const place = await placesData.getPlaceById(placeId);
                    savedPlaces.push(place);
                } catch (error) {
                    console.error(`Error fetching place with ID ${placeId}: ${error}`);
                }
            }

            if (!userData) {
                return res.status(404).send('User not found');
            }

            res.render('./users/profile', {
                layout: 'mainProfile',
                title: `${userData.firstName} ${userData.lastName}'s Profile`,
                user: req.session.user,
                profile: true,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                bio: userData.bio || '',
                interests: userData.interests || [],
                profilePic: userData.profilePic, //? userData.profilePic : 'No Profile Picture uploaded',
                savedPlaces: savedPlaces || [],
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            res.status(500).send('Error loading profile page.');
        }
    });

router
    .route('/response')
    .post(async (req, res) => {
        const { msg, hasResponse } = req.body;
        try {
            res.render('./users/response', {
                layout: 'main',
                title: 'Forgot password',
                msg,
                user: req.session.user,
                hasResponse: hasResponse === 'true', // Convert string to boolean
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router  
    .route('/reset')
    .get(async (req, res) => {
        try {
            res.render('./users/reset', {
                layout: 'main',
                user: req.session.user,
                title: 'Forgot password'
            });
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        let {email} = req.body;
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

        try{
            email = helpers.checkString(email, 'email');
            const usersCollection = await users();
            const user = await usersCollection.findOne({ email: email.trim() });
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
                    pass: 'zhscfmibaqshierj'
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
            res.status(200).json({ redirect: '/response',
                data: {
                    msg: 'Password reset link sent successfully to your email',
                }
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

            res.status(200).render('./users/reset-password', {
                title: 'Reset Password',
                layout: 'main',
                user: req.session.user,
                token,
            });
        } catch(e){
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        let {token, password, confirmPassword} = req.body;
        const usersCollection = await users();
        try{
            password = helpers.checkString(password, 'password');
            confirmPassword = helpers.checkString(confirmPassword, 'confirmPassword');
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords are not matching' });
            }
        } catch (e){
            res.status(500).json({error: e});
        } 

        try{
            const user = await usersCollection.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });

            if(!user){
                res.status(400).json({error: 'Invalid or expired token'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await usersCollection.updateOne(
                {_id: new ObjectId(user._id)},
                {
                    $set: { password: hashedPassword, },
                    $unset: { resetToken: "", resetTokenExpiry: "" },
                }
            );
            res.status(200).json({ redirect: '/response',
                data: {
                    msg: 'Password reset successful',
                    hasResponse: true,
                }
             });
        } catch(e){
            res.status(500).json({error: e});
        }
    })

export default router;  
