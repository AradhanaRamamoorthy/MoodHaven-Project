import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users from '../data/Users.js';
import {users} from '../config/mongoCollections.js';

async function configurePassport(passport) {
    const usersCollection = await users();
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, cb) => {
            const email = profile.emails ? profile.emails[0].value : null;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            const profilePic = profile.photos[0].value;

            try{
                let user = await usersCollection.findOne({ email: email });
                if(!user){
                    user = await Users.addGoogleUser(firstName, lastName, email, profilePic);
                }
                return cb(null, user)
            } catch(e){
                console.log(e);
            }
        }
    ));

    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    // passport.deserializeUser(async (id, done) => {
    //     const user = await usersCollection.findOne({ _id: id });
    //     done(null, user);
    // });

    passport.serializeUser((user, cb) => {
        process.nextTick(() => {
            cb(null, {
                id: user.id,
                username: user.username,
                picture: user.picture,
            });
        });
    });
      
    passport.deserializeUser((user, cb) => {
        process.nextTick(() => {
            cb(null, user);
        });
    });
}

export default configurePassport;