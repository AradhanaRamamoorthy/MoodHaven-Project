import {ObjectId} from 'mongodb';
import { moods } from './config/mongoCollections.js';

const exportedMethods = {
checkId(id)
{
    if(!id) throw 'The value of id must be entered';
    if(typeof id !== 'string') throw 'The id must be of a string datatype';
    id = id.trim();
    if(id.length === 0) throw 'The value of id cannot be an empty string';
    if(!ObjectId.isValid(id)) throw 'The id provided is not a valid ObjectId';
    return id;
},
checkString (str, name) {
    if(!str){
        throw `Input(${name}) must be provided and should not be a falsy value`;
    }
    if (typeof str !== 'string') {
        throw `Input(${name}) must be strings but got ${typeof str}`;
    }
    if (str.trim().length === 0){
        throw `Input(${name}) cannot be an empty string or just spaces`;
    }
    return str.trim();
},
checkgoogleLastname (str, name) {
    if(!str){
        throw `Input(${name}) must be provided and should not be a falsy value`;
    }
    if (typeof str !== 'string') {
        throw `Input(${name}) must be strings but got ${typeof str}`;
    }
    return str.trim();
},
checkEmail(str, name) {
    if (!str) {
        throw `Input(${name}) must be provided and should not be a falsy value`;
    }
    if (typeof str !== 'string') {
        throw `Input(${name}) must be a string but got ${typeof str}`;
    }
    if (str.trim().length === 0) {
        throw `Input(${name}) cannot be an empty string or just spaces`;
    }
    const trimmedStr = str.trim().toLowerCase();
    if (!trimmedStr.endsWith('@gmail.com')) {
        throw `Input(${name}) must be a valid Gmail address`;
    }
    return trimmedStr;
},
checkArray(arrValue, varName)
{
    if(!arrValue || !Array.isArray(arrValue)) throw `The value of ${varName} should be provided and should be in an Array`;
    if(Array.isArray(arrValue))
    {
        arrValue.forEach((element) => {
            this.checkString(element,varName)
        })
    }
    return arrValue;
},
checkInterests(arrValue, varName){
    if(!arrValue || !Array.isArray(arrValue)) throw `The value of ${varName} should be provided and should be in an Array`;
    if(Array.isArray(arrValue)){
        arrValue.forEach((element) => {
            this.checkString(element,varName)
        })
    }
    if (arrValue.length === 0 || arrValue.length > 5) {
        throw `${varName} must contain at least 1 and no more than 5 items`;
    }
    return arrValue;
},
checkObject(objValue, varName)
{
    if(!objValue || typeof objValue !== 'object' || Array.isArray(objValue)) throw `The ${varName} should be an Object!`;
    let commentContentKeys = ["comment_content", "comment_author", "user_Id", "date", "user_profilePic"]
    if(Object.keys(objValue).length !== 5) throw 'The Comment Object must have 5 keys';
    commentContentKeys.forEach((key) => {
        if(!(key in objValue)) throw 'The Comment Object mush have keys: comment_content, comment_author, user_Id, date, user_profilePic';
        if(key in objValue)
        {
            if(key === "comment_content")
                this.checkString(objValue[key], "comment");
            if(key === "comment_author")
                this.checkString(objValue[key], "userName");
            if(key === "user_Id")
                this.checkId(objValue[key]);
            if(key === "date")
                this.checkString(objValue[key], "date");
        }
    });
    return objValue;
}
};
export default exportedMethods;