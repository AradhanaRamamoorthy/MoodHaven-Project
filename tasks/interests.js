import { allInterests } from '../config/mongoCollections.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

async function addInterest(interest, activities) {
    const newInterest = {
        interestName: interest,
        activities: activities
    };

    const interestsCollection = await allInterests();
    const item = await interestsCollection.findOne({ interestName: interest });
    if (!item) {
        await interestsCollection.insertOne(newInterest);
    }
}

const interestsActivities = {
    'Painting or Sketching': [
        "Acrylic Painting",
        "Digital art on a tablet",
        "Quick Doodles",
        "Outdoor Spray Art",
        "Sketching"
    ],
    'Writing': [
        "Old Memories Diary",
        "Create Fantasy Character",
        "Blog Writing",
        "Inspiring Story",
        "Park Journal"
    ],
    'Photography': [
        "Still Life Photography",
        "Macro Photography",
        "Street Photography",
        "Sunset Photography"
    ],
    'Dance': [
        "Energetic FreeStyle",
        "Flow Dance",
        "Gentle Choreography",
        "Ballroom Dance",
        "Outdoor Salsa"
    ],
    'Pottery': [
        "Hand Molding",
        "Sculpt Figures",
        "Try Ceramics",
        "Botanical Clay"
    ],
    'Crafting': [
        "Origami",
        "Handmade Cards/Scrapbooking",
        "Knitting/crocheting",
        "Social Crafting"
    ],
    'Running or Walking': [
        "Treadmill Run",
        "Form Improvement Drills",
        "Trail run/City Sprint",
        "Scenic Route Jog"
    ],
    'Baking': [
        "Pastry/Macron Baking",
        "Seasonal recipe Tryout",
        "Baking Classes"
    ],
    'Coffee or Tea Tasting': [
        "Try exotic/Different Flavours",
        "Cafe Visit",
        "Relaxing brews"
    ],
    'Wine Tasting': [
        "Creative Pairings",
        "Comfort Blends",
        "Bold Flavours",
        "Vineyard Tour"
    ],
    'Cooking': [
        "Cooking class",
        "Cuisine Exploration",
        "Ingredient Exploration",
        "Themed Dinner",
    ],
    'GYM': [
        "Light Cardio",
        "Core Strengthening Exercise",
        "Treadmill Walk",
        "Social Gym"
    ],
    'Swimming': [
        "Indoor Lap Swimming",
        "Diving Practice",
        "Floating/smooth laps",
    ],
    'Hiking or Trekking': [
        "Strengthening Exercise",
        "Indoor rock climbing"
    ],
    'Cycling': [
        "Steady Cycling",
        "City ride",
        "Friends group Cycling",
        "Riverside Path"
    ],
    'Tennis': [
        "Rally Practice",
        "Tennis Drills",
        "Park Tennis Match"
    ],
    'Video Gaming': [
        "Multiplayer Game",
        "Social Gaming",
        "Friendly Competition"
    ],
    'Escape Room': [
        "Team Game Night",
        "Outdoor Escape Game",
        "Treasure Hunt in Park"
    ],
    'Puzzle solving': [
        "Jigsaw Puzzle",
        "Logic Puzzle",
        "Crossword Competition",
    ],
    'Self care': [
        "Meditation",
        "Spa day/Aromatherapy",
        "Skincare routine",
        "Journaling",
    ],
    'Pet loving': [
        "Pet Obedience Training",
        "Treats for Pets",
        "Park Day"
    ],
    'Partying': [
        "Themed Party",
        "DIY Cocktail/Mocktail night",
        "Visit a Pub"
    ],
    'Reading': [
        "Library or BookStore Visit",
        "Park Reading",
        "Outdoor Book Cafe"
    ],
    'Socializing and Networking': [
        "Networking events",
        "Skill building Workshops",
        "Coffee-shop Workdays",
        "Community Volunteer Events",
    ]
};

async function seedDatabase() {
    for (const [interest, activities] of Object.entries(interestsActivities)) {
        await addInterest(interest, activities);
    }
    console.log('Done seeding database');
    await closeConnection();
}

seedDatabase();


