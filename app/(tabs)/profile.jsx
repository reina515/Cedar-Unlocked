import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../configs/FirebaseConfig";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [favoriteTrips, setFavoriteTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/auth/sign-in');
      return;
    }

    setUser(auth.currentUser);

    // Real-time listener for user trips
    const q = query(
      collection(db, "UserTrips"),
      where("userEmail", "==", auth.currentUser.email)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const trips = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setUserTrips(trips);
      setFavoriteTrips(trips.filter(trip => trip.isFavorited));
      setLoading(false);
    }, error => {
      console.error("Error loading user trips:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/auth/sign-in');
            } catch (error) {
              Alert.alert("Error", "Failed to sign out");
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure you want to delete your account and all your trip data?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: confirmDeleteAccount
        }
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Final Confirmation",
      "Type 'DELETE' to confirm account deletion",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "I'm Sure", 
          style: "destructive",
          onPress: deleteUserAccount
        }
      ]
    );
  };

  const deleteUserAccount = async () => {
    try {
      const tripsQuery = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", auth.currentUser.email)
      );
      
      const snapshot = await getDocs(tripsQuery);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      await auth.currentUser.delete();
      router.replace('/auth/sign-in');
      
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again later.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      Alert.alert("Success", "Password updated successfully");
      setChangePasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert("Error", "Failed to update password. Please check your current password.");
    }
  };

  const handleViewFavorites = () => {
    router.push('/(tabs)/mytrip');
  };

  const handleFavoriteTrip = async (tripId, isFavorited) => {
    try {
      const tripRef = doc(db, "UserTrips", tripId);
      await updateDoc(tripRef, { isFavorited: !isFavorited });
      // No need to reload state; onSnapshot updates automatically
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const renderTripCard = (trip) => {
    const destination = trip?.destination || 
                       trip?.locationName || 
                       trip?.aiTripData?.tripDetails?.destination || 
                       trip?.locationInfo?.name || 
                       trip?.location || 
                       'Unknown location';

    const duration = trip?.aiTripData?.tripDetails?.duration || 
                    (trip?.totalNoOfDays ? `${trip.totalNoOfDays} days` : null) ||
                    '1 day';

    const createdDate = trip?.createdAt 
      ? new Date(trip.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Recent';

    return (
      <View key={trip.id} style={styles.tripCard}>
        {trip.locationInfo?.photoRef && (
          <Image 
            source={{ 
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${trip.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}` 
            }}
            style={styles.tripImage}
          />
        )}
        <View style={styles.tripInfo}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripDestination}>{destination}</Text>
            <TouchableOpacity onPress={() => handleFavoriteTrip(trip.id, trip.isFavorited)}>
              <Ionicons name={trip.isFavorited ? "heart" : "heart-outline"} size={16} color={trip.isFavorited ? "#FF4757" : "#666"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.tripDuration}>{duration}</Text>
          <Text style={styles.tripDate}>{createdDate}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006A4E" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#006A4E" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.displayName || user?.email?.split('@')[0] || 'Travel Explorer'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.memberSince}>
              <Ionicons name="calendar" size={14} color="#666" />
              <Text style={styles.memberText}>
                Member since {user?.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).getFullYear() : '2024'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Travel Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="map" size={24} color="#006A4E" />
            <Text style={styles.statNumber}>{userTrips.length}</Text>
            <Text style={styles.statLabel}>Trips Created</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{favoriteTrips.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="location" size={24} color="#006A4E" />
            <Text style={styles.statNumber}>
              {new Set(userTrips.map(trip => 
                trip?.destination || 
                trip?.locationName || 
                trip?.aiTripData?.tripDetails?.destination || 
                trip?.locationInfo?.name || 
                trip?.location
              ).filter(Boolean)).size}
            </Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
        </View>
      </View>

      {/* Recent Trips */}
      {userTrips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/mytrip')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userTrips.slice(0, 3).map(trip => renderTripCard(trip))}
          </ScrollView>
        </View>
      )}

      {/* Favorite Trips */}
      {favoriteTrips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite Trips</Text>
            <TouchableOpacity onPress={handleViewFavorites}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {favoriteTrips.slice(0, 3).map(trip => renderTripCard(trip))}
          </ScrollView>
        </View>
      )}

      {/* Empty favorites */}
      {favoriteTrips.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Trips</Text>
          <View style={styles.emptyFavoritesCard}>
            <Ionicons name="heart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyFavoritesText}>No favorite trips yet</Text>
            <Text style={styles.emptyFavoritesSubtext}>
              Tap the heart icon on any trip to add it to favorites
            </Text>
            <TouchableOpacity 
              style={styles.exploreTripButton}
              onPress={() => router.push('/(tabs)/mytrip')}
            >
              <Text style={styles.exploreTripButtonText}>Explore Your Trips</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

 

      {/* Account Management - All clickable */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => setChangePasswordModal(true)}
        >
          <View style={styles.optionContent}>
            <Ionicons name="lock-closed" size={24} color="#006A4E" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Change Password</Text>
              <Text style={styles.optionSubtitle}>Update your account password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => router.push('/(tabs)/mytrip')}
        >
          <View style={styles.optionContent}>
            <Ionicons name="bookmark" size={24} color="#006A4E" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>My Trips</Text>
              <Text style={styles.optionSubtitle}>View and manage your trips</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleViewFavorites}
        >
          <View style={styles.optionContent}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Favorite Trips</Text>
              <Text style={styles.optionSubtitle}>Your saved favorite destinations ({favoriteTrips.length})</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => Alert.alert("Coming Soon", "Favorite routes feature coming soon!")}
        >
          <View style={styles.optionContent}>
            <Ionicons name="map" size={24} color="#006A4E" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Favorite Routes</Text>
              <Text style={styles.optionSubtitle}>Your preferred travel routes</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => router.push('/create-trip/search-place')}
        >
          <View style={styles.optionContent}>
            <Ionicons name="add-circle" size={24} color="#006A4E" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Plan New Trip</Text>
              <Text style={styles.optionSubtitle}>Create your next adventure</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.optionCard, styles.logoutCard]}
          onPress={handleLogout}
        >
          <View style={styles.optionContent}>
            <Ionicons name="log-out" size={24} color="#FF6B6B" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, styles.logoutText]}>Sign Out</Text>
              <Text style={styles.optionSubtitle}>Sign out of your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, styles.deleteCard]}
          onPress={handleDeleteAccount}
        >
          <View style={styles.optionContent}>
            <Ionicons name="trash" size={24} color="#FF3B30" />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, styles.deleteText]}>Delete Account</Text>
              <Text style={styles.optionSubtitle}>Permanently delete your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity 
                onPress={() => setChangePasswordModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.textInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.textInput}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setChangePasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#006A4E',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#006A4E',
    fontWeight: '500',
  },

  // User Info Styles
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: -30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#006A4E',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006A4E',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },

  // Trip Card Styles (Non-clickable)
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  tripInfo: {
    padding: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  tripDuration: {
    fontSize: 14,
    color: '#006A4E',
    marginBottom: 2,
  },
  tripDate: {
    fontSize: 12,
    color: '#666',
  },

  // Empty favorites state
  emptyFavoritesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreTripButton: {
    backgroundColor: '#006A4E',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  exploreTripButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Option Card Styles (Clickable)
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  logoutText: {
    color: '#FF6B6B',
  },
  deleteCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  deleteText: {
    color: '#FF3B30',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#006A4E',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});