import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';

const QRScanScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useAuth();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.length >= 4) {
      Alert.alert(
        '✅ Kod Doğrulandı!',
        'Eşya teslim alınmıştır.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Hata', 'Geçerli bir kod girin');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Kod Tara</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.cameraBox}>
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <Text style={styles.scanEmoji}>📸</Text>
            </View>
          </View>
          <Text style={styles.cameraText}>Kamera burada açılacak</Text>
        </View>

        <Text style={styles.orText}>veya kodu manuel girin</Text>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Teslim kodunu girin"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={12}
          />
        </View>

        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
          <Text style={styles.verifyBtnText}>Kodu Doğrula ✅</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📦 {item.name}
          </Text>
          <Text style={styles.infoSubtext}>
            Teslim alan kişinin kodunu tarayın veya girin
          </Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  cameraBox: {
    width: '100%',
    height: 250,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#10B981',
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: 3, borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: 3, borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: 3, borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: 3, borderRightWidth: 3,
  },
  scanEmoji: {
    fontSize: 48,
  },
  cameraText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    position: 'absolute',
    bottom: 16,
  },
  orText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  inputBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 4,
  },
  verifyBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default QRScanScreen;