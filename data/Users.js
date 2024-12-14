import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';

let exportedMethods = {
    async addUser(firstName, lastName, email, password){
        const hashedPassword = await bcrypt.hash(password.trim(), 13);
        let newUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: hashedPassword,
            profilePic: "/public/images/default.png",
            bio: "",
            interests: [],
            recentVisit: null,
            savedPlaces: [],
            searched: false,
            searchedPlaces: []
        }

        const usersCollection = await users();
        const adduser = await usersCollection.insertOne(newUser)
        if(!adduser.acknowledged || !adduser.insertedId){
            throw `Couldn\'t add user successfully`;
        }
        const newId = adduser.insertedId.toString();
        const user = await this.getUserById(newId);
        return user;
    },

    async addGoogleUser(firstName, lastName, email, profilePic) {
        let newUser = {     
            firstName: firstName.trim(),  
            lastName: lastName?.trim() || '',    
            email: email.trim(),          
            password: null,               
            profilePic: profilePic || "/public/images/default.png",
            bio: "",
            interests: [],
            recentVisit: null,
            savedPlaces: [],
            searched: false,
            searchedPlaces: []
        };
    
        const usersCollection = await users(); 
        const addUser = await usersCollection.insertOne(newUser);
    
        if (!addUser.acknowledged || !addUser.insertedId) {
            throw `Couldn't add Google user successfully`;
        }
    
        const newId = addUser.insertedId.toString();
        const user = await this.getUserById(newId);
        return user;
    }   ,

    async getUserById (id) {
        const usersCollection = await users(); 
        const user = await usersCollection.findOne({_id: ObjectId.createFromHexString(id)});
        if (!user) {
          throw `No user found with the given id(${id})`;
        }
        user._id = user._id.toString();
        return user;
    },

    async updateUserLocation(userId, latitude, longitude){
        const usersCollection = await users();
        try {
          const update_userLocation = await usersCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(userId) },
            { $set: { location: { latitude, longitude } } }
          );
          if(!update_userLocation) throw 'Could not update location in user!';
          update_userLocation._id = update_userLocation._id.toString();
          return update_userLocation;
        } catch (error) {
          throw new Error('Failed to update location: ' + error.message);
        }
      }
}

export default exportedMethods;