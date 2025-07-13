import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/api';
import { theme } from '../theme/colors';

const AnnouncementsScreen = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAnnouncements();
      setAnnouncements(response.data || []);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحميل الإعلانات');
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  const getAnnouncementIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'عروض':
        return 'local-offer';
      case 'جديد':
        return 'new-releases';
      case 'مهم':
        return 'priority-high';
      default:
        return 'announcement';
    }
  };

  const renderAnnouncementItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.title}>{item.title}</Title>
          <View style={styles.iconContainer}>
            <Icon 
              name={getAnnouncementIcon(item.type)} 
              size={24} 
              color={theme.colors.primary} 
            />
          </View>
        </View>
        <Paragraph style={styles.content}>{item.content}</Paragraph>
        <View style={styles.footer}>
          <Text style={styles.date}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : 'تاريخ غير محدد'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإعلانات</Text>
        <Text style={styles.headerSubtitle}>
          تابع آخر الأخبار والعروض
        </Text>
      </View>

      <FlatList
        data={announcements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="announcement" size={80} color="#ddd" />
            <Text style={styles.emptyText}>لا توجد إعلانات متاحة حالياً</Text>
          </View>
        }
      />
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'right',
  },
  iconContainer: {
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AnnouncementsScreen;