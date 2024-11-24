import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createInterest } from "../data/interest.js";
import { createMood } from '../data/moods.js';


const db = await dbConnection();
await db.dropDatabase();

try
{
const createMood1 = await createMood("Fear", ["Afraid", "Anxious", "Panicked", "Cautious", "Worried"]);
const createMood2 = await createMood("Anger", ["Aggravated", "Angry", "Furious", "Irritated", "Mad", "Grumpy"]);
const createMood3 = await createMood("Stress/Tension", ["Stressed", "Pressured", "Tense", "Restless"]);
const createMood4 = await createMood("Resentment/Bitterness", ["Resentful", "Bitter", "Jealous", "Frustated"]);
const createMood5 = await createMood("Boredom/Apathy", ["Unmotivated", "Disinterested", "Weary", "Unfulfilled"]);
const createMood6 = await createMood("Overexcited/hypered", ["Euphoric", "Energetic", "Exhilarated", "Thrilled", "Overzealous", "Impatient"]);
const createMood7 = await createMood("Disgust", ["Repulsed", "Contemptuous", "Offended", "Revolted", "Uncomfortable", "Grossed Out"]);
const createMood8 = await createMood("Sadness", ["Burdened", "Depressed", "Embarrased", "Hurt", "Lonely", "Regretful", "Sad", "Shameful", "Sorrowful", "Suicidal"]); 
const createInterest1 = await createInterest(createMood1._id.toString(), ["Karate boxing" , "Yoga", "Meditation", "Cooking"]);
const createInterest2 = await createInterest(createMood2._id.toString(), ["Running/Walking", "Karate/Boxing", "Hiking/Trekking", "Watching standup show", "Meditation", "Listening to music or podcasts"]);
const createInterest3 = await createInterest(createMood3._id.toString(), ["Meditation", "Yoga", "Listening to music or podcasts", "Reading", "Cooking", "Shopping"]);
const createInterest4 = await createInterest(createMood4._id.toString(), ["Yoga", "Meditation", "Running", "Karate/Boxing"]);
const createInterest5 = await createInterest(createMood5._id.toString(), ["Baking/Cooking", "Pottery", "Painting/Sketching", "Crafting", "Puzzle solving", "Watching movies or shows"]);
const createInterest6 = await createInterest(createMood6._id.toString(), ["Meditation", "Yoga", "Puzzle solving", "Dance", "Partying"]);
}
catch(e)
{
    console.log(e);
}
console.log("Done seeding database"); 
await closeConnection();



