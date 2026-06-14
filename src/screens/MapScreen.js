import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { getCategoryById } from '../utils/categories';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }) => {
  const { items = [] } = route.params || {};
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (e) {
      console.log('Konum alınamadı:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Yakındaki Eşyalar</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {items.map((item) => {
          const cat = getCategoryById(item.category);
          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
              description={`${item.ownerName} • ${item.distance}`}
            >
              <View style={[styles.markerContainer, { backgroundColor: cat.color }]}>
                <Text style={styles.markerEmoji}>{cat.icon}</Text>
              </View>
              <Callout
                tooltip
                onPress={() => navigation.navigate('ItemDetail', { item })}
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{item.name}</Text>
                  <Text style={styles.calloutOwner}>{item.ownerName}</Text>
                  <Text style={styles.calloutDistance}>📍 {item.distance}</Text>
                  {item.priceType === 'free' ? (
                    <Text style={styles.calloutFree}>Ücretsiz</Text>
                  ) : (
                    <Text style={styles.calloutPrice}>₺{item.priceAmount}/gün</Text>
                  )}
                  <Text style={styles.calloutAction}>Detay için dokun →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.bottomInfo}>
        <Text style={styles.bottomText}>
          📍 Haritada {items.length} eşya gösteriliyor
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  backBtn: {
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  countBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 20,
  },
  callout: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  calloutOwner: {
    fontSize: 13,
    color: '#6B7280',
  },
  calloutDistance: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  calloutFree: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 4,
  },
  calloutPrice: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '700',
    marginTop: 4,
  },
  calloutAction: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'right',
  },
  bottomInfo: {
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: 34,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bottomText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default MapScreen;