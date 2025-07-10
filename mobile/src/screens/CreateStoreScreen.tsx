import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
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
} from 'react-native-paper';
import { theme, sudaneseColors } from '../theme/colors';
import { storeApi } from '../services/api';

interface StoreFormData {
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
}

const CreateStoreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    description: '',
    category: '',
    address: '',
    phone: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<StoreFormData>>({});
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const categories = [
    'الأغذية والمشروبات',
    'الملابس والأزياء',
    'الإلكترونيات',
    'المنزل والحديقة',
    'الجمال والعناية',
    'الرياضة واللياقة',
    'الكتب والمكتبات',
    'السيارات ومستلزماتها',
    'الصحة والطب',
    'الخدمات المهنية',
    'أخرى',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<StoreFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المتجر مطلوب';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المتجر مطلوب';
    }
    
    if (!formData.category) {
      newErrors.category = 'فئة المتجر مطلوبة';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'عنوان المتجر مطلوب';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateStore = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await storeApi.create(formData);
      
      Alert.alert(
        'نجح إنشاء المتجر',
        'تم إنشاء متجرك بنجاح! يمكنك الآن إضافة المنتجات إليه.',
        [
          {
            text: 'موافق',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'خطأ في إنشاء المتجر',
        error.message || 'حدث خطأ غير متوقع'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof StoreFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>إنشاء متجر جديد</Title>
            
            {/* Store Name */}
            <TextInput
              label="اسم المتجر *"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              style={styles.input}
              error={!!errors.name}
              right={<TextInput.Icon icon="store" />}
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}

            {/* Store Description */}
            <TextInput
              label="وصف المتجر *"
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

            {/* Category Selector */}
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                  <TextInput
                    label="فئة المتجر *"
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

            {/* Store Address */}
            <TextInput
              label="عنوان المتجر *"
              value={formData.address}
              onChangeText={(text) => updateFormData('address', text)}
              style={styles.input}
              multiline
              numberOfLines={2}
              error={!!errors.address}
              right={<TextInput.Icon icon="map-marker" />}
            />
            {errors.address && (
              <HelperText type="error" visible={!!errors.address}>
                {errors.address}
              </HelperText>
            )}

            {/* Phone Number */}
            <TextInput
              label="رقم الهاتف *"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              style={styles.input}
              keyboardType="phone-pad"
              error={!!errors.phone}
              right={<TextInput.Icon icon="phone" />}
            />
            {errors.phone && (
              <HelperText type="error" visible={!!errors.phone}>
                {errors.phone}
              </HelperText>
            )}

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleCreateStore}
              style={[styles.button, { backgroundColor: sudaneseColors.blue }]}
              loading={loading}
              disabled={loading}
              icon="store-plus"
            >
              {loading ? 'جاري إنشاء المتجر...' : 'إنشاء المتجر'}
            </Button>
          </Card.Content>
        </Card>

        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title style={styles.tipsTitle}>نصائح لإنشاء متجر ناجح</Title>
            
            <View style={styles.tip}>
              <Title style={styles.tipTitle}>💡 اختر اسماً جذاباً</Title>
              <TextInput
                multiline
                numberOfLines={2}
                value="اختر اسماً سهل التذكر ويعكس طبيعة منتجاتك"
                style={styles.tipText}
                editable={false}
              />
            </View>

            <View style={styles.tip}>
              <Title style={styles.tipTitle}>📝 اكتب وصفاً شاملاً</Title>
              <TextInput
                multiline
                numberOfLines={2}
                value="اشرح ما يميز متجرك وما يمكن للعملاء توقعه"
                style={styles.tipText}
                editable={false}
              />
            </View>

            <View style={styles.tip}>
              <Title style={styles.tipTitle}>🏪 حدد الفئة بدقة</Title>
              <TextInput
                multiline
                numberOfLines={2}
                value="اختر الفئة التي تناسب منتجاتك لتسهيل وصول العملاء إليك"
                style={styles.tipText}
                editable={false}
              />
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
});

export default CreateStoreScreen;