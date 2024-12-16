import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';
import helpers from '../helpers.js';

let exportedMethods = {
    async addUser(firstName, lastName, email, password){
      firstName = helpers.checkString(firstName, 'firstName');
      lastName = helpers.checkString(lastName, 'lastName');
      email = helpers.checkEmail(email, 'email');
      password = helpers.checkString(password, 'password');
    
      const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
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
      firstName = helpers.checkString(firstName, 'firstName');
      lastName = helpers.checkgoogleLastname(lastName, 'lastName');
      email = helpers.checkEmail(email, 'email');
      profilePic = helpers.checkString(profilePic, 'profilePic');

      let newUser = {     
            firstName: firstName,  
            lastName: lastName? lastName : '',    
            email: email,          
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
        id = helpers.checkId(id, 'id');
        const usersCollection = await users(); 
        const user = await usersCollection.findOne({_id: ObjectId.createFromHexString(id)});
        if (!user) {
          throw `No user found with the given id(${id})`;
        }
        user._id = user._id.toString();
        return user;
    }
}

export default exportedMethods;