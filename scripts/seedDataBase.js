
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, addDoc, collection, updateDoc } = require('firebase/firestore');


const firebaseConfig = {
  apiKey: "AIzaSyCyoF_Gf09CUM4XDeqa-_eVGZM0Rw_XAoU",
  authDomain: "ai-travel-planner-7b8cb.firebaseapp.com",
  projectId: "ai-travel-planner-7b8cb",
  storageBucket: "ai-travel-planner-7b8cb.firebasestorage.app",
  messagingSenderId: "871698685561",
  appId: "1:871698685561:web:2dd3395d27ddbd3f983ea8",
  measurementId: "G-GVNEHHGW0B"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const updatedRoutes = [
  { id: "BI", name: "LINE B1", price: 70000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "B2", name: "LINE B2", price: 70000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "B3", name: "LINE B3", price: 70000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "B4", name: "LINE B4", price: 70000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "B5", name: "LINE B5", price: 70000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "B6", name: "LINE B6", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "B7", name: "LINE B7", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "ML1", name: "LINE ML1", price: 200000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "ML2", name: "LINE ML2", price: 170000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "ML3", name: "LINE ML3", price: 70000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "ML4", name: "LINE ML4", price: 200000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
   { id: "Bus4", name: "Bus 4", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "Bus5", name: "Bus 5", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "Bus6", name: "Bus 6", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "Bus12", name: "Bus 12", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  { id: "Bus15", name: "Bus 15", price: 100000, schedule: { start: "06:00", end: "19:00", frequency: 25 } },
  
];

const additionalStops = [

  { route_id: "BI", name: "Nahr El Mot (City Mall)", lat: 33.9282, lng: 35.5794, order: 1 },
  { route_id: "BI", name: "Dora", lat: 33.9056, lng: 35.5661, order: 2 },
  { route_id: "BI", name: "Zaytouna Bay", lat: 33.9017, lng: 35.5006, order: 3 },
  { route_id: "BI", name: "AUB Seaside", lat: 33.9011, lng: 35.4849, order: 4 },
  { route_id: "BI", name: "Military Club", lat: 33.8897, lng: 35.4841, order: 5 },
  { route_id: "BI", name: "Cola", lat: 33.8721, lng: 35.51, order: 6 },
  { route_id: "BI", name: "Barbir", lat: 33.879, lng: 35.5157, order: 7 },
  { route_id: "BI", name: "Adliyeh", lat: 33.8765, lng: 35.5192, order: 8 },
  { route_id: "BI", name: "Nahr El Mot (City Mall)", lat: 33.9282, lng: 35.5794, order: 9 },

  { route_id: "B2", name: "Nahr El Mot (City Mall)", lat: 33.9282, lng: 35.5794, order: 1 },
  { route_id: "B2", name: "Dora", lat: 33.9056, lng: 35.5661, order: 2 },
  { route_id: "B2", name: "Adliyeh", lat: 33.8765, lng: 35.5192, order: 3 },
  { route_id: "B2", name: "Barbir", lat: 33.879, lng: 35.5157, order: 4 },
  { route_id: "B2", name: "Cola", lat: 33.8721, lng: 35.51, order: 5 },
  { route_id: "B2", name: "Raouche", lat: 33.8885, lng: 35.4753, order: 6 },
  { route_id: "B2", name: "Military Club", lat: 33.8897, lng: 35.4841, order: 7 },
  { route_id: "B2", name: "AUB Seaside", lat: 33.9011, lng: 35.4849, order: 8 },
  { route_id: "B2", name: "Zaytouna Bay", lat: 33.9017, lng: 35.5006, order: 9 },
  { route_id: "B2", name: "Nahr El Mot (City Mall)", lat: 33.9282, lng: 35.5794, order: 10 },
  

  { route_id: "B3", name: "Antelias", lat: 33.924, lng: 35.594, order: 1 },
  { route_id: "B3", name: "Jal El Dib", lat: 33.9186, lng: 35.5718, order: 2 },
  { route_id: "B3", name: "Zalka", lat: 33.9136, lng: 35.5602, order: 3 },
  { route_id: "B3", name: "Jdeideh", lat: 33.888, lng: 35.5422, order: 4 },
  { route_id: "B3", name: "Bourj Hammoud", lat: 33.8903, lng: 35.5451, order: 5 },
  { route_id: "B3", name: "Hamra", lat: 33.8963, lng: 35.4789, order: 10 },
  

  { route_id: "B4", name: "Martyrs' Square", lat: 33.8955, lng: 35.5098, order: 1 },
  { route_id: "B4", name: "Beirut Souks", lat: 33.8993, lng: 35.5041, order: 2 },
  { route_id: "B4", name: "Hamra", lat: 33.8963, lng: 35.4789, order: 3 },
  { route_id: "B4", name: "Lebanese University (Hadath)", lat: 33.8329, lng: 35.54, order: 6 },
  

  { route_id: "B5", name: "Ain Saadeh", lat: 33.87, lng: 35.6, order: 1 },
  { route_id: "B5", name: "Lebanese University (Fanar)", lat: 33.893, lng: 35.565, order: 2 },
  { route_id: "B5", name: "Hamra", lat: 33.8963, lng: 35.4789, order: 9 },

  { route_id: "B6", name: "Martyrs' Square", lat: 33.8955, lng: 35.5098, order: 1 },
  { route_id: "B6", name: "Cola", lat: 33.8721, lng: 35.51, order: 2 },
  { route_id: "B6", name: "Damour", lat: 33.727, lng: 35.4489, order: 4 },
  

  { route_id: "B7", name: "Mar Mikhael Station", lat: 33.901, lng: 35.5211, order: 1 },
  { route_id: "B7", name: "Adliyeh", lat: 33.8765, lng: 35.5192, order: 3 },
  { route_id: "B7", name: "Khalde", lat: 33.755, lng: 35.4889, order: 5 },
  
  { route_id: "ML1", name: "Adliyeh", lat: 33.8765, lng: 35.5192, order: 1 },
  { route_id: "ML1", name: "Aley", lat: 33.81, lng: 35.6, order: 4 },
  { route_id: "ML1", name: "Chtaura", lat: 33.8139, lng: 35.85, order: 6 },
  

  { route_id: "ML2", name: "Khalde", lat: 33.755, lng: 35.4889, order: 1 },
  { route_id: "ML2", name: "Sidon", lat: 33.557, lng: 35.3728, order: 5 },
  { route_id: "ML2", name: "Tyre", lat: 33.273, lng: 35.1936, order: 6 },
  

  { route_id: "ML3", name: "Dora", lat: 33.9056, lng: 35.5661, order: 1 },
  { route_id: "ML3", name: "Hadath", lat: 33.833, lng: 35.533, order: 4 },
  
  
  { route_id: "ML4", name: "National Museum", lat: 33.885, lng: 35.515, order: 1 },
  { route_id: "ML4", name: "Jounieh", lat: 33.98, lng: 35.64, order: 4 },
  { route_id: "ML4", name: "Byblos", lat: 34.12, lng: 35.65, order: 5 },
  { route_id: "ML4", name: "Tripoli", lat: 34.4367, lng: 35.8497, order: 7 },
  // === Bus 4 ===
  { route_id: "Bus4",  name: "Lebanese University",     order: 1 },
  { route_id: "Bus4",  name: "Laylakeh",                 order: 2 },
  { route_id: "Bus4",  name: "Kafaat",                   order: 3 },
  { route_id: "Bus4",  name: "Mar Mikhael Church",       order: 4 },
  { route_id: "Bus4",  name: "Beirut Mall",              order: 5 },
  { route_id: "Bus4",  name: "Tayouneh",                 order: 6 },
  { route_id: "Bus4",  name: "Barbir",                   order: 7 },
  { route_id: "Bus4",  name: "Martyrs' Square",          order: 8 },
  { route_id: "Bus4",  name: "Burg El Murr",             order: 9 },
  { route_id: "Bus4",  name: "Fransabank",               order: 10 },
  { route_id: "Bus4",  name: "Wardiye",                  order: 11 },
  { route_id: "Bus4",  name: "AUBMC",                    order: 12 },

  // === Bus 12 ===
  { route_id: "Bus12", name: "Burj Barajneh",            order: 1 },
  { route_id: "Bus12", name: "Haret Hreik",              order: 2 },
  { route_id: "Bus12", name: "Mucharafieh",              order: 3 },
  { route_id: "Bus12", name: "Chatila Roundabout",       order: 4 },
  { route_id: "Bus12", name: "Arab University",          order: 5 },
  { route_id: "Bus12", name: "Cola",                     order: 6 },
  { route_id: "Bus12", name: "Mar Elias",                order: 7 },
  { route_id: "Bus12", name: "Hamra",                    order: 8 },

  // === Bus 15 ===
  { route_id: "Bus15", name: "Dawra",                    order: 1 },
  { route_id: "Bus15", name: "BIEL",                     order: 2 },
  { route_id: "Bus15", name: "Zaitouna Bay",             order: 3 },
  { route_id: "Bus15", name: "Ein El Mraiseh",           order: 4 },
  { route_id: "Bus15", name: "AUB Seaside",              order: 5 },
  { route_id: "Bus15", name: "Manara",                   order: 6 },
  { route_id: "Bus15", name: "Rawsheh",                  order: 7 },
  { route_id: "Bus15", name: "Ramlet El Bayda",          order: 8 },
  { route_id: "Bus15", name: "Corniche Mazraa",          order: 9 },
  { route_id: "Bus15", name: "Nahr El Mott",             order: 10 },

  // === Bus 6 ===
  { route_id: "Bus6",  name: "Byblos",                   order: 1 },
  { route_id: "Bus6",  name: "Jounieh",                  order: 2 },
  { route_id: "Bus6",  name: "Kaslik",                   order: 3 },
  { route_id: "Bus6",  name: "Nahr El Kalb",             order: 4 },
  { route_id: "Bus6",  name: "Dbayeh",                   order: 5 },
  { route_id: "Bus6",  name: "Antelias (Highway bridge)",order: 6 },
  { route_id: "Bus6",  name: "Cola",                     order: 7 },

  // === Bus 5 ===
  { route_id: "Bus5",  name: "Hamra",                    order: 1 },
  { route_id: "Bus5",  name: "Rizk Hospital",            order: 2 },
  { route_id: "Bus5",  name: "Sassine",                  order: 3 },
  { route_id: "Bus5",  name: "Burj Hammoud",             order: 4 },
  { route_id: "Bus5",  name: "Fanar",                    order: 5 },
  { route_id: "Bus5",  name: "Lebanese University",      order: 6 },
  { route_id: "Bus5",  name: "Ain Saadeh",               order: 7 }


];

async function updateDatabase() {
  try {
    console.log("Starting database update...");
    
 
    console.log("\n📍 Updating routes with new schedules...");
    for (const route of updatedRoutes) {
      await updateDoc(doc(db, "routes", route.id), {
        schedule: route.schedule,
        name: route.name 
      });
      console.log(`✓ Updated route ${route.name}`);
    }
    

    console.log("\n🚏 Adding stops with coordinates...");
    for (const stop of additionalStops) {
      await addDoc(collection(db, "stops"), stop);
      console.log(`✓ Added stop ${stop.name} for route ${stop.route_id}`);
    }
    
    console.log("\n🎉 Database update complete!");
    console.log("📊 Summary:");
    console.log(`   - Routes updated: ${updatedRoutes.length}`);
    console.log(`   - New stops added: ${additionalStops.length}`);
    
  } catch (error) {
    console.error("❌ Error updating database:", error);
  }
}
updateDatabase();
