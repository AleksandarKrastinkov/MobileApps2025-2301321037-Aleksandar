import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MyPlantsScreen from '../screens/MyPlantsScreen';
import CareGuideScreen from '../screens/CareGuideScreen';
import CameraScreen from '../screens/CameraScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import ScanResultScreen from '../screens/ScanResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack (includes Camera and Results)
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#0a0e27' },
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
    <Stack.Screen name="ScanResult" component={ScanResultScreen} />
  </Stack.Navigator>
);

// My Plants Stack
const MyPlantsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#0a0e27' },
    }}
  >
    <Stack.Screen name="MyPlantsMain" component={MyPlantsScreen} />
    <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyPlants') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'CareGuide') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#1a1f3a',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#1a1f3a', '#0f1425']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="MyPlants" component={MyPlantsStack} />
      <Tab.Screen name="CareGuide" component={CareGuideScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

