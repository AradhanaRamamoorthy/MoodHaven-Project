import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createPlaces, getCoordinatesofPlaces } from "../data/places.js";

const db = await dbConnection();
try
{
    const createPlace1 = await createPlaces("ArteVino Studio", ["Acrylic Painting", "Digital art on a tablet", "Quick Doodles", "Mandala Art", "Outdoor spray art", "Outdoor sketching"]);
    const createPlace2 = await createPlaces("Urban Souls Yoga Studio", ["Meditation","Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"]);
    const createPlace3 = await createPlaces("Asana Soul Practice", ["Meditation","Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"]);
    const createPlace4 = await createPlaces("YogaRenew Hoboken", ["Meditation","Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"]);
    const createPlace5 = await createPlaces("Pier A Park", ["Meditation","Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"]);
    const createPlace6 = await createPlaces("Maxwell Place Park", ["Meditation","Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"]);
    const createPlace7 = await createPlaces("Asana Soul Practice", ["Meditation","Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"]);
    const createPlace8 = await createPlaces("7 Fine Arts", ["Acrylic Painting", "Digital art on a tablet", "Quick Doodles", "Mandala Art", "Outdoor spray art", "Outdoor sketching"]);
    const createPlace9 = await createPlaces("Field colony",  ["Acrylic Painting", "Digital art on a tablet", "Quick Doodles", "Mandala Art", "Outdoor spray art", "Outdoor sketching"]);
    const createPlace10 = await createPlaces("Pier A Park",  ["Acrylic Painting", "Digital art on a tablet", "Quick Doodles", "Mandala Art", "Outdoor spray art", "Outdoor sketching"]);
    const createPlace11 = await createPlaces("Hoboken Waterfront",  ["Acrylic Painting", "Digital art on a tablet", "Quick Doodles", "Mandala Art", "Outdoor spray art", "Outdoor sketching"]);
    const createPlace17 = await createPlaces("DivaDance JerseyCity/Hoboken", ["Energetic Freestyle", "Flow Dance", "Gentle Choreography", "Expressive Moves", "Public Dancing", "Outdoor Salsa"]);
    const createPlace18 = await createPlaces("Fred Astaire Dance Studios", ["Energetic Freestyle", "Flow Dance", "Gentle Choreography", "Expressive Moves", "Public Dancing", "Outdoor Salsa"]);
    const createPlace19 = await createPlaces("The Studio at Hoboken", ["Energetic Freestyle", "Flow Dance", "Gentle Choreography", "Expressive Moves", "Public Dancing", "Outdoor Salsa"]);
    const createPlace20 = await createPlaces("Dance Studio & Classes Hoboken", ["Energetic Freestyle", "Flow Dance", "Gentle Choreography", "Expressive Moves", "Public Dancing", "Outdoor Salsa"]);
    const createPlace21 = await createPlaces("Musica Hoboken Series at Sinatra Park", ["Energetic Freestyle", "Flow Dance", "Gentle Choreography", "Expressive Moves", "Public Dancing", "Outdoor Salsa"]);
    const createPlace22 = await createPlaces("Blue Skies Pottery", ["Soft Shapes/Smooth Designs", "Hand Molding", "Sculpt Figures", "Try Ceramics", "Botanical Clay", "Pottery Museum"]);
    const createPlace23 = await createPlaces("The Clay Studio at Project Studios", ["Soft Shapes/Smooth Designs", "Hand Molding", "Sculpt Figures", "Try Ceramics", "Botanical Clay", "Pottery Museum"]);
    const createPlace24 = await createPlaces("ArteVino Studio", ["Soft Shapes/Smooth Designs", "Hand Molding", "Sculpt Figures", "Try Ceramics", "Botanical Clay", "Pottery Museum"]);
    const coordinates_1 = await getCoordinatesofPlaces(createPlace1._id.toString());
    const coordinates_2 = await getCoordinatesofPlaces(createPlace2._id.toString());
    const coordinates_3 = await getCoordinatesofPlaces(createPlace3._id.toString());
    const coordinates_4 = await getCoordinatesofPlaces(createPlace4._id.toString());
    const coordinates_5 = await getCoordinatesofPlaces(createPlace5._id.toString());
    const coordinates_6 = await getCoordinatesofPlaces(createPlace6._id.toString());
    const coordinates_7 = await getCoordinatesofPlaces(createPlace7._id.toString());
    const coordinates_8 = await getCoordinatesofPlaces(createPlace8._id.toString());
    const coordinates_9 = await getCoordinatesofPlaces(createPlace9._id.toString());
    const coordinates_10 = await getCoordinatesofPlaces(createPlace10._id.toString());
    const coordinates_11 = await getCoordinatesofPlaces(createPlace11._id.toString());
    const coordinates_17 = await getCoordinatesofPlaces(createPlace17._id.toString());
    const coordinates_18 = await getCoordinatesofPlaces(createPlace18._id.toString());
    const coordinates_19 = await getCoordinatesofPlaces(createPlace19._id.toString());
    const coordinates_20 = await getCoordinatesofPlaces(createPlace20._id.toString());
    const coordinates_21 = await getCoordinatesofPlaces(createPlace21._id.toString());
    const coordinates_22 = await getCoordinatesofPlaces(createPlace22._id.toString());
    const coordinates_23 = await getCoordinatesofPlaces(createPlace23._id.toString());
    const coordinates_24 = await getCoordinatesofPlaces(createPlace24._id.toString());
}
catch(e)
{
    console.log(e);
}
console.log("Done seeding Database");
await closeConnection();
