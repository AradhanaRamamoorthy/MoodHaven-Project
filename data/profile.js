import {users} from '../config/mongoCollections.js';
import helpers from '../helpers.js';

let exportedMethods = {
    async updateUserProfile(email, firstName, bio, interests, lastName, profilePic) {
        try {
            email = helpers.checkEmail(email, 'email')
            firstName = helpers.checkString(firstName, 'firstName');
            lastName = helpers.checkString(lastName, 'lastName');
            
                if(typeof bio !== 'string'){
                    throw `Bio must be a string`
                }
                if(bio.length !== 0 && bio.trim().length === 0){
                    throw `Bio can't be a string with just spaces`
                }
            
            if(interests){
                interests = helpers.checkInterests(interests, 'interests');
            }

        } catch(e){
            console.error("Error updating user profile:", e);}
        try{
            const usersCollection = await users();
            const updateData = {};
            
            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (bio || bio === "") {
                updateData.bio = bio};
            if (interests) updateData.interests = interests;
            if (profilePic) updateData.profilePic = profilePic;
            const result = await usersCollection.updateOne(
                { email: email }, 
                { $set: updateData }
            );
            if (result.modifiedCount === 0) {
                throw `No changes selected`;
            }
            return await usersCollection.findOne({ email: email });
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    async completeProfile(email, bio, interests) {
        try {
            email = helpers.checkEmail(email, 'email');
            
                if(typeof bio !== 'string'){
                    throw `Bio must be a string`
                }
                if(bio.length !== 0 && bio.trim().length === 0){
                    throw `Bio can't be a string with just spaces`
                }
            
            interests = helpers.checkInterests(interests, 'interests');
            
            const usersCollection = await users();
            const updateData = {};
            if (bio) updateData.bio = bio;
            if (interests) updateData.interests = interests;
            const result = await usersCollection.findOneAndUpdate(
                { email: email.trim( ) }, 
                { $set: updateData }
            );
            if (Object.keys(updateData).length && result.modifiedCount === 0) {
                throw `Error updating please try again`;
            }
            return await usersCollection.findOne({ email: email });
        } catch (error) {
            console.error("Error:", error);
           
        }
    }
}

export default exportedMethods;