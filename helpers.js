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
checkString(strValue, varName)
{
    if(!strValue) throw `The ${varName} of the mood should be provided`;
    if(typeof strValue !== 'string') throw `The ${varName} of the mood should be of string datatype`;
    strValue = strValue.trim();
    if(strValue.length === 0) throw `The ${varName} cannot be an empty string`;
    return strValue;
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