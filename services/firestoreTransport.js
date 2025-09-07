// app/services/firestoreTransport.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig"; // adjust if needed

// Fetch all routes (buses & vans)
export const fetchRoutes = async () => {
  try {
    const snapshot = await getDocs(collection(db, "routes"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
};

// Fetch stops for a specific route
export const fetchStopsForRoute = async (routeId) => {
  try {
    const q = query(
      collection(db, "stops"),
      where("route_id", "==", routeId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching stops:", error);
    return [];
  }
};
      