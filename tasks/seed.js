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
const createInterest1 = await createInterest(createMood1._id.toString(), ["Cooking", "Cycling", "Video Gaming", "Self care", "Pet loving", "Baking", "Socializing and Networking"]);
const createInterest2 = await createInterest(createMood2._id.toString(), ["Running or Walking", "Hiking or Trekking", "Photography", "Self care", "Cycling", "Coffee or Tea Tasting", "Tennis"]);
const createInterest3 = await createInterest(createMood3._id.toString(), [ "Reading", "Cooking", "Partying", "Writing", "Swimming", "Pet loving", "Coffee or Tea Tasting", "GYM"]);
const createInterest4 = await createInterest(createMood4._id.toString(), [ "Running or Walking", "GYM", "Cycling", "Writing", "Pet loving", "Reading", "Pottery", "Tennis"]);
const createInterest5 = await createInterest(createMood5._id.toString(), ["Painting or Sketching", "Crafting", "Pottery", "GYM", "Partying", "Escape Room", "Cooking", "Baking", "Puzzle solving"]);
const createInterest6 = await createInterest(createMood6._id.toString(), ["Puzzle solving", "Dance", "Partying", "Video Gaming", "Coffee or Tea Tasting", "Wine Tasting"]);
const createInterest7 = await createInterest(createMood7._id.toString(), ["Socializing and Networking", "Cooking", "Cycling", "Partying", "Video Gaming", "Escape Room", "Pottery", "Baking"])
const createInterest8 = await createInterest(createMood8._id.toString(), ["Painting or Sketching", "Crafting", "GYM", "Self care", "Wine Tasting", "Writing", "Swimming", "Partying", "Cycling", "Photography"])
}
catch(e)
{
    console.log(e);
}
console.log("Done seeding database"); 
await closeConnection();



