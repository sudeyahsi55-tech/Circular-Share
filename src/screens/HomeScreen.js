import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, TextInput, StatusBar, Dimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';
import { getGreeting } from '../utils/helpers';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ shared: 0, borrowed: 0, returned: 0, points: 0 });

  const loadData = useCallback(async () => {
    try {
      await LocalDB.loadDemoData(user?.id);
      const allItems = await LocalDB.getItems();
      setItems(allItems);
      filterItems(allItems, selectedCategory, searchText);

      if (user) {
        const userStats = await LocalDB.getStats(user.id);
        setStats(userStats);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user, selectedCategory, searchText]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation, loadData]);

  const filterItems = (allItems, category, search) => {
    let filtered = allItems;
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s)
      );
    }
    setFilteredItems(filtered);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    filterItems(items, cat, searchText);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterItems(items, selectedCategory, text);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('ChatList')}
          >
            <Text style={styles.notifIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileEmoji}>{user?.avatar || '😊'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Text style={styles.statNumber}>{stats.shared}</Text>
          <Text style={styles.statLabel}>Paylaşım</Text>
          <Text style={styles.statIcon}>📤</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Text style={styles.statNumber}>{stats.borrowed}</Text>
          <Text style={styles.statLabel}>Ödünç</Text>
          <Text style={styles.statIcon}>📥</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Text style={styles.statNumber}>{stats.points}</Text>
          <Text style={styles.statLabel}>Puan</Text>
          <Text style={styles.statIcon}>⭐</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Matkap, çadır, merdiven..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.mapBtn}
        onPress={() => navigation.navigate('Map', { items: filteredItems })}
      >
        <Text style={styles.mapBtnIcon}>🗺️</Text>
        <Text style={styles.mapBtnText}>Haritada Gör</Text>
        <Text style={styles.mapBtnArrow}>→</Text>
      </TouchableOpacity>

      <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />

      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Yakındaki Eşyalar</Text>
        <Text style={styles.resultCount}>{filteredItems.length} eşya</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyTitle}>Eşya bulunamadı</Text>
      <Text style={styles.emptySubtitle}>
        Farklı bir kategori veya arama terimi dene
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetail', { item })}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddItem')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Text style={styles.tabIconActive}>🏠</Text>
          <Text style={styles.tabLabelActive}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Map', { items })}>
          <Text style={styles.tabIcon}>🗺️</Text>
          <Text style={styles.tabLabel}>Harita</Text>
        </TouchableOpacity>
        <View style={styles.tabItemCenter} />
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MyItems')}>
          <Text style={styles.tabIcon}>📦</Text>
          <Text style={styles.tabLabel}>Eşyalarım</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  list: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  notifIcon: {
    fontSize: 22,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 24,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
    marginTop: 2,
  },
  statIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    fontSize: 20,
    opacity: 0.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  clearIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    padding: 4,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  mapBtnIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  mapBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E40AF',
  },
  mapBtnArrow: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: '700',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  resultCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  fabText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '300',
    marginTop: -2,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingBottom: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabItemCenter: {
    width: 60,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 3,
    fontWeight: '700',
  },
});

export default HomeScreen;