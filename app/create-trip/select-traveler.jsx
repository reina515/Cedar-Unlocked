import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CreateTripContext } from "../../context/CreateTripContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 570;
const SPACING = 20;

// Updated traveler alter ego options
const TravelerAlterEgoList = [
  {
    id: 1,
    title: "Explorer",
    desc: "Adventure seeker who loves discovering hidden gems and off-the-beaten-path locations",
    image: require("../../assets/images/explorer.jpg"),
    personality: "Adventurous, curious, loves hiking, nature, and unique experiences"
  },
  {
    id: 2,
    title: "Foodie",
    desc: "Culinary enthusiast who travels for authentic local flavors and dining experiences",
    image: require("../../assets/images/foodie.jpg"),
    personality: "Food-focused, seeks authentic restaurants, street food, and cooking experiences"
  },
  {
    id: 3,
    title: "Relaxer",
    desc: "Seeks peaceful, stress-free vacations with spa treatments and leisurely activities",
    image: require("../../assets/images/relaxer.jpg"),
    personality: "Wellness-focused, prefers spas, beaches, peaceful environments, and slow travel"
  },
  {
    id: 4,
    title: "Culture Seeker",
    desc: "History and arts enthusiast who loves museums, historical sites, and cultural immersion",
    image: require("../../assets/images/culture.jpg"),
    personality: "Educational, loves museums, historical sites, local traditions, and cultural events"
  },
  {
    id: 5,
    title: "Party Animal",
    desc: "Social butterfly who enjoys vibrant nightlife, festivals, and energetic social scenes",
    image: require("../../assets/images/party.jpg"),
    personality: "Social, loves nightlife, bars, clubs, festivals, and meeting new people"
  }
];

const SelectTravelerAlterEgo = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#006A4E",
    });
  }, []);

  // Triple the data for infinite scroll effect
  const data = [...TravelerAlterEgoList, ...TravelerAlterEgoList, ...TravelerAlterEgoList];

  useEffect(() => {
    if (selectedTraveler) {
      setTripData({ ...tripData, traveler: selectedTraveler });
    }
  }, [selectedTraveler]);

  const renderTravelerCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    const isSelected = selectedTraveler?.id === item.id;

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }],
            opacity,
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? "#004D40" : "transparent",
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedTraveler(item)}
          style={styles.cardTouchable}
        >
          <ImageBackground
            source={item.image}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            {/* Gradient overlay for better text readability */}
            <View style={styles.gradientOverlay} />
            
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>
                {item.title}
              </Text>
              <Text style={styles.descText}>
                {item.desc}
              </Text>
              <Text style={styles.personalityText}>
                {item.personality}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = (CARD_WIDTH + SPACING) * TravelerAlterEgoList.length;

    if (offsetX <= 0) {
      scrollRef.current?.scrollToOffset({ offset: contentWidth, animated: false });
    } else if (offsetX >= contentWidth * 2) {
      scrollRef.current?.scrollToOffset({ offset: contentWidth, animated: false });
    }
  };

  const getItemLayout = (_, index) => ({
    length: CARD_WIDTH + SPACING,
    offset: (CARD_WIDTH + SPACING) * index,
    index,
  });

  const handleContinue = () => {
    // Use router.push instead of navigation.navigate for expo-router
    router.push("/create-trip/select-dates");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Your Travel Alter Ego
      </Text>
      <Text style={styles.subtitle}>
        What type of traveler are you?
      </Text>
      <Text style={styles.instructionText}>
        Swipe to discover your perfect travel personality
      </Text>

      <Animated.FlatList
        ref={scrollRef}
        data={data}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }], 
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderTravelerCard}
        getItemLayout={getItemLayout}
        initialScrollIndex={TravelerAlterEgoList.length}
      />

      {selectedTraveler && (
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.continueButton}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Continue as {selectedTraveler.title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
    paddingTop: 75
  },
  headerTitle: {
    fontFamily: "outfit-bold",
    fontSize: 32,
    color: "#006A4E",
    marginBottom: 5,
    paddingHorizontal: SPACING
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 18,
    color: "#444",
    marginBottom: 10,
    paddingHorizontal: SPACING
  },
  instructionText: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    color: "#006A4E",
    marginBottom: 20,
    paddingHorizontal: SPACING
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING / 2,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardTouchable: {
    flex: 1
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20
  },
  imageStyle: {
    borderRadius: 20
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  titleText: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: "#fff",
    marginBottom: 8
  },
  descText: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
    marginBottom: 8
  },
  personalityText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 18,
    fontStyle: 'italic'
  },
  flatListContent: {
    paddingHorizontal: SPACING
  },
  continueButton: {
    position: "absolute",
    bottom: 30,
    left: SPACING,
    right: SPACING,
    padding: 18,
    borderRadius: 25,
    backgroundColor: "#006A4E",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "outfit-bold",
    fontSize: 20,
    letterSpacing: 1
  }
});

export default SelectTravelerAlterEgo;