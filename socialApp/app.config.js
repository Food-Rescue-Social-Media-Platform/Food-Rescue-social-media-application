export default ({ config }) => ({
  ...config,
  name: "FOOD RESCUE",
  slug: "socialApp", // Add this line and ensure it matches your EAS project slug
  displayName: "FOOD RESCUE",
  version: "1.0.0",
  assetBundlePatterns: ["**/*"],
  plugins: [
    "expo-font",
    "@react-native-google-signin/google-signin",
    "expo-router"
  ],
  android: {
    package: "com.mohammad_belbesi.socialApp",
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    permissions: [
      "ACCESS_BACKGROUND_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION"
    ]
  },
  web: {
    bundler: "metro"
  },
  extra: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    eas: {
      projectId: "a3c76fc0-4054-4bdf-afb4-a432deb8da57"
    }
  },
  scheme: "foodrescue",
  icon: "./assets/Images/FR_logo.png",
  splash: {
    image: "./assets/Images/FR_logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  }
});
