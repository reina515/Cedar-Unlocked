
# Cedar Unlocked 🌲

Cedar Unlocked is a **React Native + Expo (Web)** application that helps users plan trips, explore transport routes, and receive AI-powered travel recommendations.  
It integrates **Firebase**, **LocationIQ**, **Unsplash**, and **Gemini API** to deliver a seamless and smart travel experience.

---

## 📌 Features
-  **User Authentication** with Firebase (secure login & registration)  
-  **Public Transport Routes & Stops** stored in Firestore  
-  **Trip Planner** with calendar picker (start/end dates)  
-  **Accurate Geolocation** via LocationIQ API  
-  **Dynamic Visuals** powered by Unsplash images  
-  **AI Travel Recommendations** via Gemini API (future scope)  
-  **Cross-Platform** (works on Web, Emulator, or Mobile via Expo)  

---

##  Technologies

### Programming Languages
- **JavaScript** – Application logic and UI  
- **TypeScript** – Application logic and UI  
###  Frameworks & Libraries
- **React Native + Expo (Web)** – Build reusable UI & run on browsers/emulators  
- **React Navigation** – Multi-screen navigation  
- **Calendar Picker** – Date selection for trip planning  

###  Tools & Services
- **Firebase SDK & Firestore** – Authentication, cloud storage, real-time updates  
- **LocationIQ API** – Geolocation & routing data  
- **Unsplash API** – High-quality background images  
- **Gemini API** – AI-powered personalized trip recommendations  
- **GitHub** – Version control & collaboration  
- **Expo Web + Emulator** – Development & testing  

---

##  Getting Started  

###  Prerequisites
Before you begin, ensure you have installed:  
- [Node.js](https://nodejs.org/) (v20.12.2)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)  
- A Firebase project (to connect authentication & Firestore)  
- API keys for **LocationIQ**, **Unsplash**, and **Gemini**  

---

###  Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/reina515/Cedar-Unlocked.git
   cd Cedar-Unlocked

2. Install dependencies
   ```bash
   npm install
   
3. Start the app
   ```bash
   npx expo start
4.Firebase (authentication & Firestore)
   ```bash
npm install firebase

5.Calendar Picker (trip date selection)
   ```bash
npm install react-native-calendar-picker

6.UI Components / Styling
   ```bash
npm install @expo/vector-icons

7.Additional Tools for APIs
   ```bash
npm install axios


8. Configure environment variables

## Create a .env file in the root directory and add your API keys:

# Firebase Configuration
```env
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# API Keys
LOCATIONIQ_API_KEY=your_locationiq_key
UNSPLASH_API_KEY=your_unsplash_key
GEMINI_API_KEY=your_gemini_key


