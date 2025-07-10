import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  Avatar,
  ActivityIndicator,
  Menu,
  Divider,
} from 'react-native-paper';
import { theme, sudaneseColors } from '../theme/colors';
import { productApi, storeApi } from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  storeName: string;
  storeId: number;
}

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
}

const MarketplaceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'products' | 'stores'>('products');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const categories = [
    'الكل',
    'الأغذية',
    'الملابس',
    'الإلكترونيات',
    'المنزل والحديقة',
    'الجمال والعناية',
    'الرياضة',
    'الكتب',
    'أخرى',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, storesResponse] = await Promise.all([
        productApi.getAll(),
        storeApi.getAll(),
      ]);
      
      setProducts(productsResponse || []);
      setStores(storesResponse || []);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'الكل' || 
                           product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'الكل' || 
                           store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <Card style={styles.card}>
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
          <Paragraph style={styles.storeName}>
            متجر: {item.storeName}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => navigation.navigate('StoreDetails', { storeId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.storeHeader}>
            <Avatar.Icon 
              size={60} 
              icon="store" 
              style={{ backgroundColor: sudaneseColors.blue }}
            />
            <View style={styles.storeInfo}>
              <Title style={styles.storeTitle} numberOfLines={1}>
                {item.name}
              </Title>
              <Paragraph style={styles.storeDescription} numberOfLines={2}>
                {item.description}
              </Paragraph>
              <View style={styles.storeFooter}>
                <Chip 
                  mode="outlined" 
                  style={styles.categoryChip}
                  textStyle={styles.categoryText}
                >
                  {item.category}
                </Chip>
              </View>
              <Paragraph style={styles.storeAddress} numberOfLines={1}>
                📍 {item.address}
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
        <Paragraph style={styles.loadingText}>جاري تحميل السوق...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="البحث في السوق..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <View style={styles.viewModeButtons}>
          <Button
            mode={viewMode === 'products' ? 'contained' : 'outlined'}
            onPress={() => setViewMode('products')}
            style={[
              styles.viewModeButton,
              viewMode === 'products' && { backgroundColor: sudaneseColors.blue }
            ]}
          >
            المنتجات
          </Button>
          <Button
            mode={viewMode === 'stores' ? 'contained' : 'outlined'}
            onPress={() => setViewMode('stores')}
            style={[
              styles.viewModeButton,
              viewMode === 'stores' && { backgroundColor: sudaneseColors.blue }
            ]}
          >
            المتاجر
          </Button>
        </View>
        
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSortMenuVisible(true)}
              icon="sort"
              style={styles.sortButton}
            >
              ترتيب
            </Button>
          }
        >
          <Menu.Item onPress={() => {}} title="الأحدث" />
          <Menu.Item onPress={() => {}} title="الأقدم" />
          <Menu.Item onPress={() => {}} title="السعر: من الأقل للأعلى" />
          <Menu.Item onPress={() => {}} title="السعر: من الأعلى للأقل" />
          <Divider />
          <Menu.Item onPress={() => {}} title="الأكثر شعبية" />
        </Menu>
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <Chip
            mode={selectedCategory === item ? 'flat' : 'outlined'}
            onPress={() => setSelectedCategory(item === 'الكل' ? null : item)}
            style={[
              styles.categoryChip,
              selectedCategory === item && styles.selectedCategoryChip
            ]}
            textStyle={[
              styles.categoryText,
              selectedCategory === item && styles.selectedCategoryText
            ]}
          >
            {item}
          </Chip>
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {/* Products/Stores List */}
      <FlatList
        data={viewMode === 'products' ? filteredProducts : filteredStores}
        renderItem={viewMode === 'products' ? renderProductItem : renderStoreItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'products' ? 2 : 1}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[sudaneseColors.blue]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>
              {viewMode === 'products' ? 'لا توجد منتجات' : 'لا توجد متاجر'}
            </Paragraph>
          </View>
        }
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
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    elevation: 2,
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewModeButtons: {
    flexDirection: 'row',
  },
  viewModeButton: {
    marginRight: 8,
  },
  sortButton: {
    minWidth: 80,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: sudaneseColors.blue,
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    maxWidth: '48%',
  },
  storeCard: {
    marginBottom: 12,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  productImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: sudaneseColors.red,
  },
  storeName: {
    fontSize: 12,
    color: sudaneseColors.blue,
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
    marginBottom: 8,
  },
  storeDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  storeFooter: {
    marginBottom: 8,
  },
  storeAddress: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.placeholder,
  },
});

export default MarketplaceScreen;