import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  TextInput,
  HelperText,
  Menu,
  Divider,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { theme, sudaneseColors } from '../theme/colors';
import { productApi, storeApi } from '../services/api';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  storeId: number | null;
}

interface Store {
  id: number;
  name: string;
  category: string;
}

const CreateProductScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    storeId: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [storeMenuVisible, setStoreMenuVisible] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  const categories = [
    'مطاعم وكافيهات',
    'الملابس والأزياء',
    'الإلكترونيات',
    'المنزل والحديقة',
    'الجمال والعناية',
    'الرياضة واللياقة',
    'الكتب والمكتبات',
    'السيارات ومستلزماتها',
    'الصحة والطب',
    'الهدايا والتذكارات',
    'أخرى',
  ];

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await storeApi.getAll();
      setStores(response || []);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المنتج مطلوب';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المنتج مطلوب';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'سعر المنتج مطلوب';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      newErrors.price = 'سعر المنتج يجب أن يكون رقماً صالحاً';
    }
    
    if (!formData.category) {
      newErrors.category = 'فئة المنتج مطلوبة';
    }
    
    if (!formData.storeId) {
      newErrors.storeId = 'المتجر مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await productApi.create({
        ...formData,
        price: parseFloat(formData.price),
      });
      
      Alert.alert(
        'نجح إضافة المنتج',
        'تم إضافة المنتج بنجاح إلى متجرك!',
        [
          {
            text: 'موافق',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'خطأ في إضافة المنتج',
        error.message || 'حدث خطأ غير متوقع'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedStore = stores.find(store => store.id === formData.storeId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>إضافة منتج جديد</Title>
            
            {/* Product Name */}
            <TextInput
              label="اسم المنتج *"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              style={styles.input}
              error={!!errors.name}
              right={<TextInput.Icon icon="package-variant" />}
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}

            {/* Product Description */}
            <TextInput
              label="وصف المنتج *"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              style={styles.input}
              multiline
              numberOfLines={4}
              error={!!errors.description}
              right={<TextInput.Icon icon="text" />}
            />
            {errors.description && (
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            )}

            {/* Price */}
            <TextInput
              label="السعر (بالجنيه السوداني) *"
              value={formData.price}
              onChangeText={(text) => updateFormData('price', text)}
              style={styles.input}
              keyboardType="numeric"
              error={!!errors.price}
              right={<TextInput.Icon icon="currency-usd" />}
            />
            {errors.price && (
              <HelperText type="error" visible={!!errors.price}>
                {errors.price}
              </HelperText>
            )}

            {/* Category Selector */}
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                  <TextInput
                    label="فئة المنتج *"
                    value={formData.category}
                    style={styles.input}
                    error={!!errors.category}
                    editable={false}
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                </TouchableOpacity>
              }
            >
              {categories.map((category, index) => (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    updateFormData('category', category);
                    setCategoryMenuVisible(false);
                  }}
                  title={category}
                />
              ))}
            </Menu>
            {errors.category && (
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            )}

            {/* Store Selector */}
            <Menu
              visible={storeMenuVisible}
              onDismiss={() => setStoreMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setStoreMenuVisible(true)}>
                  <TextInput
                    label="المتجر *"
                    value={selectedStore?.name || ''}
                    style={styles.input}
                    error={!!errors.storeId}
                    editable={false}
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                </TouchableOpacity>
              }
            >
              {stores.map((store) => (
                <Menu.Item
                  key={store.id}
                  onPress={() => {
                    updateFormData('storeId', store.id);
                    setStoreMenuVisible(false);
                  }}
                  title={`${store.name} - ${store.category}`}
                />
              ))}
            </Menu>
            {errors.storeId && (
              <HelperText type="error" visible={!!errors.storeId}>
                {errors.storeId}
              </HelperText>
            )}

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleCreateProduct}
              style={[styles.button, { backgroundColor: sudaneseColors.blue }]}
              loading={loading}
              disabled={loading}
              icon="plus"
            >
              {loading ? 'جاري إضافة المنتج...' : 'إضافة المنتج'}
            </Button>
          </Card.Content>
        </Card>

        {/* Product Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title style={styles.tipsTitle}>نصائح لإضافة منتج ناجح</Title>
            
            <View style={styles.tip}>
              <Title style={styles.tipTitle}>📸 أضف صوراً واضحة</Title>
              <TextInput
                multiline
                numberOfLines={2}
                value="تأكد من وضوح الصور وأنها تعرض المنتج من زوايا مختلفة"
                style={styles.tipText}
                editable={false}
              />
            </View>

            <View style={styles.tip}>
              <Title style={styles.tipTitle}>📝 اكتب وصفاً تفصيلياً</Title>
              <TextInput
                multiline
                numberOfLines={2}
                value="اذكر المواصفات والميزات والاستخدامات المختلفة للمنتج"
                style={styles.tipText}
                editable={false}
              />
            </View>

            <View style={styles.tip}>
              <Title style={styles.tipTitle}>💰 حدد سعراً تنافسياً</Title>
              <TextInput
                multiline
                numberOfLines={2}
                value="ابحث عن أسعار منتجات مماثلة في السوق لتحديد سعر مناسب"
                style={styles.tipText}
                editable={false}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.quickActionsTitle}>إجراءات سريعة</Title>
            <View style={styles.quickActions}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('CreateStore')}
                style={styles.quickActionButton}
                icon="store-plus"
              >
                إنشاء متجر جديد
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Marketplace')}
                style={styles.quickActionButton}
                icon="store"
              >
                تصفح السوق
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: sudaneseColors.blue,
  },
  input: {
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  tipsCard: {
    elevation: 2,
    borderRadius: 16,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: sudaneseColors.gold,
  },
  tip: {
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.text,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  quickActionsCard: {
    elevation: 2,
    borderRadius: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: sudaneseColors.red,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default CreateProductScreen;