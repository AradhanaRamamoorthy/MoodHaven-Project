import { ObjectId, ReturnDocument } from "mongodb";
import helpers from '../helpers.js';
import { moods } from "../config/mongoCollections.js";
import { getMoodById } from "./moods.js";

const createInterest = async(
    moodId,
    interest
) => {
    moodId = helpers.checkId(moodId);
    interest = helpers.checkArray(interest);
    const mood = await getMoodById(moodId);
    if(!mood) throw 'Mood not found!';
    const moodCollection = await moods();
    const interest_added_to_moods = await moodCollection.findOneAndUpdate(
        {_id : ObjectId.createFromHexString(moodId)},
        {$push : {interest : { $each : interest}}},
        {returnDocument : 'after'}
    );
    if(!interest_added_to_moods) throw 'Could not add interest to the moods successfully!';
    return interest_added_to_moods;
}

export {createInterest};
