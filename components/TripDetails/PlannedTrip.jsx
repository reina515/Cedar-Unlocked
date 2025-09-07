import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../configs/FirebaseConfig";

export default function PlannedTrip() {
  const { tripId } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const docRef = doc(db, "UserTrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTripDetails(docSnap.data());
      } else {
        Alert.alert("Error", "Trip not found");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
      Alert.alert("Error", "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading itinerary...</Text>
      </View>
    );
  }

  if (!tripDetails || !tripDetails.aiTripData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>AI-generated itinerary not found</Text>
      </View>
    );
  }

  const { aiTripData, destination, totalNoOfDays } = tripDetails;
  const itinerary = aiTripData.itinerary || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

    
      {aiTripData.tripSummary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          <Text style={styles.summaryText}>{aiTripData.tripSummary}</Text>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
        {itinerary.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayTab, selectedDay === index && styles.dayTabActive]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[styles.dayTabText, selectedDay === index && styles.dayTabTextActive]}>
              Day {day.day || index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      {itinerary[selectedDay] && (
        <View style={styles.dayDetailsContainer}>
          <Text style={styles.dayTitle}>Day {itinerary[selectedDay].day || selectedDay + 1}</Text>

          {itinerary[selectedDay].theme && (
            <Text style={styles.dayTheme}>{itinerary[selectedDay].theme}</Text>
          )}

  
          {itinerary[selectedDay].activities?.map((activity, idx) => (
            <View key={idx} style={styles.activityCard}>
              <Text style={styles.activityName}>{activity.activity || activity.name}</Text>
              {activity.time && <Text style={styles.activityTime}>Time: {activity.time}</Text>}
              {activity.location && <Text style={styles.activityLocation}>Location: {activity.location}</Text>}
              {activity.estimatedCost && <Text style={styles.activityPrice}>Cost: {activity.estimatedCost}</Text>}
              {activity.description && <Text style={styles.activityDescription}>{activity.description}</Text>}
              {activity.tips && <Text style={styles.activityTips}>Tip: {activity.tips}</Text>}
            </View>
          )) || (
            <Text style={styles.noActivitiesText}>No activities planned for this day</Text>
          )}

   
          {itinerary[selectedDay].summary && (
            <Text style={styles.daySummaryText}>{itinerary[selectedDay].summary}</Text>
          )}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  errorText: { fontSize: 18, color: '#FF3B30', textAlign: 'center' },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  summaryText: { fontSize: 14, color: '#333', lineHeight: 20 },
  daySelector: { flexDirection: 'row', paddingVertical: 10, backgroundColor: '#fff' },
  dayTab: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5, borderRadius: 20, backgroundColor: '#f1f3f4', alignItems: 'center' },
  dayTabActive: { backgroundColor: '#007AFF' },
  dayTabText: { fontSize: 14, color: '#666' },
  dayTabTextActive: { color: '#fff' },
  dayDetailsContainer: { padding: 16 },
  dayTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  dayTheme: { fontSize: 16, fontStyle: 'italic', color: '#007AFF', marginBottom: 12 },
  activityCard: { backgroundColor: '#fff', padding: 12, marginBottom: 10, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  activityName: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  activityTime: { fontSize: 14, color: '#007AFF' },
  activityLocation: { fontSize: 14, color: '#666' },
  activityPrice: { fontSize: 14, color: '#34C759' },
  activityDescription: { fontSize: 14, color: '#666', marginTop: 4 },
  activityTips: { fontSize: 14, color: '#FFA500', marginTop: 4 },
  noActivitiesText: { fontSize: 14, fontStyle: 'italic', color: '#666', textAlign: 'center', marginTop: 10 },
  daySummaryText: { fontSize: 14, color: '#333', marginTop: 12 },
});
