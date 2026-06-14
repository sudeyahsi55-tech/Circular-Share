import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCategoryById } from '../utils/categories';

const ItemCard = ({ item, onPress, compact = false }) => {
  const category = getCategoryById(item.category);

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={[styles.compactIconBox, { backgroundColor: category.color + '20' }]}>
          <Text style={styles.compactIcon}>{category.icon}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.compactOwner}>{item.ownerName}</Text>
        </View>
        <Text style={styles.compactDistance}>{item.distance}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.imageBox, { backgroundColor: category.color + '15' }]}>
        <Text style={styles.bigIcon}>{category.icon}</Text>
        {item.priceType === 'free' && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Ücretsiz</Text>
          </View>
        )}
        {item.available ? (
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Müsait</Text>
          </View>
        ) : (
          <View style={[styles.availableBadge, { backgroundColor: '#FEE2E2' }]}>
            <View style={[styles.availableDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.availableText, { color: '#EF4444' }]}>Kullanımda</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.ownerRow}>
            <Text style={styles.ownerAvatar}>{item.ownerAvatar || '😊'}</Text>
            <Text style={styles.ownerName}>{item.ownerName}</Text>
          </View>
          <View style={styles.distanceBox}>
            <Text style={styles.distanceIcon}>📍</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.ratingBox}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.rentalCount}>({item.totalRentals})</Text>
          </View>
          {item.priceType === 'daily' && (
            <Text style={styles.price}>₺{item.priceAmount}/gün</Text>
          )}
          {item.priceType === 'hourly' && (
            <Text style={styles.price}>₺{item.priceAmount}/saat</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  imageBox: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bigIcon: {
    fontSize: 56,
  },
  freeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  availableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  availableText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    fontSize: 20,
    marginRight: 6,
  },
  ownerName: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  distanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  distance: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 14,
    marginRight: 3,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  rentalCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 3,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B82F6',
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactIcon: {
    fontSize: 22,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  compactOwner: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  compactDistance: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});

export default ItemCard;