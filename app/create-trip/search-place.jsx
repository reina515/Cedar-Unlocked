import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constant/Colors";
import { CreateTripContext } from "../../context/CreateTripContext";
const { width, height } = Dimensions.get("window");

export default function SearchPlace() {
        useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: "#006A4E",
        });
      }, []);

  const navigation = useNavigation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeImage, setPlaceImage] = useState(null);

  const LOCATIONIQ_KEY = "pk.29cb49746512a7bc4eaaa6b7d25ff31b";
  const UNSPLASH_KEY = "GdbBs3XZ-GtIZKpPtvTTEiCHo1bbiN93SCtb066_gJI";

  const debounceRef = useRef(null);
  const { setTripData } = useContext(CreateTripContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Search locations
  const searchPlaces = (text) => {
    setQuery(text);
    setResults([]);
    if (text.length < 2) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/autocomplete.php`,
          {
            params: {
              key: LOCATIONIQ_KEY,
              q: text,
              format: "json",
              countrycodes: "LB",
              limit: 5,
            },
          }
        );
        setResults(response.data);
      } catch (error) {
        console.error(error);
      }
    }, 300); // shorter debounce for snappier feel
  };

  // Select a place
  const handleSelect = async (item) => {
    setSelectedPlace(item);

    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: { query: item.display_name || item.name, per_page: 1 },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      });

      if (res.data.results.length > 0) {
        setPlaceImage(res.data.results[0].urls.regular);

        // Animate fade-in
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      } else {
        setPlaceImage(null);
      }
    } catch (err) {
      console.error(err);
      setPlaceImage(null);
    }
  };

  // Confirm place
  const confirmPlace = () => {
    if (!selectedPlace) return;

    setTripData({
      locationInfo: {
        name: selectedPlace.display_name || selectedPlace.name,
        coordinates: { lat: selectedPlace.lat, lon: selectedPlace.lon },
        type: selectedPlace.type,
        address: selectedPlace.address,
        boundingbox: selectedPlace.boundingbox,
        image: placeImage,
      },
    });

    router.push("/create-trip/select-traveler");
  };

  return (
    <View style={styles.container}>
      {/* Search bar always on top */}
      <View style={styles.searchWrapper}>
   <TextInput
  placeholder="Search places in Lebanon..."
  placeholderTextColor="rgba(0,0,0,0.3)"
  value={query}
  onChangeText={searchPlaces}       // keeps your search working
  onFocus={() => {                  // THIS clears selected place and image
    setSelectedPlace(null);
    setPlaceImage(null);
  }}
  style={styles.searchInput}
/>

      </View>

      {/* Background Image */}
      {selectedPlace && placeImage && (
        <Animated.Image
          source={{ uri: placeImage }}
          style={[styles.backgroundImage, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
      )}

      {/* LocationIQ Options */}
      {!selectedPlace && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={styles.listItem}
            >
              <Text style={styles.listItemText}>{item.display_name}</Text>
              <View style={styles.divider} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Confirm button */}
      {selectedPlace && (
        <View style={styles.confirmContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={confirmPlace}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmText}>
  Confirm This Place: {selectedPlace.display_name || selectedPlace.name}
</Text>

          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  searchWrapper: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  backgroundImage: {
    position: "absolute",
    top: 100, // leaves space for search bar
    width: "100%",
    height: height - 100,
  },
  list: {
    marginTop: 150,
    paddingHorizontal: 20,
  },
  listItem: {
    paddingVertical: 10,
  },
  listItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 8,
  },
  confirmContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#c0bcbcff",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
