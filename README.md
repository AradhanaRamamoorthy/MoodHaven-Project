# MoodHaven (CS546A-Group-18)

**MoodHaven** is a web application that helps users discover personalized activities and nearby places based on how they're feeling. Designed to support emotional wellness, the app takes the guesswork out of “what to do” when you're not feeling your best.

## What It Does
A step-by-step experience designed to uplift your mood through personalized suggestions.

1. **Select Your Mood** – Choose how you're currently feeling (e.g., happy, stressed, bored, anxious).
2. **Choose Your Interests** – Pick areas you're interested in (e.g., nature, fitness, food, creativity).
3. **Select Suggested Activities** – Based on your mood + interests, MoodCompass suggests relevant activities to try
4. **Get Nearby Places** – Get a list of real-world places near your current location that match the chosen activity.
5. **Favorite Locations** - Save your favorite spots for easy access next time.
6. **Manage Your Profile** - Edit your user profile to personalize your experience and preferences.
7. **View & Drop Comments** – Share feedback or read what others are saying about each place.
8. **Leave App Feedback** – Share your review of the MoodHaven app and help shape future versions.

## Why It Matters
When people are struggling emotionally, it's often hard to know what to do.
Designed with empathy in mind, this platform empowers users to take positive actions based on how they feel, encouraging emotional self-care through personalized, location-aware recommendations.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: Google/Facebook OAuth
- **APIs**: Google Maps & Places API
- **Features**: Geolocation, Comment System, Rating, Mood Questionnaire, Favorites, User Profile Management

## Use Case

- Students/working professionals looking for relaxing ideas based on current emotions
- People wanting to explore new places but unsure where to start
- A companion tool for anyone practicing emotional awareness and self-care

## Potential Enhancements

- AI-based mood recognition via sentiment analysis or facial expressions
- Personalized user dashboards
- Integration with calendars for activity planning

## Built By

- [Aradhana Ramamoorthy](https://github.com/AradhanaRamamoorthy)
- [Angelina Mange](https://github.com/Angelina1225)
- [Nikiha Michael](https://github.com/nikithamic)
- [Sneha Venkatesan](https://github.com/sne-ha-v)

## Instructions to Run the Code

### 1. Install Packages
Run the following command to install the required dependencies:

```bash
npm install
```

### 2. Order of Seeding the Database

In the tasks folder, we have the following files:

1. `seed.js`
2. `interests.js`
3. `places.js`
4. `users.js`

command : 
cd tasks
node seed.js
node interests.js
places.js
node users.js
   
### 3. Add Configuration

Add the attached `config.env` file to the `config` folder.

### 4. Start the Application

After setting up the environment variables and seeding the database, run the following command to start the server:

```bash
node app.js
```
