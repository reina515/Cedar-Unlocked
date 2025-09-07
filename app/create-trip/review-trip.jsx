import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function ReviewTrip() {
  const navigation = useNavigation();
  const { tripData } = useContext(CreateTripContext);
  const router = useRouter();

    useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#006A4E",
    });
  }, []);

  const InfoCard = ({ icon, title, value }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {icon}
      <View style={{ marginLeft: 15 }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 18,
            color: "#1C4E80",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 16,
            color: "#555",
            marginTop: 4,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F4F6F5",
        padding: 25,
        paddingTop: 75,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 32,
          color: "#006A4E",
          marginBottom: 10,
        }}
      >
        Review Your Trip
      </Text>

      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 16,
          color: "#444",
          marginBottom: 20,
        }}
      >
        Before generating your trip, please confirm your details below.
      </Text>

      <InfoCard
        icon={<Ionicons name="location-sharp" size={28} color="#FF6B35" />}
        title="Destination"
        value={tripData?.locationInfo?.name || "Not selected"}
      />
      <InfoCard
        icon={<MaterialIcons name="date-range" size={28} color="#006A4E" />}
        title="Travel Dates"
        value={
          tripData?.startDate && tripData?.endDate
            ? `${moment(tripData.startDate).format("DD MMM")} → ${moment(
                tripData.endDate
              ).format("DD MMM")} (${tripData.totalNoOfDays} days)`
            : "Dates not selected"
        }
      />
      <InfoCard
        icon={<FontAwesome5 name="users" size={24} color="#1C4E80" />}
        title="Who is Traveling"
        value={tripData?.traveler?.title || "Not specified"}
      />
      <InfoCard
        icon={<FontAwesome5 name="money-bill-wave" size={24} color="#FFD93D" />}
        title="Budget"
        value={tripData?.budget || "Not specified"}
      />

      <TouchableOpacity
        onPress={() => router.replace("/create-trip/generate-trip")}
        style={{
          padding: 18,
          borderRadius: 25,
          marginTop: 50,
          backgroundColor: "#006A4E",
          shadowColor: "#006A4E",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "outfit-bold",
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          Build My Trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}


