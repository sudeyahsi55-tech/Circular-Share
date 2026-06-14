import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import ConfettiOverlay from '../components/ConfettiOverlay';
import BadgePopup from '../components/BadgePopup';
import { badges } from '../utils/categories';

const { width } = Dimensions.get('window');

const ReturnSuccessScreen = ({ navigation, route }) => {
  const { item, request } = route.params;
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(true);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const [stats, setStats] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    handleReturn();
    animateHero();
  }, []);

  const handleReturn = async () => {
    try {
      const updatedStats = await LocalDB.updateStats(user.id, 'returned');
      setStats(updatedStats);

      if (updatedStats.returned === 1) {
        const badge = badges.find(b => b.id === 'speed_return');
        await LocalDB.addBadge(user.id, badge);
        setTimeout(() => {
          setEarnedBadge(badge);
          setShowBadge(true);
        }, 2000);
      }

      if (updatedStats.points >= 50) {
        const badge = badges.find(b => b.id === 'sustainability_hero');
        await LocalDB.addBadge(user.id, badge);
        if (!earnedBadge) {
          setTimeout(() => {
            setEarnedBadge(badge);
            setShowBadge(true);
          }, 2000);
        }
      }

      if (request) {
        await LocalDB.updateRequest(request.id, { status: 'returned' });
      }
    } catch (e) {
      console.error('İade hatası:', e);
    }
  };

  const animateHero = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ConfettiOverlay visible={showConfetti} onFinish={() => setShowConfetti(false)} />

      <BadgePopup
        badge={earnedBadge}
        visible={showBadge}
        onClose={() => setShowBadge(false)}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.heroBox,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          <Text style={styles.heroEmoji}>🦸</Text>
        </Animated.View>

        <Text style={styles.title}>Sürdürülebilirlik{'\n'}Kahramanı!</Text>
        <Text style={styles.subtitle}>
          Eşyayı başarıyla iade ettin! 🌍{'\n'}
          Gezegene katkın için teşekkürler!
        </Text>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>🏆 Senin Katkın</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.returned || 1}</Text>
              <Text style={styles.statLabel}>İade</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>+50</Text>
              <Text style={styles.statLabel}>Puan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.points || 50}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemCardText}>
            ✅ <Text style={styles.bold}>{item?.name}</Text> başarıyla iade edildi
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeBtnText}>Ana Sayfaya Dön 🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => {
            setShowConfetti(true);
          }}
        >
          <Text style={styles.shareBtnText}>🎉 Tekrar Kutla!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#047857',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  heroBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  itemCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 28,
  },
  itemCardText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  homeBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  homeBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#047857',
  },
  shareBtn: {
    paddingVertical: 14,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
});

export default ReturnSuccessScreen;