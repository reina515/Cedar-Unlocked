import { useRouter } from 'expo-router';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../configs/FirebaseConfig';

export default function StartNewTripCard() {
  const router = useRouter();
   const user = auth.currentUser;

  // Animated values for multiple shapes
  const float1 = new Animated.Value(0);
  const float2 = new Animated.Value(0);
  const float3 = new Animated.Value(0);
  const float4 = new Animated.Value(0);

  // Animation function
  const animate = (anim) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -15, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(anim, { toValue: 15, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  };

  animate(float1);
  animate(float2);
  animate(float3);
  animate(float4);

  // Button animation
  const scaleAnim = new Animated.Value(1);
  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

 const handleStartTrip = () => {
    if (!user?.email) {

      router.replace("/auth/sign-in");
      return;
    }
    
    router.push('/create-trip/search-place');
  };

  return (
    <View style={styles.wrapper}>
      {/* Floating decorative circles */}
      <Animated.View style={[styles.circle, styles.circle1, { transform: [{ translateY: float1 }] }]} />
      <Animated.View style={[styles.circle, styles.circle2, { transform: [{ translateY: float2 }] }]} />
      <Animated.View style={[styles.circle, styles.circle3, { transform: [{ translateY: float3 }] }]} />
      <Animated.View style={[styles.circle, styles.circle4, { transform: [{ translateY: float4 }] }]} />


      {/* Main content container */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Adventure Awaits!</Text>
        <Text style={styles.subtitle}>
          No trips planned yet? Explore Lebanon and start your next adventure today!
        </Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleStartTrip}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start a New Trip</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#eff8f4ff',
    paddingHorizontal: 20,
    
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 240,
    marginBottom:-10,
    marginTop:-10
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.3,
  },
  circle1: {
    width: 90,
    height: 90,
    backgroundColor: '#3CB371',
    top: -30,
    left: -40,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: '#2E8B57',
    bottom: 80,
    right: 20,
  },
  circle3: {
    width: 90,
    height: 90,
    backgroundColor: '#A8E6CF',
    top: 230,
    right: 30,
  },
  circle4: {
    width: 150,
    height: 150,
    backgroundColor: '#98FB98',
    bottom: 30,
    left: 70,
  },
   circle5: {
    width: 100,
    height: 100,
    backgroundColor: '#A8E6CF',
    top:120,
    left:40,
  },
  title: {
    fontSize: 34,
    fontFamily: 'outfit-bold',
    color: '#2E8B57',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 20,
    zIndex: 60,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'outfit',
    color: '#3CB371',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#2E8B57',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfit-medium',
    textAlign: 'center',
  },
});