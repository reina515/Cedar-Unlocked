
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


9.## 🔑 Firebase Service Account Key Setup

Some features of the app (like server-side Firestore access or admin tasks) require a **Firebase Service Account Key**.  

### Steps to Get Your Service Account Key

1. **Go to Firebase Console**  
   Open [https://console.firebase.google.com/](https://console.firebase.google.com/) and select your project.

2. **Navigate to Project Settings**  
   Click the **gear icon** next to *Project Overview* → **Project Settings**.

3. **Go to Service Accounts**  
   On the left menu, select **Service Accounts**.

4. **Generate a New Private Key**  
   - Click **“Generate New Private Key”**.  
   - Confirm, and Firebase will download a JSON file.

5. **Secure the JSON File**  
   The JSON file contains sensitive credentials like:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "xxxx",
     "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
     "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
   }



