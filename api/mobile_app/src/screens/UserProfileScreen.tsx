import React, { useState, useEffect } from 'react';
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
  Paragraph,
  Button,
  Avatar,
  List,
  Divider,
  TextInput,
  Dialog,
  Portal,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme, sudaneseColors } from '../theme/colors';
import { userApi } from '../services/api';

const UserProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Profile form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSaveProfile = async () => {
    if (!formData.fullName || !formData.email) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      await userApi.updateProfile(formData);
      Alert.alert('نجح', 'تم تحديث الملف الشخصي بنجاح');
      setEditMode(false);
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
  };

  const profileStats = [
    { title: 'المتاجر', value: '2', icon: 'store' },
    { title: 'المنتجات', value: '15', icon: 'package-variant' },
    { title: 'الطلبات', value: '8', icon: 'cart' },
    { title: 'التقييمات', value: '4.5', icon: 'star' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerSection}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text 
                size={80} 
                label={user?.fullName?.charAt(0) || 'U'}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Title style={styles.userName}>{user?.fullName}</Title>
                <Paragraph style={styles.userRole}>
                  {user?.role === 'admin' ? 'مدير' : 
                   user?.role === 'merchant' ? 'تاجر' : 'عميل'}
                </Paragraph>
                <Paragraph style={styles.userEmail}>{user?.email}</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Profile Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <List.Icon icon={stat.icon} color={sudaneseColors.blue} />
              <Title style={styles.statValue}>{stat.value}</Title>
              <Paragraph style={styles.statTitle}>{stat.title}</Paragraph>
            </View>
          ))}
        </View>
      </View>

      {/* Edit Profile Section */}
      {editMode ? (
        <View style={styles.section}>
          <Card>
            <Card.Content>
              <Title style={styles.sectionTitle}>تعديل الملف الشخصي</Title>
              
              <TextInput
                label="الاسم الكامل"
                value={formData.fullName}
                onChangeText={(text) => setFormData({...formData, fullName: text})}
                style={styles.input}
              />
              
              <TextInput
                label="البريد الإلكتروني"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                style={styles.input}
                keyboardType="email-address"
              />
              
              <TextInput
                label="رقم الهاتف"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                style={styles.input}
                keyboardType="phone-pad"
              />
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleSaveProfile}
                  loading={loading}
                  style={[styles.button, { backgroundColor: sudaneseColors.blue }]}
                >
                  حفظ التغييرات
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setEditMode(false)}
                  style={styles.button}
                >
                  إلغاء
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      ) : (
        <View style={styles.section}>
          <Card>
            <Card.Content>
              <Title style={styles.sectionTitle}>معلومات الحساب</Title>
              
              <List.Item
                title="الاسم الكامل"
                description={user?.fullName}
                left={props => <List.Icon {...props} icon="account" />}
              />
              
              <List.Item
                title="البريد الإلكتروني"
                description={user?.email}
                left={props => <List.Icon {...props} icon="email" />}
              />
              
              <List.Item
                title="رقم الهاتف"
                description={user?.phone || 'غير محدد'}
                left={props => <List.Icon {...props} icon="phone" />}
              />
              
              <List.Item
                title="اسم المستخدم"
                description={user?.username}
                left={props => <List.Icon {...props} icon="at" />}
              />
              
              <Button
                mode="contained"
                onPress={() => setEditMode(true)}
                style={[styles.button, { backgroundColor: sudaneseColors.blue }]}
                icon="pencil"
              >
                تعديل المعلومات
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Settings Section */}
      <View style={styles.section}>
        <Card>
          <Card.Content>
            <Title style={styles.sectionTitle}>الإعدادات</Title>
            
            <List.Item
              title="إعدادات الإشعارات"
              left={props => <List.Icon {...props} icon="bell" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            
            <Divider />
            
            <List.Item
              title="الخصوصية والأمان"
              left={props => <List.Icon {...props} icon="shield" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            
            <Divider />
            
            <List.Item
              title="المساعدة والدعم"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            
            <Divider />
            
            <List.Item
              title="حول التطبيق"
              left={props => <List.Icon {...props} icon="information" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <Button
          mode="contained"
          onPress={() => setShowLogoutDialog(true)}
          style={[styles.button, { backgroundColor: sudaneseColors.red }]}
          icon="logout"
        >
          تسجيل الخروج
        </Button>
      </View>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Title>تسجيل الخروج</Dialog.Title>
          <Dialog.Content>
            <Paragraph>هل أنت متأكد من رغبتك في تسجيل الخروج؟</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>إلغاء</Button>
            <Button 
              onPress={handleLogout}
              textColor={sudaneseColors.red}
            >
              تسجيل الخروج
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    padding: 16,
  },
  profileCard: {
    elevation: 4,
    borderRadius: 16,
    backgroundColor: sudaneseColors.blue,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: sudaneseColors.gold,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 22,
    marginBottom: 4,
  },
  userRole: {
    color: 'white',
    opacity: 0.8,
    fontSize: 14,
  },
  userEmail: {
    color: 'white',
    opacity: 0.7,
    fontSize: 12,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: sudaneseColors.blue,
    marginVertical: 4,
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default UserProfileScreen;