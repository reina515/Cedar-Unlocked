import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { fetchRoutes, fetchStopsForRoute } from "../../services/firestoreTransport";

const { width } = Dimensions.get("window");

const ROUTE_THEME = {
  colors: { 
    primary: "#FFFFFF",   
    secondary: "#006A4E", 
    accent: "#dff0ecff"  
  },
  label: "Standard",
  emoji: "🚌",
  shadow: "#006A4E40",  
};

export default function TransportUI() {
  const [routesWithStops, setRoutesWithStops] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const routes = await fetchRoutes();
      const data = await Promise.all(
        routes.map(async (route) => {
          try {
            const stops = await fetchStopsForRoute(route.id);
            stops.sort((a, b) => a.order - b.order);
            return { ...route, stops, theme: ROUTE_THEME };
          } catch {
            return { ...route, stops: [], theme: ROUTE_THEME };
          }
        })
      );
      setRoutesWithStops(data);
      setLoading(false);
    } catch (e) {
      setError("Failed to load transportation routes");
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderRouteCard = ({ item: route }) => (
    <Animated.View 
      style={[
        styles.routeCard, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: route.theme.shadow,
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedRoute(route);
          setShowRouteDetails(true);
        }}
        activeOpacity={0.95}
        style={styles.touchable}
      >
        <View style={[styles.routeCardContainer, { backgroundColor: route.theme.colors.primary }]}>
         
          
          <View style={styles.routeHeader}>
            <View style={[styles.emojiContainer, { backgroundColor: route.theme.colors.accent }]}>
              <Text style={styles.routeEmoji}>{route.theme.emoji}</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName} numberOfLines={2}>{route.name}</Text>
              <View style={styles.routeType}>
                <Text style={styles.routeTypeText}>{route.theme.label.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Icon name="map-pin" size={16} color={route.theme.colors.primary} />
              </View>
              <Text style={styles.statText}>{route.stops.length} stops</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Icon name="clock" size={16} color={route.theme.colors.primary} />
              </View>
              <Text style={styles.statText}>{route.schedule?.frequency || "Var"} min</Text>
            </View>
          </View>

          <View style={styles.stopsPreview}>
            <Text style={styles.stopsLabel}>Route Preview:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.stopsList}
              contentContainerStyle={styles.stopsContent}
              nestedScrollEnabled={true}
            >
              {route.stops.slice(0, 3).map((stop, i) => (
                <View key={i} style={[styles.stopBadge, { backgroundColor: route.theme.colors.accent }]}>
                  <Text style={[styles.stopText, { color: "#006A4E"}]}>{stop.name}</Text>
                </View>
              ))}
              {route.stops.length > 5 && (
                <View style={[styles.stopBadge, styles.moreBadge, { backgroundColor: "#006A4E" }]}>
                  <Text style={styles.moreText}>+{route.stops.length - 5}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#374151" />
          <Text style={styles.loadingText}>Loading your routes...</Text>
          <Text style={styles.loadingSubtext}>Just a moment</Text>
        </View>
      </View>
    );

  if (error)
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.errorCard}>
          <Icon name="wifi-off" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F2937" barStyle="light-content" />
      

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Lebanon Transport</Text>
          <Text style={styles.headerSubtitle}>Discover Amazing Routes</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="user" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

 
      <FlatList
        data={routesWithStops}
        renderItem={renderRouteCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#374151']} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Icon name="search" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No routes found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        )}
      />
      <Modal
        visible={showRouteDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRouteDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowRouteDetails(false)}
            >
              <Icon name="x" size={24} color="#1b412fff" />
            </TouchableOpacity>
          </View>
          
          {selectedRoute && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={[styles.modalRouteHeader, { backgroundColor: selectedRoute.theme.colors.accent }]}>
                <View style={[styles.modalEmojiContainer, { backgroundColor: selectedRoute.theme.colors.primary }]}>
                  <Text style={styles.modalEmoji}>{selectedRoute.theme.emoji}</Text>
                </View>
                <View style={styles.modalRouteInfo}>
                  <Text style={styles.modalTitle}>{selectedRoute.name}</Text>
                  <Text style={[styles.modalType, { color:"#006A4E"}]}>
                    {selectedRoute.theme.label} Route
                  </Text>
                </View>
              </View>

              <View style={styles.modalStats}>
                <View style={styles.modalStatItem}>
                  <Icon name="map-pin" size={20} color={selectedRoute.theme.colors.primary} />
                  <Text style={styles.modalStatText}>{selectedRoute.stops.length} Total Stops</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Icon name="clock" size={20} color={selectedRoute.theme.colors.primary} />
                  <Text style={styles.modalStatText}>{selectedRoute.schedule?.frequency || "Variable"} min frequency</Text>
                </View>
              </View>

              <Text style={styles.stopsTitle}>All Stops</Text>
              {selectedRoute.stops.map((stop, i) => (
                <View key={i} style={styles.modalStopItem}>
                  <View style={[styles.stopNumber, { backgroundColor: selectedRoute.theme.colors.primary }]}>
                    <Text style={styles.stopNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.modalStopName}>{stop.name}</Text>
                  {i < selectedRoute.stops.length - 1 && (
                    <View style={[styles.stopConnector, { backgroundColor: selectedRoute.theme.colors.secondary }]} />
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f5f5ff" },

  loadingContainer: { 
    flex: 1, justifyContent: "center", alignItems: "center", 
    backgroundColor: "#F9FAFB", padding: 20 
  },
  loadingCard: { 
    backgroundColor: "#FFFFFF", padding: 40, borderRadius: 24, 
    alignItems: "center", elevation: 5 
  },
  loadingText: { marginTop: 16, fontSize: 18, fontWeight: "600", color: "#006A4E" },
  loadingSubtext: { marginTop: 4, fontSize: 14, color: "#6B7280" },

  errorCard: { backgroundColor: "#FFFFFF", padding: 40, borderRadius: 24, alignItems: "center", elevation: 5 },
  errorText: { marginTop: 16, fontSize: 16, color: "#006A4E", textAlign: "center" },
  retryButton: { marginTop: 20, backgroundColor: "#FF6B6B", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: "#FFFFFF", fontWeight: "600" },

  header: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
    paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20, 
    backgroundColor: "#006A4E" ,height: 140, 
  },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: "#D1D5DB", marginTop: 4 },
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#004C36", justifyContent: "center", alignItems: "center" },

  listContent: { paddingVertical: 16, paddingBottom: 100 },

  routeCard: { marginHorizontal: 20, marginVertical: 8, borderRadius: 20, elevation: 8 },
  touchableHeader: { borderRadius: 20 },
  routeCardContainer: { padding: 24, borderRadius: 20, position: "relative", overflow: "hidden" },

  decorativeCircle: { position: "absolute", borderRadius: 50 },
  circle1: { width: 80, height: 80, top: -20, right: -20, opacity: 0.3 },
  circle2: { width: 40, height: 40, bottom: 10, left: -10, opacity: 0.5 },

  routeHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  emojiContainer: { width: 56, height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 16 },
  routeEmoji: { fontSize: 24 },
  routeInfo: { flex: 1 },
  routeName: { fontSize: 18, fontWeight: "bold", color: "#006A4E", marginBottom: 4 },
  routeType: { backgroundColor: "#E6F4F1", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" },
  routeTypeText: { color: "#006A4E", fontSize: 12, fontWeight: "600" },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#E6F4F1", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#006A4E", justifyContent: "center", alignItems: "center", marginRight: 8 },
  statText: { color: "#006A4E", fontWeight: "600", fontSize: 14 },

  stopsPreview: { marginBottom: 16 },
  stopsLabel: { color: "#006A4E", fontSize: 14, fontWeight: "600", marginBottom: 12, opacity: 0.9 },
  stopsList: { 
    maxHeight: 40
  },
  stopsContent: { 
    alignItems: "center",
    paddingRight: 20
  },
  stopBadge: { 
    backgroundColor: "#006A4E", 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 16, 
    marginRight: 8,
    minWidth: 80
  },
  stopText: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },
  moreBadge: { backgroundColor: "#006A4E" },
  moreText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#006A4E", marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#6B7280", marginTop: 4 },

  modalContainer: { flex: 1, backgroundColor: "#e9f0ecff" },
  modalHeader: { alignItems: "center", paddingTop: 12, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  modalHandle: { width: 40, height: 4, backgroundColor: "#006A4E", borderRadius: 2, marginBottom: 16 },
  closeButton: { position: "absolute", right: 20, top: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },

  modalContent: { flex: 1, paddingHorizontal: 20 },
  modalRouteHeader: { flexDirection: "row", alignItems: "center", padding: 20, borderRadius: 16, marginVertical: 20 },
  modalEmojiContainer: { width: 64, height: 64, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 16 },
  modalEmoji: { fontSize: 32 },
  modalRouteInfo: { flex: 1 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#006A4E", marginBottom: 4 },
  modalType: { fontSize: 16, fontWeight: "600", color: "#006A4E" },

  modalStats: { flexDirection: "row", justifyContent: "space-around", marginBottom: 32 },
  modalStatItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  modalStatText: { marginLeft: 8, fontSize: 14, fontWeight: "600", color: "#006A4E" },

  stopsTitle: { fontSize: 18, fontWeight: "bold", color: "#006A4E", marginBottom: 20 },
  modalStopItem: { flexDirection: "row", alignItems: "center", marginBottom: 16, position: "relative" },
  stopNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 16, backgroundColor: "#E6F4F1" },
  stopNumberText: { color: "#006A4E", fontSize: 14, fontWeight: "bold" },
  modalStopName: { flex: 1, fontSize: 16, color: "#006A4E", fontWeight: "500" },
  stopConnector: { position: "absolute", left: 15, top: 32, width: 2, height: 16, backgroundColor: "#006A4E40" },
});
