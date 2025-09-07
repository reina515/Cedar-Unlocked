import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HotelInfo({ hotelData }) {
  if (!hotelData) return null;

  const handleBooking = () => {
    if (hotelData.bookingUrl) {
      Linking.openURL(hotelData.bookingUrl);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#F59E0B" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#F59E0B" />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />
      );
    }
    
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Ionicons name="bed-outline" size={24} color="#4F46E5" />
        <Text style={styles.sectionTitle}>Hotel Recommendation</Text>
      </View>
      
      <View style={styles.hotelCard}>
        {hotelData.imageUrl && (
          <Image 
            source={{ uri: hotelData.imageUrl }}
            style={styles.hotelImage}
            defaultSource={require('../../assets/images/lebanon.jpg')}
          />
        )}
        
        <View style={styles.hotelDetails}>
          <Text style={styles.hotelName}>
            {hotelData.name || hotelData.hotelName || 'Hotel Name Not Available'}
          </Text>
          
          {hotelData.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {renderStars(hotelData.rating)}
              </View>
              <Text style={styles.ratingText}>
                {hotelData.rating} ({hotelData.reviewCount || 'No reviews'})
              </Text>
            </View>
          )}
          
          {hotelData.address && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <Text style={styles.addressText}>{hotelData.address}</Text>
            </View>
          )}
          
          {hotelData.price && (
            <View style={styles.priceRow}>
              <Ionicons name="pricetag-outline" size={16} color="#059669" />
              <Text style={styles.priceText}>
                {typeof hotelData.price === 'string' ? hotelData.price : `$${hotelData.price}/night`}
              </Text>
            </View>
          )}
          
          {hotelData.description && (
            <Text style={styles.description}>
              {hotelData.description}
            </Text>
          )}
          

          {hotelData.amenities && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Amenities:</Text>
              <View style={styles.amenitiesList}>
                {Array.isArray(hotelData.amenities) ? (
                  hotelData.amenities.map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.amenityText}>{hotelData.amenities}</Text>
                )}
              </View>
            </View>
          )}
          
    
          {hotelData.bookingUrl && (
            <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
              <Ionicons name="open-outline" size={16} color="white" />
              <Text style={styles.bookingButtonText}>Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  hotelCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  hotelDetails: {
    padding: 20,
  },
  hotelName: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'outfit-regular',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'outfit-regular',
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#059669',
    marginLeft: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    fontFamily: 'outfit-regular',
    marginBottom: 16,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: '#374151',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'outfit-regular',
    marginLeft: 4,
  },
  bookingButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookingButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginLeft: 6,
  },
});
