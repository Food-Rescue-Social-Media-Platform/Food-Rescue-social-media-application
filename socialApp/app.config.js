export default ({ config }) => ({
  ...config,
  plugins: [
    "expo-font",
    "@react-native-google-signin/google-signin",
    "expo-router"
  ],
  android: {
    package: "com.mohammad_belbesi.socialApp",  // Ensure package name is consistent
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  },
  extra: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    eas: {
      projectId: "a3c76fc0-4054-4bdf-afb4-a432deb8da57"
    }
  },
  scheme: "foodrescue"
});
