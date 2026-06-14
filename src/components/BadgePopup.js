import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BadgePopup = ({ badge, visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible || !badge) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
      <Animated.View
        style={[
          styles.popup,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              backgroundColor: badge.color || '#10B981',
            },
          ]}
        />
        <Text style={styles.badgeIcon}>{badge.icon}</Text>
        <Text style={styles.congratsText}>🎉 Tebrikler! 🎉</Text>
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDesc}>{badge.description}</Text>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: badge.color || '#10B981' }]} onPress={onClose}>
          <Text style={styles.closeBtnText}>Harika! 🌟</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
  },
  popup: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: width * 0.8,
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -20,
  },
  badgeIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  closeBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BadgePopup;