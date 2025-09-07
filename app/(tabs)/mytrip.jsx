import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import UserTripList from '../../components/MyTrips/UserTripsList';
import { auth, db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constant/Colors';

export default function MyTrip() {
  const user = auth.currentUser;
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetMyTrips();
    }
  }, [user]);
  useFocusEffect(
    useCallback(() => {
      if (user) {
        GetMyTrips();
      }
    }, [user])
  );

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    
    try {
      if (!user?.email) {
        console.log("No authenticated user");
        setLoading(false);
        return;
      }

      console.log("Fetching trips for:", user.email);
      
      const q = query(
        collection(db, 'UserTrips'), 
        where('userEmail', '==', user.email)
      );
      
      const querySnapshot = await getDocs(q);
      console.log("Query completed. Found", querySnapshot.size, "trips");
      
      const trips = [];
      querySnapshot.forEach(doc => {
        const tripData = doc.data();
        console.log("Trip data structure:", {
          id: doc.id,
          destination: tripData?.aiTripData?.tripDetails?.destination || tripData?.locationInfo?.name,
          hasAiData: !!tripData?.aiTripData,
          hasLocationInfo: !!tripData?.locationInfo,
          isFavorited: tripData?.isFavorited || false
        });
        
        trips.push({
          id: doc.id,
          docId: doc.id,
          ...tripData
        });
      });
      
      trips.sort((a, b) => {
        const aTime = a.createdAt || 0;
        const bTime = b.createdAt || 0;
        return bTime - aTime; 
      });
      
      setUserTrips(trips);
      console.log("Final trips array:", trips.length);
      
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert("Error", "Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTripUpdate = () => {
    GetMyTrips();
  };

  const handleAddTrip = () => {
       if (!user?.email) {

      router.replace("/auth/sign-in");
      return;
    }
    router.push('/create-trip/search-place');
  };

  return (
    <ScrollView
      style={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: Colors.WHITE,
        height: '100%'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <Text
          style={{
            color: '#006A4E',
            fontFamily: 'outfit-bold',
            fontSize: 29
          }}
        >
          My Trips
        </Text>
        <TouchableOpacity onPress={handleAddTrip}>
          <Ionicons name="add-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={{ marginTop: 10, color: Colors.GRAY }}>
            Loading your trips...
          </Text>
        </View>
      )}
      
      {!loading && (
        userTrips?.length === 0 ? 
          <StartNewTripCard /> : 
          <UserTripList 
            userTrips={userTrips} 
            onTripUpdate={handleTripUpdate}
          />
      )}
    </ScrollView>
  );
}
