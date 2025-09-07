import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../configs/FirebaseConfig";

export default function TripDetails() {
  const { tripId } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (tripId) {
      getTripDetails();
    }
  }, [tripId]);

  const getTripDetails = async () => {
    try {
      const docRef = doc(db, "UserTrips", String(tripId));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTripDetails(data);
        console.log("Trip details loaded:", data);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const getEndDate = (startDate?: string, days?: number) => {
    if (!startDate || !days) return 'Date not available';
    try {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + (days * 24 * 60 * 60 * 1000));
      return end.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Failed to open URL");
    }
  };

  // ===== RENDERERS =====

  const renderDayItinerary = (dayKey: string, activities: any[]) => {
    const dayNumber = dayKey.replace('day', '');
    const isExpanded = !!expandedSections[dayKey];

    return (
      <View key={dayKey} style={styles.dayCard}>
        <TouchableOpacity
          style={styles.dayHeader}
          onPress={() => toggleSection(dayKey)}
          activeOpacity={0.7}
        >
          <View style={styles.dayHeaderContent}>
            <View style={styles.dayNumberBadge}>
              <Text style={styles.dayNumberText}>{dayNumber}</Text>
            </View>
            <Text style={styles.dayTitle}>Day {dayNumber}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#006A4E"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.dayContent}>
            {activities.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                {/* Top meta row: time + duration + cost */}
                <View style={styles.metaRow}>
                  <View style={styles.timeSection}>
                    <View style={styles.timeIconContainer}>
                      <Ionicons name="time-outline" size={18} color="#fff" />
                    </View>
                    <Text style={styles.activityTime} numberOfLines={1}>
                      {activity.time}
                    </Text>
                  </View>

                  {!!activity.duration && (
                    <View style={styles.durationBadge}>
                      <Ionicons name="hourglass-outline" size={12} color="#006A4E" />
                      <Text style={styles.activityDuration} numberOfLines={1}>
                        {activity.duration}
                      </Text>
                    </View>
                  )}

                  {!!activity.estimatedCost && (
                    <View style={styles.costBadge}>
                      <Ionicons name="wallet-outline" size={14} />
                      <Text style={styles.activityCost} numberOfLines={1}>
                        {activity.estimatedCost}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Title & description */}
                {!!activity.activity && (
                  <Text style={styles.activityTitle}>{activity.activity}</Text>
                )}
                {!!activity.description && (
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                )}

                {/* Location */}
                {!!activity.location && (
                  <View style={styles.locationSection}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.activityLocation}>
                      {activity.location}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderHotel = (hotel: any, index: number) => (
    <View key={index} style={styles.hotelCard}>
      {!!hotel.hotelImageUrl && (
        <Image source={{ uri: hotel.hotelImageUrl }} style={styles.hotelImage} />
      )}

      <View style={styles.hotelContent}>
        {!!hotel.hotelName && <Text style={styles.hotelName}>{hotel.hotelName}</Text>}
        {!!hotel.hotelAddress && (
          <Text style={styles.hotelAddress}>{hotel.hotelAddress}</Text>
        )}
        {!!hotel.description && (
          <Text style={styles.hotelDescription}>{hotel.description}</Text>
        )}

        <View style={styles.hotelDetails}>
          <View style={styles.hotelDetailRow}>
            <Ionicons name="star" size={18} color="#FFD700" />
            {!!hotel.rating && <Text style={styles.hotelRating}>{hotel.rating}</Text>}
          </View>

          {!!hotel.price && (
            <View style={styles.hotelPriceRow}>
              <Text style={styles.hotelPrice}>{hotel.price}</Text>
            </View>
          )}

          {!!hotel.amenities?.length && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Amenities:</Text>
              <View style={styles.amenitiesList}>
                {hotel.amenities.map((amenity: string, idx: number) => (
                  <View key={idx} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderFlight = (flight: any, index: number) => (
    <View key={index} style={styles.flightCard}>
      <View style={styles.flightHeader}>
        {!!flight.airline && <Text style={styles.flightAirline}>{flight.airline}</Text>}
        {!!flight.flightNumber && (
          <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
        )}
      </View>

      <View style={styles.flightRoute}>
        <Text style={styles.flightLocation} numberOfLines={2}>
          {flight.origin}
        </Text>
        <Ionicons name="airplane" size={22} color="#007AFF" style={styles.flightIcon} />
        <Text style={styles.flightLocation} numberOfLines={2}>
          {flight.destination}
        </Text>
      </View>

      <View style={styles.flightDates}>
        {!!flight.departureDate && (
          <Text style={styles.flightDate}>Departure: {flight.departureDate}</Text>
        )}
        {!!flight.returnDate && (
          <Text style={styles.flightDate}>Return: {flight.returnDate}</Text>
        )}
      </View>

      <View style={styles.flightFooter}>
        {!!flight.price && (
          <View style={styles.flightPriceContainer}>
            <Text style={styles.flightPrice}>{flight.price}</Text>
          </View>
        )}
        {!!flight.bookingUrl && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => openUrl(flight.bookingUrl)}
          >
            <Text style={styles.bookButtonText}>Book Flight</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderPlace = (place: any, index: number) => (
    <View key={index} style={styles.placeCard}>
      {!!place.placeImageUrl && (
        <Image source={{ uri: place.placeImageUrl }} style={styles.placeImage} />
      )}

      <View style={styles.placeContent}>
        {!!place.placeName && <Text style={styles.placeName}>{place.placeName}</Text>}
        {!!place.placeDetails && (
          <Text style={styles.placeDescription}>{place.placeDetails}</Text>
        )}

        <View style={styles.placeInfo}>
          {!!place.travelTime && (
            <View style={styles.placeInfoRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.placeInfoText}>{place.travelTime}</Text>
            </View>
          )}
          {!!place.ticketPricing && (
            <View style={styles.placeInfoRow}>
              <Ionicons name="pricetag-outline" size={16} color="#666" />
              <Text style={styles.placeInfoText}>{place.ticketPricing}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderBudgetBreakdown = (budget: Record<string, string | number>) => {
    // Separate total from other budget items
    const budgetEntries = Object.entries(budget);
    const totalEntry = budgetEntries.find(([label]) => 
      label.toLowerCase().includes('total')
    );
    const otherEntries = budgetEntries.filter(([label]) => 
      !label.toLowerCase().includes('total')
    );
    
    // Combine with total at the end
    const orderedEntries = totalEntry ? [...otherEntries, totalEntry] : budgetEntries;

    return (
      <View style={styles.budgetCard}>
        {orderedEntries.map(([label, value]) => (
          <View key={label} style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>{label}</Text>
            <Text style={styles.budgetAmount}>{String(value)}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006A4E" />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Trip details not found</Text>
      </View>
    );
  }

  const { aiTripData, locationInfo, traveler, budget, totalNoOfDays, startDate } = tripDetails;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Floating header back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={21} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
      </View>

      {/* Gradient hero */}
      <LinearGradient
        colors={['#006A4E', '#008B5A', '#00A86B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.gradientOverlayContent}>
          <Text style={styles.destinationName}>
            {locationInfo?.name || 'Unknown Destination'}
          </Text>
          <View style={styles.quickInfoRow}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.quickInfoText}>{totalNoOfDays} days</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons name="people-outline" size={20} color="#fff" />
              <Text style={styles.quickInfoText}>{traveler?.title || 'Trip'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Trip overview */}
      <View style={styles.section}>
        <View style={styles.tripInfoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={22} color="#006A4E" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Travel Dates</Text>
              <Text style={styles.infoValue}>
                {formatDate(startDate)} - {getEndDate(startDate, totalNoOfDays)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={22} color="#006A4E" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>
                {totalNoOfDays} days, {Math.max((totalNoOfDays ?? 1) - 1, 0)} nights
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people" size={22} color="#006A4E" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Travelers</Text>
              <Text style={styles.infoValue}>{traveler?.title || 'Not specified'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wallet" size={22} color="#006A4E" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Budget</Text>
              <Text style={styles.infoValue}>{budget || 'Not specified'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Daily Itinerary */}
      {!!aiTripData?.dailyItinerary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Itinerary</Text>
          {Object
            .entries(aiTripData.dailyItinerary)
            .sort(([a], [b]) => parseInt(a.replace("day","")) - parseInt(b.replace("day","")))
            .map(([dayKey, activities]) => renderDayItinerary(dayKey, activities as any[]))}
        </View>
      )}

      {/* Hotels */}
      {!!aiTripData?.hotels?.length && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Hotels</Text>
          {aiTripData.hotels.map((hotel: any, index: number) => renderHotel(hotel, index))}
        </View>
      )}

      {/* Flights */}
      {!!aiTripData?.flights?.length && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Options</Text>
          {aiTripData.flights.map((flight: any, index: number) => renderFlight(flight, index))}
        </View>
      )}

      {/* Places Nearby */}
      {!!aiTripData?.placesNearby?.length && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Places to Visit</Text>
          {aiTripData.placesNearby.map((place: any, index: number) => renderPlace(place, index))}
        </View>
      )}

      {/* Budget Breakdown */}
      {!!aiTripData?.totalBudgetBreakdown && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Breakdown</Text>
          {renderBudgetBreakdown(aiTripData.totalBudgetBreakdown)}
        </View>
      )}

      {/* Local Tips */}
      {!!aiTripData?.localTips?.length && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Tips</Text>
          <View style={styles.tipsCard}>
            {aiTripData.localTips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="bulb" size={18} color="#FFD700" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Trip Summary */}
      {!!aiTripData?.tripSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{aiTripData.tripSummary}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Loading & Error
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa',
  },
  loadingText: { marginTop: 16, fontSize: 18, color: '#666' },
  errorContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa',
  },
  errorText: { fontSize: 20, color: '#FF3B30', textAlign: 'center', paddingHorizontal: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 12, marginRight: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20,
  },
  headerTitle: {
    fontSize: 22, fontWeight: '700', color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },

  // Gradient hero
  gradientHeader: {
    height: 280,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  gradientOverlayContent: {
    width: '100%',
    alignItems: 'center',
  },
  destinationName: {
    fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign:"center", marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  quickInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 30,
  },
  quickInfoItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  quickInfoText: { color: '#fff', fontSize: 16, fontWeight: '500', marginLeft: 6 },

  // Section wrapper
  section: {
    marginTop: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
  
  },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#014331ff', marginBottom: 25},

  // Trip Info
  tripInfoCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
    elevation: 5, borderWidth: 1, borderColor: 'rgba(0,106,78,0.1)',
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoLabel: { fontSize: 16, color: '#666', marginBottom: 4 },
  infoValue: { fontSize: 18, fontWeight: '500', color: '#000', lineHeight: 24 },

  // Day card
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: 'rgba(0,106,78,0.05)',
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,106,78,0.1)',
  },
  dayHeaderContent: { flexDirection: 'row', alignItems: 'center' },
  dayNumberBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#006A4E',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  dayNumberText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  dayTitle: { fontSize: 20, fontWeight: '700', color: '#006A4E' },
  dayContent: { padding: 16, paddingTop: 12 },

  // Activity card
  activityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,106,78,0.08)',
  },

  // Top meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    rowGap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  timeSection: { flexDirection: 'row', alignItems: 'center', maxWidth: '100%' },
  timeIconContainer: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#006A4E',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  activityTime: { fontSize: 16, fontWeight: '600', color: '#006A4E', flexShrink: 1 },

  durationBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,106,78,0.1)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  activityDuration: { fontSize: 13, color: '#006A4E', fontWeight: '500', marginLeft: 4 },

  costBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(40,167,69,0.1)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
  },
  activityCost: { fontSize: 15, fontWeight: '600', color: '#28a745', marginLeft: 4 },

  // Body
  activityTitle: {
    fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 6, lineHeight: 24,
  },
  activityDescription: {
    fontSize: 15, color: '#666', lineHeight: 20, marginBottom: 10, flexWrap: 'wrap',
  },

  // Location row
  locationSection: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 6, paddingHorizontal: 10,
    backgroundColor: 'rgba(108,117,125,0.08)',
    borderRadius: 8,
  },
  activityLocation: {
    fontSize: 14, color: '#555', fontWeight: '500', flex: 1, marginLeft: 6, flexShrink: 1,
  },

  // Hotels
  hotelCard: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: 'hidden',
  },
  hotelImage: { width: '100%', height: 150, resizeMode: 'cover' },
  hotelContent: { padding: 16 },
  hotelName: { fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 6 },
  hotelAddress: { fontSize: 15, color: '#666', marginBottom: 10, lineHeight: 22 },
  hotelDescription: { fontSize: 15, color: '#333', marginBottom: 16, lineHeight: 22 },
  hotelDetails: { marginTop: 8 },
  hotelDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  hotelRating: { marginLeft: 6, fontSize: 15, fontWeight: '500', color: '#333' },
  hotelPriceRow: { marginBottom: 12 },
  hotelPrice: { fontSize: 17, fontWeight: '600', color: '#006A4E' },
  amenitiesContainer: { marginTop: 12 },
  amenitiesTitle: { fontSize: 15, fontWeight: '500', color: '#333', marginBottom: 8 },
  amenitiesList: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityTag: {
    backgroundColor: '#e9ecef', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 12, marginRight: 8, marginBottom: 6,
  },
  amenityText: { fontSize: 14, color: '#495057' },

  // Flights
  flightCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  flightHeader: { marginBottom: 12 },
  flightAirline: { fontSize: 17, fontWeight: '600', color: '#000', marginBottom: 4 },
  flightNumber: { fontSize: 16, color: '#666' },
  flightRoute: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, paddingHorizontal: 10,
  },
  flightLocation: {
    fontSize: 17, fontWeight: '500', color: '#333', textAlign: 'center', flex: 1, flexShrink: 1,
  },
  flightIcon: { marginHorizontal: 12 },
  flightDates: { marginBottom: 16 },
  flightDate: { fontSize: 16, color: '#666', marginBottom: 6 },
  flightFooter: { marginTop: 8 },
  flightPriceContainer: { marginBottom: 12 },
  flightPrice: { fontSize: 20, fontWeight: '600', color: '#006A4E' },
  bookButton: {
    backgroundColor: '#006A4E', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  bookButtonText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  // Places
  placeCard: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  placeImage: { width: '100%', height: 120, resizeMode: 'cover' },
  placeContent: { padding: 16 },
  placeName: { fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 6 },
  placeDescription: { fontSize: 15, color: '#666', marginBottom: 12, lineHeight: 22 },
  placeInfo: { marginTop: 8 },

  placeInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  placeInfoText: { marginLeft: 6, fontSize: 14, color: '#666', flexShrink: 1 },

  // Budget
  budgetCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  budgetRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  budgetLabel: { fontSize: 16, color: '#666' },
  budgetAmount: { fontSize: 16, fontWeight: '500', color: '#333' },

  // Tips
  tipsCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  tipText: { marginLeft: 10, fontSize: 15, color: '#333', lineHeight: 22, flex: 1, flexShrink: 1 },

  // Summary
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 20,
  },
  summaryText: { fontSize: 16, lineHeight: 26, color: '#333' },
});
