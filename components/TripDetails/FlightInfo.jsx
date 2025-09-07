import { Ionicons } from '@expo/vector-icons';
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function FlightInfo({ flightData }) {
  if (!flightData) return null;

  const handleBooking = (bookingUrl) => {
    if (bookingUrl) {
      Linking.openURL(bookingUrl);
    }
  };

  const renderFlightCard = (flight, title, icon) => {
    if (!flight) return null;

    return (
      <View style={styles.flightCard}>
        <View style={styles.flightHeader}>
          <Ionicons name={icon} size={20} color="#4F46E5" />
          <Text style={styles.flightTitle}>{title}</Text>
        </View>
        
        <View style={styles.flightRoute}>
          <View style={styles.airportInfo}>
            <Text style={styles.airportCode}>
              {flight.departure?.airport || flight.from || 'DEP'}
            </Text>
            <Text style={styles.airportName}>
              {flight.departure?.city || flight.departureCity || 'Departure'}
            </Text>
            <Text style={styles.flightTime}>
              {flight.departure?.time || flight.departureTime || '--:--'}
            </Text>
          </View>
          
          <View style={styles.flightPath}>
            <View style={styles.flightLine} />
            <Ionicons name="airplane" size={20} color="#4F46E5" style={styles.airplane} />
            <View style={styles.flightLine} />
          </View>
          
          <View style={styles.airportInfo}>
            <Text style={styles.airportCode}>
              {flight.arrival?.airport || flight.to || 'ARR'}
            </Text>
            <Text style={styles.airportName}>
              {flight.arrival?.city || flight.arrivalCity || 'Arrival'}
            </Text>
            <Text style={styles.flightTime}>
              {flight.arrival?.time || flight.arrivalTime || '--:--'}
            </Text>
          </View>
        </View>
        
        <View style={styles.flightDetails}>
          {flight.airline && (
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={16} color="#64748B" />
              <Text style={styles.detailText}>{flight.airline}</Text>
            </View>
          )}
          
          {flight.flightNumber && (
            <View style={styles.detailItem}>
              <Ionicons name="ticket-outline" size={16} color="#64748B" />
              <Text style={styles.detailText}>Flight {flight.flightNumber}</Text>
            </View>
          )}
          
          {flight.duration && (
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#64748B" />
              <Text style={styles.detailText}>{flight.duration}</Text>
            </View>
          )}
          
          {flight.price && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>
                {typeof flight.price === 'string' ? flight.price : `$${flight.price}`}
              </Text>
            </View>
          )}
        </View>
        
        {flight.bookingUrl && (
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBooking(flight.bookingUrl)}
          >
            <Ionicons name="open-outline" size={16} color="white" />
            <Text style={styles.bookButtonText}>Book Flight</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Ionicons name="airplane-outline" size={24} color="#4F46E5" />
        <Text style={styles.sectionTitle}>Flight Information</Text>
      </View>
      
      {/* Outbound Flight */}
      {flightData.outbound && renderFlightCard(
        flightData.outbound, 
        'Outbound Flight', 
        'airplane-outline'
      )}
      
      {/* Return Flight */}
      {flightData.return && renderFlightCard(
        flightData.return, 
        'Return Flight', 
        'return-down-back-outline'
      )}
      
      {/* Single Flight (for one-way trips) */}
      {!flightData.outbound && !flightData.return && renderFlightCard(
        flightData, 
        'Flight Details', 
        'airplane-outline'
      )}
      
      {/* Flight Summary */}
      {(flightData.totalPrice || flightData.summary) && (
        <View style={styles.summaryCard}>
          {flightData.totalPrice && (
            <View style={styles.totalPriceRow}>
              <Text style={styles.totalPriceLabel}>Total Flight Cost:</Text>
              <Text style={styles.totalPrice}>
                {typeof flightData.totalPrice === 'string' 
                  ? flightData.totalPrice 
                  : `$${flightData.totalPrice}`}
              </Text>
            </View>
          )}
          
          {flightData.summary && (
            <Text style={styles.summaryText}>{flightData.summary}</Text>
          )}
          
          {flightData.tips && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Flight Tips:</Text>
              <Text style={styles.tipsText}>{flightData.tips}</Text>
            </View>
          )}
        </View>
      )}
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
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  flightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flightTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  airportInfo: {
    flex: 1,
    alignItems: 'center',
  },
  airportCode: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  airportName: {
    fontSize: 12,
    fontFamily: 'outfit-regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  flightTime: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: '#374151',
  },
  flightPath: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  flightLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
    airplane: {
    marginHorizontal: 8,
    transform: [{ rotate: '90deg' }], // rotate airplane icon for visual effect
  },
  flightDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: '#374151',
    marginLeft: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#1E293B',
    marginRight: 6,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: '#4F46E5',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'outfit-bold',
    marginLeft: 6,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalPriceLabel: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#1E293B',
  },
  totalPrice: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: '#4F46E5',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: '#64748B',
    marginBottom: 8,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'outfit-bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: '#64748B',
  },
});
