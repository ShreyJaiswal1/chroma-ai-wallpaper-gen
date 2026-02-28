import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // sped up to fit in 700ms
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto redirect after 0.7 seconds (700ms)
    const timer = setTimeout(() => {
      router.replace('/(tabs)/gallery');
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle='light-content' />

      {/* Minimalistic Background Element */}
      <View
        style={{
          position: 'absolute',
          top: -height * 0.2,
          right: -width * 0.3,
          width: width * 1.5,
          height: width * 1.5,
          borderRadius: width * 0.75,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          filter: 'blur(100px)' as any, // Web support or just placeholder for native feel
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -height * 0.1,
          left: -width * 0.2,
          width: width * 1.2,
          height: width * 1.2,
          borderRadius: width * 0.6,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
           filter: 'blur(100px)' as any,
        }}
      />

      {/* Main Content */}
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          paddingHorizontal: 40,
        }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: '800', // Extra bold for simple elegance
            color: '#FAFAFA',
            letterSpacing: -1.5, // Tighter tracking for modern look
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Chroma.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#A3A3A3',
            textAlign: 'center',
            lineHeight: 24,
            fontWeight: '400',
            letterSpacing: 0.2,
          }}
        >
          AI-generated wallpapers.
          {'\n'}Minimal. Beautiful. Yours.
        </Text>
      </Animated.View>

    </View>
  );
}
