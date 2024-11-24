import { ObjectId } from "mongodb";
import helpers from '../helpers.js';
import { moods } from "../config/mongoCollections.js";
import { getMoodById } from "./moods.js";
import { allInterests } from "../config/mongoCollections.js";

const createInterest = async(moodId, interest, activities) => {
    moodId = helpers.checkId(moodId);
    interest = helpers.checkArray(interest);
    const mood = await getMoodById(moodId);
    if(!mood) throw 'Mood not found!';
    const moodCollection = await moods();
    const interest_added_to_moods = await moodCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(moodId)},
        {
            $push: {
                interest: {
                    $each: interest.map(i => ({
                        interestName: i,
                        activities: activities[i] || [] // Add activities for each interest
                    }))
                }
            }
        },
        { returnDocument: 'after' }
    );

    if (!interest_added_to_moods) throw 'Could not add interest to the moods successfully!';
    return interest_added_to_moods;
};

const getAllInterests = async () => {
    const interestsCollection = await allInterests();  
    return await interestsCollection().find({}).toArray();  
};

const getActivitiesByInterest = async (interest) => {
    const interestsCollection = await allInterests();  
    const interestInfo = await interestsCollection.findOne({ interestName: interest });

    if (!interestInfo) throw new Error('Interest not found');
    return interestInfo.activities || [];
};


export { createInterest, getAllInterests, getActivitiesByInterest};
