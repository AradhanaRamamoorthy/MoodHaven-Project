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
}
};
export default exportedMethods;