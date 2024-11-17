import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';

let exportedMethods = {
    async addUser(firstName, lastName, email, password){
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
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
        // New user structure for Google account
        let newUser = {     
            firstName: firstName.trim(),  
            lastName: lastName.trim(),    
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
    
        const usersCollection = await users(); // Access the 'users' collection
        const addUser = await usersCollection.insertOne(newUser);
    
        if (!addUser.acknowledged || !addUser.insertedId) {
            throw new Error("Couldn't add Google user successfully");
        }
    
        const newId = addUser.insertedId.toString();
        const user = await this.getUserById(newId);
        return user;
    }   ,

    async getUserById (id) {
        //id = checkId(id, 'id');
        const usersCollection = await users(); 
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        if (!user) {
          throw `No user found with the given id(${id})`;
        }
        user._id = user._id.toString();
        return user;
    }
}

export default exportedMethods;