import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const QRCodeScreen = ({ navigation, route }) => {
  const { request, item } = route.params;
  const qrData = request.qrCode || request.id;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>📱</Text>
        <Text style={styles.title}>Teslim Alma Kodu</Text>
        <Text style={styles.subtitle}>
          Bu kodu eşya sahibine gösterin
        </Text>

        <View style={styles.qrBox}>
          <View style={styles.qrPattern}>
            <View style={styles.qrRow}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    { backgroundColor: Math.random() > 0.4 ? '#1F2937' : '#FFF' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.qrRow}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    { backgroundColor: Math.random() > 0.4 ? '#1F2937' : '#FFF' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.qrRow}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    { backgroundColor: Math.random() > 0.4 ? '#1F2937' : '#FFF' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.qrCenter}>
              <Text style={styles.qrCenterEmoji}>♻️</Text>
            </View>
            <View style={styles.qrRow}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    { backgroundColor: Math.random() > 0.4 ? '#1F2937' : '#FFF' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.qrRow}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    { backgroundColor: Math.random() > 0.4 ? '#1F2937' : '#FFF' }
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Teslim Kodu</Text>
          <Text style={styles.codeValue}>{qrData.substring(0, 8).toUpperCase()}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📦 {item.name}</Text>
          <Text style={styles.infoText}>Eşya sahibi bu kodu tarayarak teslimi onaylayacak.</Text>
          <Text style={styles.infoText}>İade ederken de aynı kodu kullanın.</Text>
        </View>

        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => navigation.navigate('ReturnSuccess', { item, request })}
        >
          <Text style={styles.returnBtnText}>✅ İade Ettim (Simüle Et)</Text>
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
  backBtn: {
    paddingTop: 56,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 10,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrBox: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  qrPattern: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  qrCell: {
    width: 20,
    height: 20,
    borderRadius: 3,
  },
  qrCenter: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  qrCenterEmoji: {
    fontSize: 36,
  },
  codeBox: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 4,
  },
  infoCard: {
    backgroundColor: '#EBF5FF',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 20,
  },
  returnBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  returnBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default QRCodeScreen;