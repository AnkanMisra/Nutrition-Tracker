# Personal Nutrition Tracker App

A simple and intuitive React Native mobile app built with Expo Go for tracking daily food intake and nutrition information.

## Features

- 🔍 **Food Search**: Search for foods using the USDA FoodData Central API
- 📊 **Nutrition Information**: View detailed nutrition data including calories, protein, carbs, fat, fiber, sugar, and sodium
- 📝 **Daily Food Log**: Track what you eat each day with customizable serving sizes
- 💾 **Local Storage**: All data is stored locally on your device using AsyncStorage
- 📱 **Clean UI**: Modern interface built with React Native Paper
- 🔄 **Real-time Calculations**: Automatic nutrition calculations based on serving sizes

## Tech Stack

- **Framework**: React Native with Expo Go
- **Navigation**: React Navigation
- **UI Library**: React Native Paper
- **HTTP Requests**: Axios
- **Local Storage**: AsyncStorage
- **API**: USDA FoodData Central API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

## Setup Instructions

### 1. Install Dependencies

```bash
cd nutrition-tracker
npm install
```

### Running on Web

This app now supports web platforms in addition to mobile:

```bash
# Start the app on web
npm start -- --web
```

The web version uses the same codebase but is optimized for browser interfaces with responsive design.

### 2. Get USDA API Key (Recommended)

For better performance and unlimited requests:

1. Visit [USDA FoodData Central API](https://fdc.nal.usda.gov/api-key-signup.html)
2. Sign up for a free API key
3. Replace `DEMO_KEY` in `src/services/foodApi.js` with your actual API key:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace DEMO_KEY with your key
```

### 3. Start the Development Server

```bash
npm start
# or
expo start
```

### 4. Run on Your Device

1. Install the **Expo Go** app on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code displayed in your terminal or browser with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

3. The app will load on your device!

## App Structure

```
src/
├── screens/
│   ├── HomeScreen.js          # Main screen with daily log and totals
│   ├── SearchScreen.js        # Food search functionality
│   └── FoodDetailsScreen.js   # Detailed nutrition info and add to log
├── services/
│   └── foodApi.js            # USDA API integration
└── utils/
    └── storage.js            # AsyncStorage utilities
```

## How to Use

### 1. Home Screen
- View today's date and nutrition totals
- See all foods logged for the day
- Remove individual foods or clear the entire log
- Tap the "+" button to add new foods

### 2. Search for Foods
- Enter food names in the search bar
- Browse search results from the USDA database
- Tap on any food to view detailed nutrition information

### 3. Add Foods to Log
- View detailed nutrition information for selected foods
- Adjust the quantity/serving size
- See real-time nutrition calculations
- Add the food to your daily log

### 4. Track Your Nutrition
- Monitor daily totals for calories, protein, carbs, and fat
- View your complete food log for the day
- Data persists between app sessions

## API Information

### USDA FoodData Central API

This app uses the USDA FoodData Central API to provide comprehensive nutrition data:

- **Free to use** with API key signup
- **Comprehensive database** with over 600,000 foods
- **Reliable nutrition data** from official USDA sources
- **Multiple food types**: Foundation Foods, SR Legacy, and Branded Foods

### Demo Key Limitations

The app includes a `DEMO_KEY` for testing, but it has limitations:
- Limited number of requests per hour
- May be slower or unreliable
- **Recommended**: Get your own free API key for better performance

## Customization

### Adding New Nutrients

To track additional nutrients, modify the `getFoodDetails` function in `src/services/foodApi.js`:

```javascript
// Add new nutrient extraction
else if (name.includes('vitamin c')) {
  nutrients.vitaminC = Math.round(value * 100) / 100;
}
```

### Changing Theme Colors

Modify the theme in `App.js`:

```javascript
const theme = {
  colors: {
    primary: '#your-color',
    accent: '#your-accent-color',
  },
};
```

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the route to the Stack Navigator in `App.js`
3. Navigate to it using `navigation.navigate('ScreenName')`

## Troubleshooting

### Common Issues

1. **"Network Error" when searching foods**
   - Check your internet connection
   - Verify API key is correct (if using custom key)
   - Try with a different search term

2. **App won't load in Expo Go**
   - Ensure your device and computer are on the same network
   - Try restarting the Expo development server
   - Clear Expo Go app cache

3. **Food log data disappears**
   - This shouldn't happen as data is stored locally
   - Check if AsyncStorage permissions are granted
   - Try restarting the app

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Paper Components](https://reactnativepaper.com/)
- Consult [USDA API Documentation](https://fdc.nal.usda.gov/api-guide.html)

## Future Enhancements

Possible features to add:
- Weekly/monthly nutrition summaries
- Nutrition goals and progress tracking
- Barcode scanning for packaged foods
- Meal planning and recipes
- Export data functionality
- Dark mode support

## License

This project is for personal use. Feel free to modify and customize as needed.

---

**Note**: This app is designed for personal nutrition tracking. For medical or professional dietary advice, consult with healthcare professionals or registered dietitians.
