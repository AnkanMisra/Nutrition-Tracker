# Personal Nutrition Tracker App

A simple and intuitive React Native mobile app built with Expo Go for tracking daily food intake and nutrition information. Built with TypeScript for enhanced type safety and developer experience.

## Features

- 🔍 **Food Search**: Search for foods using the USDA FoodData Central API
- 📊 **Nutrition Information**: View detailed nutrition data including calories, protein, carbs, fat, fiber, sugar, and sodium
- 📝 **Daily Food Log**: Track what you eat each day with customizable serving sizes
- 💾 **Local Storage**: All data is stored locally on your device using AsyncStorage
- 📱 **Clean UI**: Modern interface built with React Native Paper
- 🔄 **Real-time Calculations**: Automatic nutrition calculations based on serving sizes
- 🔒 **Type Safety**: Built with TypeScript for better code quality and development experience

## Tech Stack

- **Framework**: React Native with Expo Go
- **Language**: TypeScript
- **Navigation**: React Navigation
- **UI Library**: React Native Paper
- **HTTP Requests**: Axios
- **Local Storage**: AsyncStorage
- **API**: USDA FoodData Central API

## Prerequisites

- **Node.js**: v18 or higher (v23+ may have compatibility issues with some packages)
- **npm** or **yarn**
- **Expo Go** app on your mobile device
- **Git** (for cloning the repository)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nutrition-Tracker
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React Native and Expo SDK
- TypeScript and type definitions
- React Navigation
- React Native Paper
- Axios for API calls
- AsyncStorage for local data

### 3. Get USDA API Key (Recommended)

For better performance and unlimited requests:

1. Visit [USDA FoodData Central API](https://fdc.nal.usda.gov/api-key-signup.html)
2. Sign up for a free API key
3. Replace `DEMO_KEY` in `src/services/foodApi.ts` with your actual API key:

```typescript
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace DEMO_KEY with your key
```

### 4. Start the Development Server

```bash
npm start
```

**Note**: If you encounter permission errors with `npx expo start`, use `npm start` instead. This is a known issue with newer Node.js versions.

### 5. Run on Your Device

#### Option A: Mobile Device (Recommended)

1. Install the **Expo Go** app on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code displayed in your terminal with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

3. The app will load on your device!

#### Option B: iOS Simulator (macOS only)

```bash
npm start
# Then press 'i' in the terminal to open iOS simulator
```

#### Option C: Android Emulator

```bash
npm start
# Then press 'a' in the terminal to open Android emulator
```

#### Option D: Web Browser

```bash
npm start
# Then press 'w' in the terminal to open in web browser
```

## Project Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx         # Main screen with daily log and totals
│   ├── SearchScreen.tsx       # Food search functionality
│   └── FoodDetailsScreen.tsx  # Detailed nutrition info and add to log
├── services/
│   └── foodApi.ts            # USDA API integration with TypeScript
├── utils/
│   └── storage.ts            # AsyncStorage utilities with TypeScript
└── types/
    └── index.ts              # TypeScript type definitions
```

## TypeScript Features

This app is fully typed with TypeScript, providing:

- **Type-safe API calls** with proper request/response typing
- **Navigation typing** for screen parameters and navigation props
- **Component prop typing** for better development experience
- **Storage typing** for AsyncStorage operations
- **Comprehensive type definitions** for all data structures

### Type Checking

Run TypeScript type checking:

```bash
npx tsc --noEmit
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

## Development

### Adding New Features

1. **New Screens**: Create TypeScript components in `src/screens/`
2. **API Changes**: Update types in `src/types/index.ts` and modify `src/services/foodApi.ts`
3. **Storage Changes**: Update storage utilities in `src/utils/storage.ts`

### Code Quality

- **TypeScript**: All code is written in TypeScript for type safety
- **Linting**: Follow React Native and TypeScript best practices
- **Type Definitions**: Comprehensive types for all data structures

## Troubleshooting

### Common Issues

1. **Permission errors when starting**
   ```bash
   # Use npm start instead of npx expo start
   npm start
   ```

2. **Node.js compatibility issues**
   - Use Node.js v18-v22 (avoid v23+ for now)
   - Check your Node version: `node --version`

3. **TypeScript errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   ```

4. **"Network Error" when searching foods**
   - Check your internet connection
   - Verify API key is correct (if using custom key)
   - Try with a different search term

5. **App won't load in Expo Go**
   - Ensure your device and computer are on the same network
   - Try restarting the development server
   - Clear Expo Go app cache

6. **Food log data disappears**
   - This shouldn't happen as data is stored locally
   - Check if AsyncStorage permissions are granted
   - Try restarting the app

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Paper Components](https://reactnativepaper.com/)
- Consult [USDA API Documentation](https://fdc.nal.usda.gov/api-guide.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Future Enhancements

Possible features to add:
- Weekly/monthly nutrition summaries
- Nutrition goals and progress tracking
- Barcode scanning for packaged foods
- Meal planning and recipes
- Export data functionality
- Dark mode support
- Offline mode with data sync
- User authentication and cloud backup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript typing
4. Test thoroughly on both iOS and Android
5. Submit a pull request

## License

This project is for personal use. Feel free to modify and customize as needed.

---

**Note**: This app is designed for personal nutrition tracking. For medical or professional dietary advice, consult with healthcare professionals or registered dietitians.
