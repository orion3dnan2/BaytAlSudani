import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';

const countries = [
  { 
    id: 'sudan', 
    name: 'السودان', 
    flag: '🇸🇩',
    code: '+249'
  },
  { 
    id: 'egypt', 
    name: 'مصر', 
    flag: '🇪🇬',
    code: '+20'
  },
  { 
    id: 'saudi', 
    name: 'السعودية', 
    flag: '🇸🇦',
    code: '+966'
  },
  { 
    id: 'uae', 
    name: 'الإمارات', 
    flag: '🇦🇪',
    code: '+971'
  },
  { 
    id: 'qatar', 
    name: 'قطر', 
    flag: '🇶🇦',
    code: '+974'
  },
  { 
    id: 'bahrain', 
    name: 'البحرين', 
    flag: '🇧🇭',
    code: '+973'
  },
  { 
    id: 'oman', 
    name: 'سلطنة عُمان', 
    flag: '🇴🇲',
    code: '+968'
  },
  { 
    id: 'kuwait', 
    name: 'الكويت', 
    flag: '🇰🇼',
    code: '+965'
  }
];

const CountrySelectionScreen = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigation = useNavigation();

  const handleCountrySelect = async (country) => {
    try {
      await AsyncStorage.setItem('selectedCountry', JSON.stringify(country));
      setSelectedCountry(country);
      // Navigate to login after short delay
      setTimeout(() => {
        navigation.navigate('Login');
      }, 500);
    } catch (error) {
      console.error('خطأ في حفظ الدولة:', error);
    }
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        selectedCountry?.id === item.id && styles.selectedCountryItem
      ]}
      onPress={() => handleCountrySelect(item)}
    >
      <View style={styles.countryContent}>
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>{item.name}</Text>
          <Text style={styles.countryCode}>{item.code}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>البيت السوداني</Text>
        <Text style={styles.subtitle}>اختر دولتك للمتابعة</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={countries}
          renderItem={renderCountryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          منصة لربط التجار والخدمات السودانية في الوطن العربي
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  countryItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCountryItem: {
    backgroundColor: theme.colors.lightBlue,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  countryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  countryFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'right',
  },
  countryCode: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CountrySelectionScreen;