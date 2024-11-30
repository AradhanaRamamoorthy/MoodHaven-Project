import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createPlaces, getCoordinatesofPlaces } from "../data/places.js";

const db = await dbConnection();

try
{
    const places = [
        { name: "ArteVino Studio", activities: ["Acrylic Painting", "Digital art on a tablet", "Quick Doodles", "Mandala Art", "Outdoor spray art", "Outdoor sketching"] },
        { name: "Urban Souls Yoga Studio", activities: ["Meditation", "Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"] },
        { name: "Asana Soul Practice", activities: ["Meditation", "Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"] },
        { name: "YogaRenew Hoboken", activities: ["Meditation", "Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"] },
        { name: "Pier A Park", activities: ["Meditation", "Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"] },
        { name: "Maxwell Place Park", activities: ["Meditation", "Stretching routine", "Relaxation Yoga", "Release/balance poses", "Social yoga", "Meditate near waterfront/park"] },
        { name: "Hudson Table", activities: ["Cooking class", "Cuisine exploration", "Ingredient exploration", "Themed dinner", "BBQ session"] },
        { name: "Choc O Pain French Bakery & Café", activities: ["Cooking class", "Cuisine exploration", "Ingredient exploration", "Themed dinner", "BBQ session"] },
        { name: "Empire Coffee & Tea Co", activities: ["Cooking class", "Cuisine exploration", "Ingredient exploration", "Themed dinner", "BBQ session"] },
        { name: "Sorellina Italian Kitchen & Wine Bar", activities: ["Cooking class", "Cuisine exploration", "Ingredient exploration", "Themed dinner", "BBQ session"] },
        { name: "Pier 13 Hoboken", activities: ["Cooking class", "Cuisine exploration", "Ingredient exploration", "Themed dinner", "BBQ session"] },
        { name: "Tiger Schulmann's Martial Arts", activities: ["Shadowboxing", "Bag work", "Technique drilling", "Solo practice", "Guided class", "Dynamic group"] },
        { name: "CKO Kickboxing", activities: ["Shadowboxing", "Bag work", "Technique drilling", "Solo practice", "Guided class", "Dynamic group"] },
        { name: "Hoboken Fight Club", activities: ["Shadowboxing", "Bag work", "Technique drilling", "Solo practice", "Guided class", "Dynamic group"] },
        { name: "UFC Gym Hoboken", activities: ["Shadowboxing", "Bag work", "Technique drilling", "Solo practice", "Guided class", "Dynamic group"] },
        { name: "XCEL Athletic Lifestyle", activities: ["Shadowboxing", "Bag work", "Technique drilling", "Solo practice", "Guided class", "Dynamic group"] },
        { name: "9th Street Gym", activities: ["Treadmill run", "Form improvement drills", "Virtual marathon training", "Interval training", "Trail run/City sprint", "Scenic route jog"] }
    ];
 
    const coordinates = [];

    for (const place of places) {
        try {
            const createdPlace = await createPlaces(place.name, place.activities);
            const place_coordinates = await getCoordinatesofPlaces(createdPlace._id.toString());
            coordinates.push({ id: createdPlace._id, coordinates: place_coordinates });
        } catch (e) {
            console.log(e);
        }
    }
}
catch(e)
{
    console.log(e);
}
console.log("Done seeding Database");
await closeConnection();
