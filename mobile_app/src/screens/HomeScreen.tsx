import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Chip,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme, sudaneseColors } from '../theme/colors';
import { storeApi, productApi } from '../services/api';

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  storeName: string;
}

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentStores, setRecentStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'مطاعم وكافيهات', icon: 'food', color: sudaneseColors.gold },
    { name: 'الملابس', icon: 'tshirt-crew', color: sudaneseColors.red },
    { name: 'الإلكترونيات', icon: 'cellphone', color: sudaneseColors.blue },
    { name: 'المنزل', icon: 'home', color: sudaneseColors.darkGreen },
  ];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [productsResponse, storesResponse] = await Promise.all([
        productApi.getAll(),
        storeApi.getAll(),
      ]);
      
      setFeaturedProducts(productsResponse.slice(0, 6));
      setRecentStores(storesResponse.slice(0, 4));
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <Card style={styles.productCardContent}>
        <Card.Cover 
          source={{ uri: 'https://via.placeholder.com/150x150' }} 
          style={styles.productImage}
        />
        <Card.Content style={styles.productInfo}>
          <Title style={styles.productTitle} numberOfLines={2}>
            {item.name}
          </Title>
          <Paragraph style={styles.productPrice}>
            {item.price} جنيه
          </Paragraph>
          <Chip 
            mode="outlined" 
            style={styles.categoryChip}
            textStyle={styles.categoryText}
          >
            {item.category}
          </Chip>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => navigation.navigate('StoreDetails', { storeId: item.id })}
    >
      <Card style={styles.storeCardContent}>
        <Card.Content>
          <View style={styles.storeHeader}>
            <Avatar.Icon 
              size={50} 
              icon="store" 
              style={{ backgroundColor: sudaneseColors.blue }}
            />
            <View style={styles.storeInfo}>
              <Title style={styles.storeTitle} numberOfLines={1}>
                {item.name}
              </Title>
              <Paragraph style={styles.storeCategory}>
                {item.category}
              </Paragraph>
              <Paragraph style={styles.storeAddress} numberOfLines={1}>
                {item.address}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={sudaneseColors.blue} />
        <Paragraph style={styles.loadingText}>جاري التحميل...</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>
              مرحباً، {user?.fullName || 'عزيزي المستخدم'}
            </Title>
            <Paragraph style={styles.welcomeText}>
              اكتشف أفضل المنتجات والخدمات في السوق السوداني
            </Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>الفئات</Title>
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryItem, { backgroundColor: category.color }]}
              onPress={() => navigation.navigate('Marketplace', { category: category.name })}
            >
              <Avatar.Icon
                size={40}
                icon={category.icon}
                style={styles.categoryIcon}
              />
              <Paragraph style={styles.categoryName}>{category.name}</Paragraph>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>المنتجات المميزة</Title>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Marketplace')}
            contentStyle={styles.seeAllButton}
          >
            عرض الكل
          </Button>
        </View>
        
        <FlatList
          data={featuredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </View>

      {/* Recent Stores */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>المتاجر الحديثة</Title>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Marketplace')}
            contentStyle={styles.seeAllButton}
          >
            عرض الكل
          </Button>
        </View>
        
        <FlatList
          data={recentStores}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>إجراءات سريعة</Title>
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            icon="store-plus"
            onPress={() => navigation.navigate('CreateStore')}
            style={[styles.quickActionButton, { backgroundColor: sudaneseColors.blue }]}
          >
            إنشاء متجر
          </Button>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('CreateProduct')}
            style={[styles.quickActionButton, { backgroundColor: sudaneseColors.red }]}
          >
            إضافة منتج
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  welcomeSection: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: sudaneseColors.blue,
    elevation: 4,
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 22,
    marginBottom: 8,
  },
  welcomeText: {
    color: 'white',
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAllButton: {
    paddingHorizontal: 0,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: (width - 64) / 4,
  },
  categoryIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  categoryName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  productsList: {
    paddingHorizontal: 16,
  },
  productCard: {
    marginRight: 16,
    width: 180,
  },
  productCardContent: {
    elevation: 4,
  },
  productImage: {
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: sudaneseColors.red,
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
  },
  storeCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  storeCardContent: {
    elevation: 2,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  storeTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: 14,
    color: sudaneseColors.blue,
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default HomeScreen;