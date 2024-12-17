import { ObjectId } from "mongodb";
import helpers from '../helpers.js';
import { moods } from "../config/mongoCollections.js";

const createMood = async(
    moodName, moodVariants
) => {
moodName = helpers.checkString(moodName,'moodName');
moodVariants = helpers.checkArray(moodVariants, 'moodVariants');
let mood = {
    moodName : moodName,
    mood_variants : moodVariants
};
const moodCollection = await moods();
const insertMoods = await moodCollection.insertOne(mood);
if(!insertMoods.acknowledged || !insertMoods.insertedId)
    throw 'Could not add moods';
return { ...mood, _id: insertMoods.insertedId.toString() };
}

const getAllMoods = async() => {
    const moodCollection = await moods();
    let moodLists = await moodCollection.find({}).toArray();
    if(!moodLists) throw 'Was not able to get all moods!';
    moodLists = moodLists.map((value) => {
        value._id = value._id.toString();
        return value;
    });
    return moodLists;
}

const getMoodById = async (id) => {
    id = helpers.checkId(id);
    const moodCollection = await moods();
    const mood = await moodCollection.findOne({_id : ObjectId.createFromHexString(id)});
    if(mood === null) throw 'No team is present with that id';
    mood._id = mood._id.toString();
    return mood;
};

const getMoodByName = async(moodName) => {
    moodName = helpers.checkString(moodName, "moodName");
    const moodCollection = await moods();
    const mood = await moodCollection.findOne({ moodName : moodName});
    if(!mood) throw 'There is no mood of that is selected';
    return(mood);
}

export {createMood, getAllMoods, getMoodByName, getMoodById};