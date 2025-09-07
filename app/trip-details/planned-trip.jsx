import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PlannedTrip from '../../components/TripDetails/PlannedTrip';

export default function PlannedTripPage() {
  const { tripId } = useLocalSearchParams();

  if (!tripId) return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Trip ID not provided</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <PlannedTrip tripId={tripId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50 },
});
