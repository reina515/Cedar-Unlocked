import { Text, View } from 'react-native';
import { Colors } from '../../constant/Colors';

export default function discover() {
  return (
    <View style={{
      padding: 25,
      paddingTop: 55,
      backgroundColor: Colors.WHITE,
      height: '100%'
    }}>
      <Text style={{
        color: "#006A4E",
        fontFamily: 'outfit-bold',
        fontSize: 30
      }}>Discover</Text>
      
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          color: "#006A4E",
          fontFamily: 'outfit-medium',
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 10
        }}>Local Recommendations</Text>
        
        <Text style={{
          color: "#666",
          fontFamily: 'outfit-regular',
          fontSize: 16,
          textAlign: 'center'
        }}>Coming Soon!</Text>
      </View>
    </View>
  )
}