import { ObjectId } from 'mongodb';
import helpers from '../helpers.js';
import { moods } from '../config/mongoCollections.js';
import { getMoodById } from './moods.js';
import { allInterests } from '../config/mongoCollections.js';

const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

const isValidInterestArray = (interest) => Array.isArray(interest) && interest.every(item => typeof item === 'string' && item.trim().length > 0);

const createInterest = async (moodId, interest) => {
    if (!isValidObjectId(moodId)) throw new Error('Invalid moodId');
    if (!isValidInterestArray(interest)) throw new Error('Interest should be an array of non-empty strings');

    const mood = await getMoodById(moodId);
    if (!mood) throw new Error('Mood not found!');

    const moodCollection = await moods();
    const interest_added_to_moods = await moodCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(moodId) },
        { $push: { interest: { $each: interest } } },
        { returnDocument: 'after' }
    );

    if (!interest_added_to_moods) throw new Error('Could not add interest to the moods successfully!');
    return interest_added_to_moods;
};

const getAllInterests = async () => {
    const interestsCollection = await allInterests();
    return await interestsCollection.find({}).toArray();
};

const getActivitiesByInterest = async (interest) => {
    if (!interest || typeof interest !== 'string' || interest.trim().length === 0) {
        throw new Error('Invalid interest provided');
    }

    const interestsCollection = await allInterests();
    const interestInfo = await interestsCollection.findOne({ interestName: interest });

    if (!interestInfo) throw new Error('Interest not found');
    return interestInfo.activities || [];
};

export { createInterest, getAllInterests, getActivitiesByInterest };
