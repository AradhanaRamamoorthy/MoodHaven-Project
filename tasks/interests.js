import {allInterests} from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';

async function addInterest(interest) {
    const newInterest = {
      interestName: interest,
      activities: []
    };

    const interestsCollection = await allInterests();
    const item = await interestsCollection.findOne({interest: interest});
    if(!item){
        await interestsCollection.insertOne(newInterest);
    }
}

await addInterest('Painting/Sketching');
await addInterest('Writing');
await addInterest('Photography');
await addInterest('Dance');
await addInterest('Pottery');
await addInterest('Crafting');
await addInterest('Running');
await addInterest('Hiking/Trekking');
await addInterest('Swimming');
await addInterest('GYM');
await addInterest('Yoga/Piates');
await addInterest('Rock climbing');
await addInterest('Tennins');
await addInterest('Bowling');
await addInterest('Karate/boxing');
await addInterest('Tennis');
await addInterest('Baking');
await addInterest('Coffee/Tea tasting');
await addInterest('Wine tasting');
await addInterest('Cooking');
await addInterest('Video gaming');
await addInterest('VR gaming');
await addInterest('Escape rooms');
await addInterest('Puzzle solving');
await addInterest('Self care');
await addInterest('Pet loving');
await addInterest('Shopping');
await addInterest('Partying');
await addInterest('Socialising');
await addInterest('Reading');
await addInterest('Networking');

console.log('Done seeding database');

await closeConnection();