import { useRouter } from "expo-router";
import { doc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { chatSession } from "../../configs/AiModel";
import { auth, db } from "../../configs/FirebaseConfig";
import { AI_PROMT } from "../../constant/Options";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function GenerateTrip() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (tripData && !aiGenerated) {
      GenerateAiTrip();
    }
  }, [tripData, aiGenerated]);

  const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(cleanObject).filter(item => item !== null && item !== undefined);
    }
    
    // Handle Date objects and moment objects
    if (obj instanceof Date || (obj && typeof obj === 'object' && obj._isAMomentObject)) {
      return obj.toISOString ? obj.toISOString() : new Date(obj).toISOString();
    }
    
    // Handle moment.js objects or other date-like objects
    if (obj && typeof obj === 'object' && (obj.format || obj.toDate)) {
      try {
        if (obj.toDate) {
          return obj.toDate().toISOString();
        }
        if (obj.format) {
          return obj.format();
        }
      } catch (e) {
        return new Date().toISOString();
      }
    }
    
    if (obj !== null && typeof obj === 'object') {
      const cleaned = {};
      Object.keys(obj).forEach(key => {
        const value = cleanObject(obj[key]);
        if (value !== undefined && value !== null && typeof value !== 'function') {
          cleaned[key] = value;
        }
      });
      return cleaned;
    }
    
    // Filter out functions
    if (typeof obj === 'function') {
      return undefined;
    }
    
    return obj;
  };

  const GenerateAiTrip = async () => {
    setLoading(true);

    if (!user?.email) {
      Alert.alert("Authentication Error", "Please sign in to continue");
      router.replace("/auth/sign-in");
      setLoading(false);
      return;
    }

    // Updated prompt replacement to handle the new traveler structure
    const FINAL_PROMT = AI_PROMT
      .replace("{location}", tripData.locationInfo.name)
      .replace("{totalDays}", tripData.totalNoOfDays)
      .replace("{totalNight}", tripData.totalNoOfDays - 1)
      .replace(/\{traveler\}/g, tripData.traveler.title) // Use global replace for multiple occurrences
      .replace("{budget}", tripData.budget);

    try {
      console.log("Starting AI generation...");
      console.log("Traveler type being sent:", tripData.traveler.title);
      
      const result = await chatSession.sendMessage(FINAL_PROMT);
      const aiText = await result.response.text();

      // Clean and parse JSON
      let jsonString = aiText.trim();
      
      if (jsonString.includes('```json')) {
        jsonString = jsonString.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      }
      
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }

      const tripResp = JSON.parse(jsonString);
      console.log("JSON parsed successfully");

      setAiGenerated(true);
      const docId = `${user.uid}_${Date.now()}`;

      // Save with timestamp as number for easier sorting
      const timestamp = Date.now();
      
      // Clean startDate specifically
      let cleanStartDate = null;
      if (tripData.startDate) {
        try {
          if (tripData.startDate instanceof Date) {
            cleanStartDate = tripData.startDate.toISOString();
          } else if (tripData.startDate.toDate && typeof tripData.startDate.toDate === 'function') {
            cleanStartDate = tripData.startDate.toDate().toISOString();
          } else if (tripData.startDate.format && typeof tripData.startDate.format === 'function') {
            cleanStartDate = tripData.startDate.format('YYYY-MM-DD');
          } else {
            cleanStartDate = new Date(tripData.startDate).toISOString();
          }
        } catch (e) {
          console.log("Error cleaning startDate, using current date:", e);
          cleanStartDate = new Date().toISOString();
        }
      }
      
      // Debug log the tripData structure
      console.log("Original tripData structure:", {
        locationInfo: tripData.locationInfo,
        traveler: tripData.traveler,
        budget: tripData.budget,
        totalNoOfDays: tripData.totalNoOfDays,
        startDate: cleanStartDate
      });
      
      const saveData = {
        userEmail: user.email,
        userId: user.uid,
        // Store destination name directly for easier access
        destination: tripData.locationInfo?.name || 'Unknown Location',
        locationName: tripData.locationInfo?.name || 'Unknown Location',
        // Include original trip planning data for display
        locationInfo: cleanObject(tripData.locationInfo), // This has the place photos
        traveler: cleanObject(tripData.traveler), // Now includes alter ego data
        travelerType: tripData.traveler?.title || 'Unknown', // Easy access to traveler type
        travelerPersonality: tripData.traveler?.personality || '', // Store the personality description
        budget: tripData.budget || 'Budget not specified',
        totalNoOfDays: tripData.totalNoOfDays || 1,
        startDate: cleanStartDate, // Use cleaned date
        // AI generated trip data
        aiTripData: cleanObject(tripResp),
        createdAt: timestamp,
        lastModified: timestamp
      };
      
      console.log("Final saveData structure:", saveData);

      console.log("Saving trip with ID:", docId);
      await setDoc(doc(db, "UserTrips", docId), saveData);
      console.log("Trip saved successfully!");

      router.push("(tabs)/mytrip");

    } catch (error) {
      console.error("AI generation error:", error);
      Alert.alert("Error", "Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic text based on selected traveler type
  const getTravelerMessage = () => {
    const travelerType = tripData?.traveler?.title;
    switch(travelerType) {
      case 'Explorer':
        return 'We are crafting an adventurous Lebanese journey full of hidden gems!';
      case 'Foodie':
        return 'We are preparing a delicious culinary adventure through Lebanon!';
      case 'Relaxer':
        return 'We are designing a peaceful and rejuvenating Lebanese getaway!';
      case 'Culture Seeker':
        return 'We are curating a rich cultural journey through Lebanese heritage!';
      case 'Party Animal':
        return 'We are planning an exciting Lebanese adventure with vibrant nightlife!';
      default:
        return 'We are crafting your perfect Lebanese journey!';
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fdfdfd",
        paddingTop: 70,
        alignItems: "center",
      }}
    >
      {/* Top Title Section */}
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 32,
          textAlign: "center",
          color: "#006A4E", // cedar green, premium travel vibe
          marginBottom: 10,
        }}
      >
        Please Wait
      </Text>

      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
          textAlign: "center",
          marginBottom: 20,
          color: "#444",
          paddingHorizontal: 30,
        }}
      >
        {getTravelerMessage()}
      </Text>

      {/* Loading Spinner */}
      <ActivityIndicator size="large" color="#C49A6C" style={{ marginBottom: 30 }} />

      {/* Image Section */}
      <View
        style={{
          width: "90%",
          height: 350,
          borderRadius: 18,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          marginBottom: 40,
        }}
      >
        <Image
          source={require("./../../assets/images/pic.jpg")}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>

      {/* Footer Note */}
      <Text
        style={{
          fontFamily: "outfit-regular",
          fontSize: 16,
          textAlign: "center",
          color: "#666",
          paddingHorizontal: 40,
          lineHeight: 22,
        }}
      >
        Hang tight while we prepare a tailor-made {tripData?.traveler?.title?.toLowerCase()} experience for{" "}
        <Text style={{ color: "#C49A6C", fontFamily: "outfit-bold" }}>
          {tripData?.locationInfo?.name || "Lebanon"}
        </Text>
        .
      </Text>

      <Text
        style={{
          fontFamily: "outfit-regular",
          fontSize: 16,
          textAlign: "center",
          color: "#666",
          marginTop: 10,
        }}
      >
        This won't take long!
      </Text>
    </View>
  );
}