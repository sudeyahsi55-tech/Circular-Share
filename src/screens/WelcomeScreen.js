import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />
      <View style={[styles.bgCircle, styles.bgCircle3]} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: floatAnim },
              ],
            },
          ]}
        >
          <Text style={styles.logoEmoji}>♻️</Text>
          <View style={styles.logoIconsRow}>
            <Text style={styles.miniEmoji}>🔧</Text>
            <Text style={styles.miniEmoji}>⛺</Text>
            <Text style={styles.miniEmoji}>📚</Text>
          </View>
        </Animated.View>

        <Text style={styles.title}>CircularShare</Text>
        <Text style={styles.subtitle}>Eşya Paylaşım Ağı</Text>

        <View style={styles.featuresBox}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🏘️</Text>
            <Text style={styles.featureText}>Mahallendeki eşyaları keşfet</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🤝</Text>
            <Text style={styles.featureText}>Komşularınla paylaş & takas et</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🌍</Text>
            <Text style={styles.featureText}>Sürdürülebilir yaşama katkı sağla</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Rozet kazan, toplulukta yüksel</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>Hadi Başlayalım! 🚀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Zaten hesabın var mı? <Text style={styles.loginBold}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#047857',
    justifyContent: 'center',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  bgCircle1: {
    width: 300,
    height: 300,
    top: -50,
    right: -100,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -80,
  },
  bgCircle3: {
    width: 150,
    height: 150,
    top: height * 0.3,
    right: -40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 80,
  },
  logoIconsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  miniEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 32,
    fontWeight: '500',
  },
  featuresBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  startBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  startBtnText: {
    color: '#047857',
    fontSize: 18,
    fontWeight: '800',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  loginBold: {
    fontWeight: '700',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;