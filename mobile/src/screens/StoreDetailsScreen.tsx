import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Chip,
  List,
  Divider,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import { theme, sudaneseColors } from '../theme/colors';
import { storeApi, productApi } from '../services/api';

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  ownerId: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  storeId: number;
}

const StoreDetailsScreen: React.FC<{ route: any, navigation: any }> = ({ 
  route, 
  navigation 
}) => {
  const { storeId } = route.params;
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStoreDetails();
  }, [storeId]);

  const loadStoreDetails = async () => {
    try {
      setLoading(true);
      const [storeResponse, productsResponse] = await Promise.all([
        storeApi.getById(storeId),
        productApi.getByStore(storeId),
      ]);
      
      setStore(storeResponse);
      setProducts(productsResponse || []);
    } catch (error) {
      console.error('Error loading store details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStoreDetails();
    setRefreshing(false);
  };

  const handleCallStore = () => {
    if (store?.phone) {
      Linking.openURL(`tel:${store.phone}`);
    }
  };

  const handleGetDirections = () => {
    if (store?.address) {
      const encodedAddress = encodeURIComponent(store.address);
      Linking.openURL(`https://maps.google.com/maps?q=${encodedAddress}`);
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
        <Card.Content>
          <Title style={styles.productTitle} numberOfLines={2}>
            {item.name}
          </Title>
          <Paragraph style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Paragraph>
          <View style={styles.productFooter}>
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
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={sudaneseColors.blue} />
        <Paragraph style={styles.loadingText}>جاري تحميل تفاصيل المتجر...</Paragraph>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.errorContainer}>
        <Paragraph style={styles.errorText}>لم يتم العثور على المتجر</Paragraph>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={[styles.button, { backgroundColor: sudaneseColors.blue }]}
        >
          العودة
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[sudaneseColors.blue]}
          />
        }
      >
        {/* Store Header */}
        <Card style={styles.storeHeader}>
          <Card.Content>
            <View style={styles.storeHeaderContent}>
              <Avatar.Icon 
                size={80} 
                icon="store" 
                style={{ backgroundColor: sudaneseColors.blue }}
              />
              <View style={styles.storeInfo}>
                <Title style={styles.storeName}>{store.name}</Title>
                <Chip 
                  mode="flat" 
                  style={[styles.categoryChip, { backgroundColor: sudaneseColors.gold }]}
                  textStyle={[styles.categoryText, { color: 'white' }]}
                >
                  {store.category}
                </Chip>
                <Paragraph style={styles.storeAddress}>
                  📍 {store.address}
                </Paragraph>
              </View>
            </View>
            
            <Paragraph style={styles.storeDescription}>
              {store.description}
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Store Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.actionsTitle}>تواصل مع المتجر</Title>
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleCallStore}
                style={[styles.actionButton, { backgroundColor: sudaneseColors.blue }]}
                icon="phone"
                disabled={!store.phone}
              >
                اتصل
              </Button>
              <Button
                mode="contained"
                onPress={handleGetDirections}
                style={[styles.actionButton, { backgroundColor: sudaneseColors.red }]}
                icon="map-marker"
              >
                الموقع
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Store Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>إحصائيات المتجر</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Title style={styles.statValue}>{products.length}</Title>
                <Paragraph style={styles.statLabel}>منتج</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statValue}>4.5</Title>
                <Paragraph style={styles.statLabel}>تقييم</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statValue}>128</Title>
                <Paragraph style={styles.statLabel}>عميل</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statValue}>2</Title>
                <Paragraph style={styles.statLabel}>سنة</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Store Products */}
        <Card style={styles.productsCard}>
          <Card.Content>
            <View style={styles.productsHeader}>
              <Title style={styles.productsTitle}>منتجات المتجر</Title>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Marketplace', { storeId })}
                contentStyle={styles.seeAllButton}
              >
                عرض الكل
              </Button>
            </View>
            
            {products.length > 0 ? (
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Paragraph style={styles.emptyText}>
                  لا توجد منتجات في هذا المتجر حالياً
                </Paragraph>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Store Contact Info */}
        <Card style={styles.contactCard}>
          <Card.Content>
            <Title style={styles.contactTitle}>معلومات التواصل</Title>
            
            <List.Item
              title="العنوان"
              description={store.address}
              left={props => <List.Icon {...props} icon="map-marker" />}
            />
            
            <Divider />
            
            {store.phone && (
              <>
                <List.Item
                  title="الهاتف"
                  description={store.phone}
                  left={props => <List.Icon {...props} icon="phone" />}
                  onPress={handleCallStore}
                />
                <Divider />
              </>
            )}
            
            <List.Item
              title="الفئة"
              description={store.category}
              left={props => <List.Icon {...props} icon="tag" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={[styles.fab, { backgroundColor: sudaneseColors.blue }]}
        icon="plus"
        onPress={() => navigation.navigate('CreateProduct')}
        label="إضافة منتج"
      />
    </View>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
  },
  storeHeader: {
    margin: 16,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  storeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: sudaneseColors.blue,
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
  },
  storeAddress: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  storeDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: sudaneseColors.blue,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  productsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 18,
    color: theme.colors.text,
  },
  seeAllButton: {
    paddingHorizontal: 0,
  },
  productsList: {
    paddingLeft: 0,
  },
  productCard: {
    marginRight: 16,
    width: 180,
  },
  productCardContent: {
    elevation: 2,
  },
  productImage: {
    height: 120,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: sudaneseColors.red,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
  contactCard: {
    marginHorizontal: 16,
    marginBottom: 100,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: theme.colors.text,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default StoreDetailsScreen;