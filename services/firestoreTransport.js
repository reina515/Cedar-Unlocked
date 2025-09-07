
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig"; 

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
      
