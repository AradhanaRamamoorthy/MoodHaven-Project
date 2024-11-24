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
    'Painting/Sketching': [
        "Acrylic Painting",
        "Digital art on a tablet",
        "Quick Doodles",
        "Mandala Art",
        "Outdoor spray art",
        "Outdoor sketching"
    ],
    'Writing': [
        "Old Memories",
        "Create character/Fantasy",
        "Blog writing",
        "Inspiring story",
        "Nature Inspired Poetry",
        "Quiet park Journal"
    ],
    'Photography': [
        "Still Life Photography",
        "Macro Photography",
        "Shadow play/unusual angles",
        "Contrast shots/Quiet spots",
        "Street Photography",
        "Nature Photography (Sunset)"
    ],
    'Dance': [
        "Energetic Freestyle",
        "Flow Dance",
        "Gentle Choreography",
        "Expressive Moves",
        "Public Dancing",
        "Outdoor Salsa"
    ],
    'Pottery': [
        "Soft Shapes/Smooth Designs",
        "Hand Molding",
        "Sculpt Figures",
        "Try Ceramics",
        "Botanical clay",
        "Pottery Museum"
    ],
    'Crafting': [
        "Origami",
        "Handmade Cards/Scrapbooking",
        "DIY frames",
        "Knitting/crocheting",
        "Social Crafting",
        "Create Nature Inspired crafts"
    ],
    'Running': [
        "Treadmill run",
        "Form improvement drills",
        "Virtual marathon training",
        "Interval training",
        "Trail run/City sprint",
        "Scenic route jog"
    ],
    'Cycling': [
        "Steady cycling",
        "Virtual cycling races",
        "City ride",
        "Friend group cycling",
        "Park cycle",
        "Riverside path"
    ],
    'Hiking/Trekking': [
        "Treadmill incline hike",
        "Hiking route planning",
        "Strength Exercise",
        "Virtual mountain trek simulation",
        "Waterfront walk",
        "Indoor rock climbing"
    ],
    'Swimming': [
        "Indoor lap swimming",
        "Water aerobics class",
        "Diving practice",
        "Floating/smooth laps",
        "Wave pool",
        "Pool games"
    ],
    'GYM': [
        "Light cardio",
        "Core strengthening exercise",
        "Treadmill walk",
        "Focus on form",
        "Park circuit training",
        "Social gym"
    ],
    'Yoga': [
        "Meditation",
        "Stretching routine",
        "Relaxation yoga",
        "Release/balance poses",
        "Social yoga",
        "Meditate near waterfront/park"
    ],
    'Tennis': [
        "Serve training",
        "Balance and coordination exercise",
        "Rally practice",
        "Tennis drills",
        "Airy courts",
        "Park tennis match"
    ],
    'Bowling': [
        "Outdoor bowling"
    ],
    'Karate/Boxing': [
        "Shadowboxing",
        "Bag work",
        "Technique drilling",
        "Solo practice",
        "Guided class",
        "Dynamic group"
    ],
    'Baking': [
        "Cake decorating",
        "Pastry/macaron baking",
        "Workshop/class",
        "Seasonal recipe tryout",
        "Baking ingredients market",
        "Picnic with baked goods"
    ],
    'Coffee/Tea Tasting': [
        "Home brew experimentation",
        "Try exotic/different flavors",
        "Pair with music/treats",
        "Cafe visit",
        "Relaxing brews"
    ],
    'Wine Tasting': [
        "Creative pairings",
        "Comfort blends",
        "Bold flavors",
        "Open air tasting",
        "Soft ambiance",
        "Vineyard tour"
    ],
    'Cooking': [
        "Cooking class",
        "Cuisine exploration",
        "Ingredient exploration",
        "Themed dinner",
        "BBQ session"
    ],
    'Video Gaming': [
        "Online tournament",
        "Multiplayer session",
        "VR headset gaming",
        "Try new video game",
        "Social gaming",
        "Friendly competitions"
    ],
    'Escape Rooms': [
        "Team game night",
        "Virtual escape room",
        "Outdoor escape game",
        "Treasure hunt in park"
    ],
    'Puzzle Solving': [
        "Jigsaw puzzle",
        "Logic puzzle",
        "Crossword competition",
        "Rubik's cube practice",
        "Outdoor scavenger hunt",
        "Online puzzles"
    ],
    'Self Care': [
        "Meditation",
        "Spa day/aromatherapy",
        "Skincare routine",
        "Journaling",
        "Outdoor spa",
        "Soothing music"
    ],
    'Pet Loving': [
        "Pet obedience training/interactive puzzle",
        "Treats for pet",
        "Pet photoshoot",
        "Pet grooming session",
        "Park day"
    ],
    'Shopping': [
        "Online shopping",
        "Thrift or vintage shop tour",
        "Closet organization and styling",
        "Personalized shopping guide creation/style lookbook",
        "Window shopping",
        "Local flea market"
    ],
    'Partying': [
        "Themed house party",
        "Karaoke night",
        "Game night",
        "DIY cocktail/mocktail night",
        "Virtual party (fun virtual games and music)",
        "Visit a pub"
    ],
    'Socializing': [
        "Themed house party",
        "Karaoke night",
        "Game night",
        "DIY cocktail/mocktail night",
        "Virtual party (fun virtual games and music)",
        "Visit a pub"
    ],
    'Reading': [
        "Reading nook setup (cozy corner)",
        "Literary podcast",
        "Library or bookstore visit",
        "Author talk or signing",
        "Park reading session",
        "Outdoor book cafe"
    ],
    'Socializing and Networking': [
        "Networking events",
        "Skill-building workshops",
        "Co-working space or coffee shop workdays",
        "Public speaking clubs",
        "Community volunteer events",
        "Outdoor conferences"
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


