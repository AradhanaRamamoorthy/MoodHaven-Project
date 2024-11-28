import { ObjectId} from "mongodb";
import helpers from '../helpers.js';
import { places } from "../config/mongoCollections.js";

import axios from 'axios';

const API_KEY = 'AIzaSyBAWaIJv0tNBnVQPoff22IhYsNtxwc1MY8'; 

const createPlaces = async(placeName, activity) => {
    placeName = helpers.checkString(placeName, 'placeName');
    activity = helpers.checkArray(activity, "activity");
    let place = {
        placeName : placeName,
        activity : activity
    };
    const placeCollection = await places();
    const insertplaces = await placeCollection.insertOne(place);
    if(!insertplaces.acknowledged || !insertplaces.insertedId)
        throw 'Could not add places';
    return {...place, _id: insertplaces.insertedId.toString()};
}

const getCoordinatesofPlaces = async(placeId) => {
    const get_places = await getPlaceById(placeId);
    const city = "Hoboken";
    const state = "New Jersey";
    if(!get_places) throw 'No such place exists';
    const query = `${get_places.placeName}, ${city}, ${state}`; 
    const {data : placeData} = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${API_KEY}`);
    if (!placeData.candidates || placeData.candidates.length === 0) throw 'No location data found for the specified place!';

    const place_Id_from_API = placeData.candidates[0].place_id;
    const {data : place} = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_Id_from_API}&key=${API_KEY}`);
    if(!place.result || !place.result.geometry) throw 'No geometry data found for the specified place';
    const place_details = place.result;
    const location = place_details.geometry.location;
    const address = place_details.formatted_address;
    const google_rating = place_details.rating;
    const url = place_details.url; 
    const website = place_details.website; 
    let icon_photo = [];
    if (place_details.photos) {
        icon_photo = place_details.photos.map(photo => {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${API_KEY}`;
            return photoUrl;
        });
    }

    const place_Data = 
    {
        address : address,
        location_Coordinates : {
            latitude : location.lat,
            longitude : location.lng,
            },
        google_rating : google_rating,
        url : url,
        website : website,
        icon_photo : icon_photo[0],
        comment : []
    }
    const placeCollection = await places();
    const update_coordinates = await placeCollection.findOneAndUpdate(
        {_id : ObjectId.createFromHexString(placeId)},
        {$set : place_Data},
        {returnDocument : 'after'}
    );
    if(!update_coordinates) throw 'Could not update places location successfully!';
    update_coordinates._id = update_coordinates._id.toString();
    return update_coordinates;
};

const getAllPlaces = async() => {
    const placeCollection = await places();
    let placeLists = await placeCollection.find({}).toArray();
    if(!placeLists) throw 'Was not able to get all places!';
    placeLists = placeLists.map((value) => {
        value._id = value._id.toString();
         return value;    
    });
    return placeLists;
}

const getPlaceById = async (id) => {
    id = helpers.checkId(id);
    const placeCollection = await places();
    const place = await placeCollection.findOne({_id : ObjectId.createFromHexString(id)});
    if(place === null) throw 'No place is present with that id';
    place._id = place._id.toString();
    return place;
};

const getPlacesByActivities = async(activity) => {
    activity = helpers.checkString(activity);
    const placeCollection = await places();
    const placesList = await placeCollection.find().toArray();
    const place = placesList.filter(place => place.activity.includes(activity));
    if(place === null) throw 'No place is present for thi activity!';
    return place;
};

export {createPlaces, getAllPlaces, getCoordinatesofPlaces, getPlaceById, getPlacesByActivities};

