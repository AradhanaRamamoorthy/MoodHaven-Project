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
// import path from 'path';
// import multer from 'multer';



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//       cb(
//         null,
//         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//       );
//     },
//   });
//   const upload = multer({
//     storage,
//   });
  
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
            email = helpers.checkString(email, 'email');
            password = helpers.checkString(password, 'password');
            confirmPassword = helpers.checkString(confirmPassword, 'confirmPassword');

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
        let {email, password} = req.body;
        const usersCollection = await users();
        const user = await usersCollection.findOne({ email: email.trim() });
        try {
            if(!email || !password ){
                return res.status(400).json({ error: 'Both email and password are required.' });
            }
            email = helpers.checkString(email, 'email');
            password = helpers.checkString(password, 'password');

            if (!user) {
                return res.status(404).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
            if (!isPasswordValid) {
                return res.status(404).json({ error: 'Invalid email or password.' });
            }

            req.session.user = { _id: user._id.toString(), email: user.email };
            if (user.recentVisit === null || user.interests.length === 0) {
                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { recentVisit: new Date().toISOString() } }
                );
                res.status(200).json({ redirect: '/profileSetup'});
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
                layout: 'main',
                title: 'Complete Your Profile',
                interestNames,
            });
        } catch (error) {
            res.status(500).json({ error: e });
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
            const result = await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(user._id) },
                { $set: updateData }
            );

            if (result.modifiedCount === 0) {
                throw `No data updated, user may not exist or no changes made.`;
            }
            res.redirect('/profile');
        } catch (error) {
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
            const interestNames = interests.map(interest => ({
                interestName: interest.interestName 
             }));

            res.render('./users/updateprofile', {
                layout: 'main',
                title: 'Update Profile',
                interestNames: interestNames,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                bio: userData.bio || 'No bio provided.',
                interests: userData.interests || [], 
                profilePic: userData.profilePic || '' 
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })
    .post(isAuthenticated, async (req, res) => {
        // .post(upload.single('profilePic'), async (req, res) => {
        try {
            const { firstName, lastName, bio, interests } = req.body;
        
                // let profilePic = null;
    
                // if (req.file) {
                //     profilePic = `/public/images/${req.file.filename}`;
                // }
                // //profilePic = `/public/images/ff1.png`;
                // console.log("req.file 22 and profilePic: " ,req.file , profilePic);
    
    
            if (!firstName || !lastName) {
                throw 'First name and last name are required.';
            }
            const user = req.session.user; 
            if (!user) {

                return res.redirect('/login'); 

            }
            const selectedInterests = interests ? interests : [];
            const updatedUser = await profileDataFunction.updateUserProfile(
                user.email,         
                firstName.trim(),   
                bio || null,        
                selectedInterests,     
                lastName.trim(),
                // profilePic     
            );
            res.redirect('/profile');
        } catch (e) {
            console.log("error : " , e);
            const usersCollection = await users();
            const userId = req.session.user._id;
            const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });
            const savedPlacesIds = userData.savedPlaces || [];
            let savedPlaces = [];
            
            for (let placeId of savedPlacesIds) {
                try {
                    const place = await placesData.getPlaceById(placeId);
                    savedPlaces.push(place);
                } catch (error) {
                    console.error(`Error fetching place with ID ${placeId}: ${error}`);
                }
            }
    //         res.redirect('/profile');
    //      }
    // });



    // router
    // .route('/removeProfilePic')
    // .post(async (req, res) => {
    //     try {
            
    //         const user = req.session.user; 
    //         if (!user) {
    //             return res.redirect('/login'); 
    //         }
            
    //         const updatedUser = await profileDataFunction.removeProfilePic(
    //             user.email,         
    //         );
    //         res.redirect('/profile');
        // } catch (e) {
        //     console.log("error : " , e);
        //     res.redirect('/profile');

            res.render('./users/profile', {
                layout: 'main',  
                title: 'Profile',  
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                bio: req.body.bio || 'No bio provided.',
                interests: req.body.interests || [],  
                savedPlaces: savedPlaces || [],
                // profilePic: userData.profilePic || ''
            });
        }
    });

router
    .route('/profile')
    .get(isAuthenticated, async (req, res) => {
        try {
            const usersCollection = await users();
            const userId = req.session.user._id;
            const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });
            const savedPlacesIds = userData.savedPlaces || [];
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
                layout: 'main',
                title: `${userData.firstName} ${userData.lastName}'s Profile`,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                bio: userData.bio || 'No bio provided.',
                interests: userData.interests || [],
                // profilePic: userData.profilePic? userData.profilePic : 'No Profile Picture uploaded',
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

            const hashedPassword = await bcrypt.hash(password.trim(), 10);
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
