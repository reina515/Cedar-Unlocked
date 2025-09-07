import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Colors } from "../../constant/Colors";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function SelectDates() {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

    useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#006A4E",
    });
  }, []);
  const onDateChange = (date, type) => {
    if (!date) return;
    if (type === "START_DATE") setStartDate(moment(date));
    else if (type === "END_DATE") setEndDate(moment(date));
  };

  const handleContinue = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show("Please select a valid start and end date", ToastAndroid.LONG);
      return;
    }
    const totalNoOfDays =
      endDate.clone().startOf("day").diff(startDate.clone().startOf("day"), "days") + 1;

    setTripData({ ...tripData, startDate, endDate, totalNoOfDays });
    router.push("/create-trip/select-budget");
  };

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
    <View style={{ flex: 1, backgroundColor: "#F4F6F5", padding: 25, paddingTop: 75 }}>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 32,
          color: "#006A4E",
          marginBottom: 10,
        }}
      >
        Select Travel Dates
      </Text>

      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 18,
          color: "#444",
          marginBottom: 20,
        }}
      >
        Pick your start and end dates below:
      </Text>

      <CalendarPicker
        onDateChange={onDateChange}
        allowRangeSelection={true}
        maxRangeDuration={7}
        selectedRangeStyle={{ backgroundColor: "#4A4A4A" }}
        selectedDayTextStyle={{ color: Colors.WHITE }}
      />

      {startDate && endDate && (
        <InfoCard
          icon={<MaterialIcons name="date-range" size={28} color="#006A4E" />}
          title="Selected Dates"
          value={`${moment(startDate).format("DD MMM")} → ${moment(endDate).format(
            "DD MMM"
          )} (${endDate.diff(startDate, "days") + 1} days)`}
        />
      )}

      <TouchableOpacity
        onPress={handleContinue}
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
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
