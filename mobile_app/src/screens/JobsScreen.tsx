import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/api';
import { theme } from '../theme/colors';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getJobs();
      setJobs(response.data || []);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحميل الوظائف');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const renderJobItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.title}>{item.title}</Title>
          <Chip style={styles.salaryChip} textStyle={styles.salaryText}>
            {item.salary} ج.س
          </Chip>
        </View>
        <Paragraph style={styles.description}>{item.description}</Paragraph>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={16} color={theme.colors.secondary} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.footer}>
          <Button
            mode="contained"
            style={styles.applyButton}
            onPress={() => Alert.alert('تطبيق', 'سيتم إضافة هذه الميزة قريباً')}
          >
            تقديم طلب
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الوظائف</Text>
        <Text style={styles.headerSubtitle}>
          ابحث عن فرص العمل المناسبة لك
        </Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
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
            <Icon name="work" size={80} color="#ddd" />
            <Text style={styles.emptyText}>لا توجد وظائف متاحة حالياً</Text>
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
  salaryChip: {
    backgroundColor: theme.colors.gold,
    marginLeft: 8,
  },
  salaryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  location: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginLeft: 4,
  },
  footer: {
    alignItems: 'flex-end',
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
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

export default JobsScreen;