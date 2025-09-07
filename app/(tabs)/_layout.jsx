import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:"#006A4E"
      }}
    >
      <Tabs.Screen name="mytrip" 
        options={{
          tabBarIcon: ({ color}) => <Entypo name="location" size={24} color={color} />,
          tabBarLabel:"My Trip",
        }}
      />
      <Tabs.Screen name="transportation"
        options={{
          tabBarIcon: ({ color}) => <MaterialIcons name="directions-bus" size={24} color={color} />,
          tabBarLabel:"Transport",
        }}
      />
      <Tabs.Screen name="discover"
        options={{
          tabBarIcon: ({ color}) => <Ionicons name="globe-sharp" size={24} color={color}  />,
          tabBarLabel:"Discover",
        }} 
      />
      <Tabs.Screen name="profile"
        options={{
          tabBarIcon: ({ color}) => <Ionicons name="person-circle-sharp" size={24} color={color} />,
          tabBarLabel:"Profile",
        }}
       />
    </Tabs>
  );
}
