import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  plugins: [
    "expo-font",
    "@react-native-google-signin/google-signin",
    "expo-router"
  ],
  android: {
    package: "com.mohammad_belbesi.socialApp",  // Added the package name here
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  },
  extra: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  },
  scheme: "foodrescue"
});
