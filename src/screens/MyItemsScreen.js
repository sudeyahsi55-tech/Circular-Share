import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import ItemCard from '../components/ItemCard';

const MyItemsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    loadMyItems();
    const unsub = navigation.addListener('focus', loadMyItems);
    return unsub;
  }, []);

  const loadMyItems = async () => {
    const allItems = await LocalDB.getItems();
    setMyItems(allItems.filter(item => item.ownerId === user?.id));
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      'Eşyayı Sil',
      'Bu eşyayı silmek istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await LocalDB.deleteItem(itemId);
            loadMyItems();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eşyalarım</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.addText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={myItems}
        renderItem={({ item }) => (
          <View>
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetail', { item })}
            />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteBtnText}>🗑️ Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>Henüz eşya eklemedin</Text>
            <Text style={styles.emptySubtext}>
              Kullanmadığın eşyaları paylaşmaya başla!
            </Text>
            <TouchableOpacity
              style={styles.addFirstBtn}
              onPress={() => navigation.navigate('AddItem')}
            >
              <Text style={styles.addFirstBtnText}>İlk Eşyanı Ekle 🎉</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  addText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
  },
  list: {
    paddingTop: 16,
    paddingBottom: 30,
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: -4,
    marginBottom: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 80,
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
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addFirstBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MyItemsScreen;