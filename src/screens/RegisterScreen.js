import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  ScrollView, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const neighborhoods = [
  'Beşiktaş', 'Kadıköy', 'Üsküdar', 'Şişli', 'Bakırköy',
  'Ataşehir', 'Maltepe', 'Kartal', 'Beyoğlu', 'Fatih',
  'Sarıyer', 'Bostancı', 'Cihangir', 'Moda', 'Etiler'
];

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [showNeighborhoods, setShowNeighborhoods] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !selectedNeighborhood) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password, selectedNeighborhood);
    } catch (e) {
      Alert.alert('Hata', e.message || 'Kayıt yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        <Text style={styles.emoji}>🌱</Text>
        <Text style={styles.title}>Topluluğa Katıl!</Text>
        <Text style={styles.subtitle}>Komşularınla eşya paylaşmaya başla</Text>

        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>📧</Text>
          <TextInput
            style={styles.input}
            placeholder="E-posta adresin"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Şifre (min. 6 karakter)"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowNeighborhoods(!showNeighborhoods)}
        >
          <Text style={styles.inputIcon}>📍</Text>
          <Text style={[styles.input, !selectedNeighborhood && { color: '#9CA3AF' }]}>
            {selectedNeighborhood || 'Mahalleni seç'}
          </Text>
          <Text style={styles.arrow}>{showNeighborhoods ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showNeighborhoods && (
          <View style={styles.neighborhoodList}>
            {neighborhoods.map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.neighborhoodItem,
                  selectedNeighborhood === n && styles.selectedNeighborhood
                ]}
                onPress={() => {
                  setSelectedNeighborhood(n);
                  setShowNeighborhoods(false);
                }}
              >
                <Text style={[
                  styles.neighborhoodText,
                  selectedNeighborhood === n && styles.selectedNeighborhoodText
                ]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.disabledBtn]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.registerBtnText}>Kayıt Ol 🎉</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Zaten hesabın var mı? <Text style={styles.loginBold}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  backBtn: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  arrow: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  neighborhoodList: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
    overflow: 'hidden',
  },
  neighborhoodItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedNeighborhood: {
    backgroundColor: '#D1FAE5',
  },
  neighborhoodText: {
    fontSize: 15,
    color: '#4B5563',
  },
  selectedNeighborhoodText: {
    color: '#047857',
    fontWeight: '600',
  },
  registerBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    color: '#6B7280',
  },
  loginBold: {
    color: '#10B981',
    fontWeight: '700',
  },
});

export default RegisterScreen;