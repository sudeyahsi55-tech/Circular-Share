import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import { badges as allBadges } from '../utils/categories';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ shared: 0, borrowed: 0, returned: 0, points: 0 });
  const [userBadges, setUserBadges] = useState([]);

  useEffect(() => {
    loadProfile();
    const unsub = navigation.addListener('focus', loadProfile);
    return unsub;
  }, []);

  const loadProfile = async () => {
    if (user) {
      const s = await LocalDB.getStats(user.id);
      setStats(s);
      const b = await LocalDB.getBadges(user.id);
      setUserBadges(b);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabından çıkmak istiyor musun?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getLevel = () => {
    if (stats.points >= 200) return { name: 'Efsane', icon: '👑', color: '#F59E0B' };
    if (stats.points >= 100) return { name: 'Uzman', icon: '🏆', color: '#8B5CF6' };
    if (stats.points >= 50) return { name: 'İleri', icon: '⭐', color: '#3B82F6' };
    return { name: 'Başlangıç', icon: '🌱', color: '#10B981' };
  };

  const level = getLevel();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>

          <View style={styles.profileCard}>
            <Text style={styles.avatar}>{user?.avatar || '😊'}</Text>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={[styles.levelBadge, { backgroundColor: level.color + '30' }]}>
              <Text style={styles.levelIcon}>{level.icon}</Text>
              <Text style={[styles.levelText, { color: level.color }]}>{level.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.statIcon}>📤</Text>
              <Text style={styles.statNumber}>{stats.shared}</Text>
              <Text style={styles.statLabel}>Paylaşım</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.statIcon}>📥</Text>
              <Text style={styles.statNumber}>{stats.borrowed}</Text>
              <Text style={styles.statLabel}>Ödünç Alma</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.statIcon}>🔄</Text>
              <Text style={styles.statNumber}>{stats.returned}</Text>
              <Text style={styles.statLabel}>İade</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statNumber}>{stats.points}</Text>
              <Text style={styles.statLabel}>Puan</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Rozetler</Text>
          {userBadges.length > 0 ? (
            <View style={styles.badgesGrid}>
              {userBadges.map((badge) => (
                <View key={badge.id} style={[styles.badgeCard, { borderColor: badge.color }]}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBadges}>
              <Text style={styles.emptyBadgesEmoji}>🎯</Text>
              <Text style={styles.emptyBadgesText}>
                Henüz rozet kazanmadın.{'\n'}Eşya paylaşarak ve iade ederek rozet kazanabilirsin!
              </Text>
            </View>
          )}

          <Text style={styles.subTitle}>Kazanılabilecek Rozetler</Text>
          <View style={styles.badgesGrid}>
            {allBadges
              .filter(b => !userBadges.find(ub => ub.id === b.id))
              .slice(0, 4)
              .map((badge) => (
                <View key={badge.id} style={[styles.badgeCard, styles.lockedBadge]}>
                  <Text style={[styles.badgeIcon, { opacity: 0.3 }]}>{badge.icon}</Text>
                  <Text style={[styles.badgeName, { color: '#9CA3AF' }]}>{badge.name}</Text>
                  <Text style={[styles.badgeDesc, { color: '#D1D5DB' }]}>{badge.description}</Text>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Mahalle</Text>
          <View style={styles.neighborhoodCard}>
            <Text style={styles.neighborhoodIcon}>🏘️</Text>
            <Text style={styles.neighborhoodName}>{user?.neighborhood || 'Belirtilmemiş'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyItems')}
          >
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={styles.menuText}>Eşyalarım</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChatList')}
          >
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>Mesajlar & Talepler</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Çıkış Yap</Text>
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
    backgroundColor: '#047857',
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    paddingTop: 56,
    paddingLeft: 20,
    paddingBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  profileCard: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  avatar: {
    fontSize: 64,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 14,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  lockedBadge: {
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 14,
  },
  emptyBadges: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyBadgesEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyBadgesText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  neighborhoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  neighborhoodIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  neighborhoodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default ProfileScreen;