import { createMood, getAllMoods, getMoodByName, getMoodById } from "./moods.js";
import { createInterest, getAllInterests, getActivitiesByInterest } from "./interest.js";

import userDataFunctions from './Users.js';

export const userData = userDataFunctions;
export const moodsData = {createMood, getAllMoods, getMoodByName, getMoodById};
export const interestData = {createInterest,  getAllInterests, getActivitiesByInterest};

