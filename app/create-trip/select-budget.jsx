import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
    Animated,
    FlatList,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SelectBudgetOptions } from "../../constant/Options";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function SelectBudget() {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [selectedOption, setSelectedOption] = useState(null);


  const handlePress = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (selectedOption) setTripData({ ...tripData, budget: selectedOption.title });
  }, [selectedOption]);

  const renderCard = ({ item }) => {
    const isSelected = selectedOption?.id === item.id;
    const scaleAnim = new Animated.Value(1);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
          elevation: 5,
          borderRadius: 25,
          backgroundColor: "#fff",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handlePress(item)}
          style={{
            padding: 20,
            borderRadius: 25,
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? "#006A4E" : "transparent",
          }}
        >
    
          <View
            style={{
              backgroundColor:
                item.title === "Cheap"
                  ? "#A7D49B"
                  : item.title === "Moderate"
                  ? "#FFD97D"
                  : "#6AC2B8",
              alignSelf: "flex-start",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 12,
              marginBottom: 15,
            }}
          >
            <Text style={{ fontFamily: "outfit-bold", fontSize: 12, color: "#fff" }}>
              {item.title}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 22,
              color: "#1C4E80",
              marginBottom: 10,
            }}
          >
            {item.title}
          </Text>

          <View
            style={{
              backgroundColor: "#F4F6F5",
              padding: 10,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: 16,
                color: "#555",
                textAlign: "center",
              }}
            >
              {item.desc}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F5", paddingTop: 41, paddingHorizontal: 20 }}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={24} color="#006A4E" style={{ marginRight: 6 }} />
       
      </TouchableOpacity>

      <Text style={{ fontFamily: "outfit-bold", fontSize: 32, color: "#006A4E", marginBottom: 5 }}>
        Budget
      </Text>
      <Text style={{ fontFamily: "outfit", fontSize: 18, color: "#444", marginBottom: 20 }}>
        Select your spending style for this trip
      </Text>

      <FlatList
        data={SelectBudgetOptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 10 }}
      />


      <TouchableOpacity
        onPress={() => {
          if (!selectedOption) {
            ToastAndroid.show("Select Your Budget", ToastAndroid.LONG);
            return;
          }
          router.push("create-trip/review-trip");
        }}
        style={{
          padding: 18,
          borderRadius: 25,
          marginBottom: 30,
          backgroundColor: "#006A4E",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 6 },
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
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

