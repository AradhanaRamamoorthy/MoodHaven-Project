//import postDataFunctions from './posts.js';
import { createMood, getAllMoods, getMoodByName, getMoodById } from "./moods.js";
import { createInterest } from "./interest.js";

import userDataFunctions from './Users.js';

export const userData = userDataFunctions;
export const moodsData = {createMood, getAllMoods, getMoodByName, getMoodById};
export const interestData = {createInterest};
//export const postData = postDataFunctions;
