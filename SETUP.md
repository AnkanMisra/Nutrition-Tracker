# Setup Instructions for Nutrition Tracker App

## Quick Start

The app is now ready to run! Follow these steps:

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Fix File Watching Issue (macOS)

If you encounter "EMFILE: too many open files" error, run this command in your terminal:

```bash
ulimit -n 65536
```

This increases the file descriptor limit for the current terminal session.

### 3. Start the Development Server

```bash
npm start
```

Or alternatively:
```bash
npx expo start
```

### 4. Run on Your Device

1. **Install Expo Go** on your mobile device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR Code** that appears in your terminal or browser:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app

3. **The app will load** on your device!

## Important Notes

### API Key Setup

For better performance, configure your USDA API key:

1. Visit: https://fdc.nal.usda.gov/api-key-signup.html
2. Sign up for a free API key
3. Copy `env.example` to `.env` and add your key:

```bash
cp env.example .env
```

4. Edit `.env` and replace the placeholder:

```
USDA_API_KEY=your_actual_api_key_here
```

### Troubleshooting

**"Too many open files" error:**
- Run: `ulimit -n 65536`
- Restart your terminal
- Try again

**Network connection issues:**
- Ensure your phone and computer are on the same WiFi network
- Try using `npx expo start --tunnel` (requires @expo/ngrok)

**App won't load:**
- Clear Expo Go app cache
- Restart the development server
- Check that port 19000 isn't blocked

## App Features

✅ **Food Search** - Search USDA food database
✅ **Nutrition Info** - View detailed nutrition facts
✅ **Daily Logging** - Track your daily food intake
✅ **Local Storage** - Data saved on your device
✅ **Clean UI** - Modern Material Design interface

## Project Structure

```
nutrition-tracker/
├── App.js                 # Main app with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Daily log and totals
│   │   ├── SearchScreen.js    # Food search
│   │   └── FoodDetailsScreen.js # Nutrition details
│   ├── services/
│   │   └── foodApi.js         # USDA API integration
│   └── utils/
│       └── storage.js         # Local data storage
├── assets/                # App icons and splash screen
└── package.json          # Dependencies
```

## Next Steps

1. **Test the app** on your device
2. **Get your API key** for unlimited food searches
3. **Customize** the app to your needs
4. **Add features** like meal planning or nutrition goals

Enjoy tracking your nutrition! 🍎📱
