import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, StatusBar, Dimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import { getCategoryById } from '../utils/categories';
import { generateId } from '../utils/helpers';

const { width } = Dimensions.get('window');

const ItemDetailScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useAuth();
  const category = getCategoryById(item.category);
  const isOwner = item.ownerId === user?.id;
  const [requesting, setRequesting] = useState(false);

  const handleRequest = async () => {
    if (!item.available) {
      Alert.alert('Bilgi', 'Bu eşya şu anda kullanımda');
      return;
    }

    setRequesting(true);
    try {
      const request = {
        id: generateId(),
        itemId: item.id,
        itemName: item.name,
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        requesterId: user.id,
        requesterName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
        qrCode: generateId(),
      };

      await LocalDB.createRequest(request);
      await LocalDB.updateStats(user.id, 'borrowed');

      Alert.alert(
        '✅ Talep Gönderildi!',
        `${item.ownerName} talebini onayladığında QR kod ile teslim alabilirsin.`,
        [
          {
            text: 'QR Kodumu Gör',
            onPress: () => navigation.navigate('QRCode', { request, item })
          },
          { text: 'Tamam', style: 'cancel' }
        ]
      );
    } catch (e) {
      Alert.alert('Hata', 'Talep gönderilemedi');
    } finally {
      setRequesting(false);
    }
  };

  const handleChat = () => {
    const chatId = [user.id, item.ownerId].sort().join('_');
    navigation.navigate('Chat', {
      chatId,
      otherUser: { id: item.ownerId, name: item.ownerName, avatar: item.ownerAvatar },
      itemName: item.name,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.heroBox, { backgroundColor: category.color + '15' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{category.icon}</Text>
          {item.priceType === 'free' && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>🎁 Ücretsiz</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: category.color + '20' }]}>
              <Text style={styles.badgeText}>{category.name}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.condition}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>📍 {item.distance}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.sectionTitle}>Detaylar</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailLabel}>Süre</Text>
              <Text style={styles.detailValue}>{item.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📊</Text>
              <Text style={styles.detailLabel}>Kiralanma</Text>
              <Text style={styles.detailValue}>{item.totalRentals} kez</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={styles.detailLabel}>Ücret</Text>
              <Text style={styles.detailValue}>
                {item.priceType === 'free' ? 'Ücretsiz' : `₺${item.priceAmount}/gün`}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailLabel}>Mahalle</Text>
              <Text style={styles.detailValue}>{item.neighborhood}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Eşya Sahibi</Text>
          <View style={styles.ownerCard}>
            <Text style={styles.ownerAvatar}>{item.ownerAvatar || '😊'}</Text>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{item.ownerName}</Text>
              <Text style={styles.ownerMeta}>⭐ {item.rating} • {item.totalRentals} paylaşım</Text>
            </View>
            {!isOwner && (
              <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
                <Text style={styles.chatBtnText}>💬</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {!isOwner && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.messageBtn} onPress={handleChat}>
            <Text style={styles.messageBtnText}>💬 Mesaj</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.requestBtn, !item.available && styles.disabledBtn]}
            onPress={handleRequest}
            disabled={requesting || !item.available}
          >
            <Text style={styles.requestBtnText}>
              {!item.available ? 'Kullanımda' : requesting ? 'Gönderiliyor...' : 'Talep Gönder 🤝'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isOwner && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.requestBtn, { backgroundColor: '#3B82F6' }]}
            onPress={() => navigation.navigate('QRScan', { item })}
          >
            <Text style={styles.requestBtnText}>📱 QR Kod Tara (Teslim)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  heroBox: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#1F2937',
    fontWeight: '700',
  },
  heroEmoji: {
    fontSize: 80,
  },
  freeBadge: {
    position: 'absolute',
    top: 56,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  freeBadgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  detailItem: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  ownerAvatar: {
    fontSize: 40,
    marginRight: 14,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  ownerMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },
  chatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtnText: {
    fontSize: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  messageBtn: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#10B981',
    justifyContent: 'center',
  },
  messageBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  requestBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
});

export default ItemDetailScreen;