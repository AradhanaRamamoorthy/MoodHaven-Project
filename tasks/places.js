import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createPlaces, getCoordinatesofPlaces } from "../data/places.js";

const db = await dbConnection();

try
{
    const places = [
        { name: "ArteVino Studio", activities: ["Acrylic Painting", "Social Crafting"] },
        { name: "7 Fine Arts", activities: ["Acrylic Painting", "Sketching"] },
        { name: "Field Colony", activities: ["Acrylic Painting", "Sketching", "Social Crafting"] },
        { name: "Hoboken Waterfront", activities: ["Digital art on a tablet", "Quick Doodles", "Outdoor Spray Art", "Sketching", "Old Memories Diary", "Create Fantasy Character", "Blog Writing", "Park Journal", "Form Improvement Drills", "Scenic Route Jog", "Seasonal recipe Tryout", "Strengthening Exercise", "Friendly Competition", "Social Gaming", "Park Day", "Park Reading"] },
        { name: "Pier A Park", activities: ["Meditation", "Digital art on a tablet", "Quick Doodles", "Outdoor Spray Art", "Sketching", "Old Memories Diary", "Create Fantasy Character", "Blog Writing", "Park Journal", "Form Improvement Drills", "Trail run/City Sprint", "Scenic Route Jog", "Seasonal recipe Tryout", "Friendly Competition", "Social Gaming", "Park Day", "Park Reading"] },
        { name: "Church Square Park", activities: ["Digital art on a tablet", "Outdoor Spray Art", "Old Memories Diary ", "Create Fantasy Character", "Blog Writing", "Park Reading"] },
        { name: "Elysian Park", activities: ["Digital art on a tablet", "Outdoor Spray Art", "Old Memories Diary", "Create Fantasy Character", "Blog Writing", "Still Life Photography", "Origami", "Handmade Cards/Scrapbooking", "Treasure Hunt in Park", "Park Day", "Park Reading"] },
        { name: "Jackson Park", activities: ["Meditation","Digital art on a tablet", "Quick Doodles", "Sketching", "Park Journal", "Park Reading"] },
        { name: "Stevens Park", activities: ["Meditation", "Quick Doodles", "Sketching", "Park Journal", "Park Day"] },
        { name: "Harborside Park", activities: ["Quick Doodles", "Outdoor Spray Art", "Old Memories Diary", "Create Fantasy Character", "Blog Writing", "Park Journal", "Macro Photography", "Knitting/crocheting"] },
        { name: "Columbus Park", activities: ["Sketching", "Rally Practice", "Tennis Drills", "Park Tennis Match"] },
        { name: "Jefferson Park", activities: ["Sketching"] },
        { name: "Hoboken Public Library", activities: ["Old Memories Diary", "Blog Writing", "Inspiring Story", "Handmade Cards/Scrapbooking", "Jigsaw Puzzle", "Logic Puzzle", "Crossword Competition", "Library or BookStore Visit"] },
        { name: "Symposia Community Bookstore", activities: ["Inspiring Story"] },
        { name: "Pier C", activities: ["Still Life Photography", "Macro Photography", "Sunset Photography", "Origami", "Handmade Cards/Scrapbooking", "Treasure Hunt in Park"] },
        { name: "Stevens Institute of Technology Campus", activities: ["Still Life Photography"] },
        { name: "Washington Street", activities: ["Still Life Photography", "Street Photography", "Trail run/City Sprint", "Scenic Route Jog", "Steady Cycling", "City ride", "Friends group Cycling", "Riverside Path"] },
        { name: "bwe kafe", activities: ["Macro Photography", "Cafe Visit", "Try exotic/Different Flavours", "Relaxing brews", "Outdoor Book Cafe", "Coffee-shop Workdays", "Networking events"] },
        { name: "Hoboken Farmers Market", activities: ["Macro Photography", "Street Photography"] },
        { name: "Sinatra Park", activities: ["Meditation","Sunset Photography", "Outdoor Salsa", "Origami", "Rally Practice", "Tennis Drills", "Park Tennis Match", "Treasure Hunt in Park"] },
        { name: "Little Island", activities: ["Sunset Photography", "Origami", "Knitting/crocheting", "Treasure Hunt in Park"] },
        { name: "The High Line", activities: ["Sunset Photography"] },
        { name: "The Studio at Hoboken", activities: ["Energetic FreeStyle", "Gentle Choreography", "Ballroom Dance"] },
        { name: "Fred Astaire Dance Studios", activities: ["Flow Dance", "Gentle Choreography", "Ballroom Dance", "Outdoor Salsa"] },
        { name: "Blue Skies Pottery", activities: ["Hand Molding", "Botanical Clay", "Sculpt Figures", "Skill building Workshops"] },
        { name: "The Clay Studio", activities: ["Hand Molding", "Botanical Clay", "Sculpt Figures", "Try Ceramics"] },
        { name: "M Avery Designs", activities: ["Knitting/crocheting"] },
        { name: "9th Street Gym", activities: ["Treadmill Run", "Treadmill Walk", "Social Gym"] },
        { name: "XCEL Athletic Lifestyle", activities: ["Treadmill Run", "Core Strengthening Exercise", "Treadmill Walk"] },
        { name: "UCC Fitness Center at Stevens Institute of Technology", activities: ["Treadmill Walk", "Treadmill Run"] },
        { name: "Planet Fitness Hoboken", activities: ["Treadmill Run", "Light Cardio", "Core Strengthening Exercise", "Treadmill Walk", "Social Gym"] },
        { name: "Fitness Factory Hoboken", activities: ["Treadmill Run", "Treadmill Walk"] },
        { name: "Southwest Park", activities: ["Form Improvement Drills", "Seasonal recipe Tryout"] },
        { name: "Maxwell Place Park", activities: ["Trail run/City Sprint", "Scenic Route Jog", "Seasonal recipe Tryout"] },
        { name: "Carlo's Bakery", activities: ["Pastry/Macron Baking"] },
        { name: "Choc O Pain French Bakery", activities: ["Pastry/Macron Baking", "Cafe Visit", "Relaxing brews", "Ingredient Exploration", "Outdoor Book Cafe"] },
        { name: "Hudson Table", activities: ["Pastry/Macron Baking", "Seasonal recipe Tryout", "Baking Classes", "Cooking class", "Skill building Workshops"] },
        { name: "Empire Coffee & Tea Co.", activities: ["Cafe Visit", "Try exotic/Different Flavours"] },
        { name: "The Hive", activities: ["Cafe Visit", "Relaxing brews"] },
        { name: "Cafe Vista", activities: ["Cafe Visit", "Try exotic/Different Flavours", "Relaxing brews", "Outdoor Book Cafe", "Coffee-shop Workdays", "Networking events"] },
        { name: "Mojo Coffee Company", activities: ["Cafe Visit", "Try exotic/Different Flavours", "Outdoor Book Cafe", "Coffee-shop Workdays", "Networking events"] },
        { name: "The Little Local", activities: ["Cafe Visit", "Outdoor Book Cafe", "Coffee-shop Workdays", "Networking events"] },
        { name: "Black Rail Coffee", activities: ["Cafe Visit", "Try exotic/Different Flavours"] },
        { name: "Sorellina Italian Kitchen & Wine Bar", activities: ["Comfort Blends", "Creative Pairings", "Themed Dinner", "Cuisine Exploration"] },
        { name: "Bin 14", activities: ["Comfort Blends", "Bold Flavours"] },
        { name: "Cheese + Wine Hoboken", activities: ["Comfort Blends", "Creative Pairings"] },
        { name: "Grand Vin", activities: ["Comfort Blends", "Vineyard Tour", "Bold Flavours", "Creative Pairings", "Themed Dinner", "Ingredient Exploration", "Cuisine Exploration"] },
        { name: "Ventimiglia Vineyard", activities: ["Comfort Blends", "Vineyard Tour", "Bold Flavours"] },
        { name: "Zack's Oar Bar and Restaurant", activities: ["Themed Dinner", "Ingredient Exploration", "Cuisine Exploration"] },
        { name: "Physique 57", activities: ["Light Cardio", "Core Strengthening Exercise", "Social Gym"] },
        { name: "Fitness in the Park", activities: ["Light Cardio", "Core Strengthening Exercise"] },
        { name: "The Fit Lab Hoboken", activities: ["Light Cardio", "Core Strengthening Exercise", "Social Gym"] },
        { name: "Crunch Fitness Hoboken", activities: ["Core Strengthening Exercise", "Social Gym", "Strengthening Exercise"] },
        { name: "Schaefer Athletic and Recreation Center", activities: ["Indoor Lap Swimming", "Diving Practice", "Floating/smooth laps"] },
        { name: "The Gravity Vault Hoboken", activities: ["Indoor rock climbing"] },
        { name: "Hudson River Waterfront Walkway", activities: ["Steady Cycling", "City ride", "Friends group Cycling", "Riverside Path"] },
        { name: "Stevens Institute of Technology Tennis Courts", activities: ["Rally Practice"] },
        { name: "Hoboken High School Tennis Courts", activities: ["Rally Practice", "Tennis Drills", "Park Tennis Match"] },
        { name: "Play! Hoboken", activities: ["Multiplayer Game", "Friendly Competition", "Social Gaming", "Jigsaw Puzzle", "Logic Puzzle", "Crossword Competition"] },
        { name: "Puzzle Out: Hoboken", activities: ["Team Game Night", "Outdoor Escape Game"] },
        { name: "Questo Outdoor Escape Games", activities: ["Team Game Night", "Outdoor Escape Game"] },
        { name: "Urban Souls Yoga", activities: ["Meditation"] },
        { name: "Asana Soul Practice", activities: ["Meditation"] },
        { name: "Woodhouse Spa", activities: ["Spa day/Aromatherapy", "Skincare routine"] },
        { name: "Hand & Stone Massage and Facial Spa", activities: ["Spa day/Aromatherapy", "Skincare routine"] },
        { name: "Hoboken Wellness Spa", activities:  ["Spa day/Aromatherapy", "Skincare routine"] },
        { name: "Little city books", activities: ["Journaling", "Library or BookStore Visit"] },
        { name: "Hudson Barks", activities: ["Pet Obedience Training"] },
        { name: "Cornerstone Pets", activities: ["Treats for Pets"] },
        { name: "Hound about Town", activities: ["Treats for Pets"] },
        { name: "Green Rock", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub"] },
        { name: "House of 'Que", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub"] },
        { name: "Black Bear Bar & Grill", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub", "Themed Party"] },
        { name: "McSwiggans Pub", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub", "Themed Party"] },
        { name: "The Shepherd & the Knucklehead", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub", "Themed Party"] },
        { name: "Finnegan's Pub", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub"] },
        { name: "The Ale House", activities: ["DIY Cocktail/Mocktail night", "Visit a Pub"] },
        { name: "Symposia Bookstore", activities: ["Library or BookStore Visit"] },
        { name: "Bluestone Lane", activities: ["Outdoor Book Cafe"] },
        { name: "The Hoboken Shelter", activities: ["Skill building Workshops", "Community Volunteer Events"] }

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
