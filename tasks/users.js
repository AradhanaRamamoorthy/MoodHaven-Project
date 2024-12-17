import { closeConnection } from "../config/mongoConnection.js";
import Users from '../data/Users.js';

const newUsers = [
    { firstName: 'Angelina', lastName: 'Mande', email: 'angelinajoe2512@gmail.com', password: 'Angelina@123'},
    { firstName: 'Aradhana', lastName: 'Ramamoorthy', email: 'aradhanaramamoorthy@gmail.com', password: 'Aradhana_12'},
    { firstName: 'Nikitha', lastName: 'Michael', email: 'nikithamichael@gmail.com', password: 'Nikithha$13'},
    { firstName: 'Sneha', lastName: 'Venkatesh', email: 'snehavenkatesh@gmail.com', password: 'Sneha#24'}
]

try{
    for(let user of newUsers){
        const addedUser = await Users.addUser(user.firstName, user.lastName, user.email, user.password);
    }
} catch(e){
    console.log(e);
}
console.log("Done seeding Database");
await closeConnection();