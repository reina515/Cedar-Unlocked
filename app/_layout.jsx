import { useFonts } from "expo-font";
import { Stack } from "expo-router"; // Make sure this matches your expo-router version
import { useState } from "react";
import { Text, View } from "react-native";
import { CreateTripContext } from "../context/CreateTripContext";

export default function RootLayout() {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
  });

  // State for trip data
  const [tripData, setTripData] = useState([]);

  // Show loading screen until fonts are ready
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  // Render the stack wrapped in the context provider
  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CreateTripContext.Provider>
  );
}
