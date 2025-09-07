import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constant/Colors';

export default function UserTripList({ userTrips, onTripUpdate }) {
  const router = useRouter();
  const [updatingFavorite, setUpdatingFavorite] = useState(null);
  
  if (!userTrips || userTrips.length === 0) return null;

  // Handle favorite toggle
  const toggleFavorite = async (trip) => {
    try {
      setUpdatingFavorite(trip.id);
      
      const tripRef = doc(db, 'UserTrips', trip.docId || trip.id);
      const newFavoriteStatus = !trip.isFavorited;
      
      // Update Firestore
      await updateDoc(tripRef, {
        isFavorited: newFavoriteStatus
      });
      
      // Call parent callback to refresh the trips list
      if (onTripUpdate) {
        onTripUpdate();
      }
      
    } catch (error) {
      console.error('Error updating favorite status:', error);
      Alert.alert('Error', 'Failed to update favorite status. Please try again.');
    } finally {
      setUpdatingFavorite(null);
    }
  };

  // Beautiful gradient colors for different destinations - you can customize these!
  const gradientColors = [
    ['#006A4E', '#008B5A'],  // Your brand green
    ['#2E8B57', '#3CB371'],  // Sea green

  ];

  const renderTripCard = ({ item: trip, index }) => {
    // Debug log the trip structure
    console.log("Rendering trip:", {
      id: trip.id,
      destination: trip.destination,
      locationName: trip.locationName,
      locationInfo: trip.locationInfo,
      aiTripData: !!trip.aiTripData,
      isFavorited: trip.isFavorited
    });

    // Try to get destination from multiple possible locations with better fallbacks
    const destination = trip?.destination || 
                       trip?.locationName || 
                       trip?.aiTripData?.tripDetails?.destination || 
                       trip?.locationInfo?.name || 
                       trip?.location || 
                       'Unknown location';
    
    const duration = trip?.aiTripData?.tripDetails?.duration || 
                    (trip?.totalNoOfDays ? `${trip.totalNoOfDays} days, ${trip.totalNoOfDays - 1} nights` : null) ||
                    '1 day';
    
    const travelerType = trip?.aiTripData?.tripDetails?.travelerType || 
                        trip?.traveler?.title || 
                        'Solo';
    
    const budget = trip?.aiTripData?.tripDetails?.budget || 
                  trip?.budget || 
                  'Budget not specified';

    // Format date if available
    const createdDate = trip?.createdAt 
      ? new Date(trip.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Recent';

    // Get gradient colors for this card
    const cardGradient = gradientColors[index % gradientColors.length];
    
    const isFavorited = trip.isFavorited || false;
    const isUpdatingThisTrip = updatingFavorite === trip.id;

    return (
      <TouchableOpacity
        key={trip.id}
        onPress={() =>
          router.push({
            pathname: '/trip-details',
            params: { 
              tripId: trip.id,
              trip: JSON.stringify(trip)
            },
          })
        }
        style={[styles.tripCard, { marginTop: index === 0 ? 20 : 15 }]}
      >
        {/* Beautiful Gradient Header */}
        <View style={[styles.cardHeader, { backgroundColor: cardGradient[0] }]}>
          <View style={styles.headerOverlay}>
            <View style={styles.destinationSection}>
              <Text style={styles.destinationText}>{destination}</Text>
              <View style={styles.createdDateBadge}>
                <Ionicons name="calendar-outline" size={14} color="#fff" />
                <Text style={styles.createdDateText}>{createdDate}</Text>
              </View>
            </View>
            
            <View style={styles.headerRightSection}>
              {/* Favorite Heart Icon */}
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(trip)}
                disabled={isUpdatingThisTrip}
              >
                <Ionicons 
                  name={isFavorited ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorited ? "#c62d2dff" : "#fff"} 
                  style={[
                    styles.favoriteIcon,
                    { opacity: isUpdatingThisTrip ? 0.5 : 1 }
                  ]}
                />
              </TouchableOpacity>
              
              {/* Trip Type Icon */}
              <View style={styles.tripTypeIcon}>
                <Ionicons 
                  name={travelerType.toLowerCase().includes('family') ? 'people' : 
                        travelerType.toLowerCase().includes('couple') ? 'heart' : 'person'}
                  size={24} 
                  color="#fff" 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Trip Details Content */}
        <View style={styles.cardContent}>
          {/* Duration Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={18} color="#006A4E" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{duration}</Text>
              </View>
            </View>
          </View>

          {/* Traveler Type Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={18} color="#006A4E" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Traveler Type</Text>
                <Text style={styles.infoValue}>{travelerType}</Text>
              </View>
            </View>
          </View>

          {/* Budget Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="wallet-outline" size={18} color="#006A4E" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>{budget}</Text>
              </View>
            </View>
          </View>

          {/* View Details Button */}
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() =>
              router.push({
                pathname: '/trip-details',
                params: { 
                  tripId: trip.id,
                  trip: JSON.stringify(trip)
                },
              })
            }
          >
            <Text style={styles.viewDetailsText}>View Trip Details</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>
          Your Recent Trips 
        </Text>
        <View style={styles.titleUnderline} />
      </View>
      
      <FlatList
        data={userTrips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Since it's inside ScrollView
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    color:'#0d785cff',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#006A4E',
    borderRadius: 2,
  },

  // Trip Card
  tripCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },

  // Card Header with Gradient
  cardHeader: {
    height: 150,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  destinationSection: {
    flex: 1,
  },
  destinationText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  createdDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  createdDateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // New header right section with favorite and trip type
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  
  // Favorite button styles
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  tripTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card Content
  cardContent: {
    padding: 20,
  },
  
  // Info Sections
  infoSection: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 106, 78, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    lineHeight: 20,
  },

  // View Details Button
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006A4E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 8,
    shadowColor: '#006A4E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});