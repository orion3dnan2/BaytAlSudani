import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import CountrySelectionScreen from './src/screens/CountrySelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import CreateProductScreen from './src/screens/CreateProductScreen';
import CreateStoreScreen from './src/screens/CreateStoreScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import StoreDetailsScreen from './src/screens/StoreDetailsScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import JobsScreen from './src/screens/JobsScreen';
import AnnouncementsScreen from './src/screens/AnnouncementsScreen';

// Import context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { theme } from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Marketplace') {
            iconName = 'store';
          } else if (route.name === 'Services') {
            iconName = 'miscellaneous-services';
          } else if (route.name === 'Jobs') {
            iconName = 'work';
          } else if (route.name === 'Announcements') {
            iconName = 'announcement';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'الرئيسية' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen} 
        options={{ title: 'المتاجر' }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{ title: 'الخدمات' }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen} 
        options={{ title: 'الوظائف' }}
      />
      <Tab.Screen 
        name="Announcements" 
        component={AnnouncementsScreen} 
        options={{ title: 'الإعلانات' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen} 
        options={{ title: 'الملف الشخصي' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const [countrySelected, setCountrySelected] = useState(false);
  
  useEffect(() => {
    checkCountrySelection();
  }, []);
  
  const checkCountrySelection = async () => {
    try {
      const selectedCountry = await AsyncStorage.getItem('selectedCountry');
      setCountrySelected(!!selectedCountry);
    } catch (error) {
      console.error('Error checking country selection:', error);
    }
  };
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!countrySelected ? (
          <Stack.Screen 
            name="CountrySelection" 
            component={CountrySelectionScreen} 
            options={{ headerShown: false }}
          />
        ) : !isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CreateProduct" 
              component={CreateProductScreen} 
              options={{ 
                title: 'إضافة منتج جديد',
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff'
              }}
            />
            <Stack.Screen 
              name="CreateStore" 
              component={CreateStoreScreen} 
              options={{ 
                title: 'إنشاء متجر جديد',
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff'
              }}
            />
            <Stack.Screen 
              name="StoreDetails" 
              component={StoreDetailsScreen} 
              options={{ 
                title: 'تفاصيل المتجر',
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: '#fff'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}