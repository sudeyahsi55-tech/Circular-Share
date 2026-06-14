import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import { categories } from '../utils/categories';
import { generateId } from '../utils/helpers';

const conditions = ['Yeni Gibi', 'Çok İyi', 'İyi', 'Orta', 'Kullanılmış'];
const priceTypes = [
  { id: 'free', label: 'Ücretsiz', icon: '🎁' },
  { id: 'daily', label: 'Günlük Ücret', icon: '📅' },
  { id: 'hourly', label: 'Saatlik Ücret', icon: '⏰' },
];

const AddItemScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceType, setPriceType] = useState('free');
  const [priceAmount, setPriceAmount] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async () => {
    if (!name || !description || !selectedCategory || !selectedCondition) {
      Alert.alert('Uyarı', 'Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (priceType !== 'free' && !priceAmount) {
      Alert.alert('Uyarı', 'Lütfen ücret belirleyin');
      return;
    }

    try {
      const newItem = {
        id: generateId(),
        name,
        description,
        category: selectedCategory,
        condition: selectedCondition,
        priceType,
        priceAmount: priceType === 'free' ? 0 : parseFloat(priceAmount),
        duration: duration || 'Belirtilmemiş',
        images: [],
        ownerId: user.id,
        ownerName: user.name,
        ownerAvatar: user.avatar || '😊',
        latitude: 41.0082 + (Math.random() - 0.5) * 0.01,
        longitude: 28.9784 + (Math.random() - 0.5) * 0.01,
        neighborhood: user.neighborhood || 'Beşiktaş',
        available: true,
        rating: 5.0,
        totalRentals: 0,
        createdAt: new Date().toISOString(),
        distance: `${Math.floor(Math.random() * 800 + 100)}m`,
      };

      await LocalDB.addItem(newItem);
      await LocalDB.updateStats(user.id, 'shared');

      Alert.alert(
        '🎉 Harika!',
        'Eşyan başarıyla eklendi! Komşuların artık bu eşyayı görebilir.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert('Hata', 'Eşya eklenemedi');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eşya Paylaş</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Eşya Adı *</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Örn: Bosch Matkap"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={styles.label}>Açıklama *</Text>
        <View style={[styles.inputBox, { height: 100 }]}>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Eşya hakkında detay yazın..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <Text style={styles.label}>Kategori *</Text>
        <View style={styles.chipGroup}>
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                selectedCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.chipEmoji}>{cat.icon}</Text>
              <Text style={[
                styles.chipText,
                selectedCategory === cat.id && { color: '#FFF' }
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Durum *</Text>
        <View style={styles.chipGroup}>
          {conditions.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[
                styles.chip,
                selectedCondition === cond && { backgroundColor: '#10B981', borderColor: '#10B981' }
              ]}
              onPress={() => setSelectedCondition(cond)}
            >
              <Text style={[
                styles.chipText,
                selectedCondition === cond && { color: '#FFF' }
              ]}>{cond}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Fiyatlandırma</Text>
        <View style={styles.priceTypeRow}>
          {priceTypes.map((pt) => (
            <TouchableOpacity
              key={pt.id}
              style={[
                styles.priceTypeBtn,
                priceType === pt.id && styles.priceTypeBtnActive
              ]}
              onPress={() => setPriceType(pt.id)}
            >
              <Text style={styles.priceTypeIcon}>{pt.icon}</Text>
              <Text style={[
                styles.priceTypeLabel,
                priceType === pt.id && { color: '#FFF' }
              ]}>{pt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {priceType !== 'free' && (
          <View style={styles.inputBox}>
            <Text style={styles.inputPrefix}>₺</Text>
            <TextInput
              style={styles.input}
              placeholder="Ücret"
              placeholderTextColor="#9CA3AF"
              value={priceAmount}
              onChangeText={setPriceAmount}
              keyboardType="numeric"
            />
          </View>
        )}

        <Text style={styles.label}>Maksimum Ödünç Süresi</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Örn: 2 saat, 1 gün, 1 hafta"
            placeholderTextColor="#9CA3AF"
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Eşyayı Paylaş 🎉</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  inputPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  chipEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  priceTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceTypeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  priceTypeBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  priceTypeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  priceTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default AddItemScreen;