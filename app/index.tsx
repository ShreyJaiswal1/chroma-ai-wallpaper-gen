import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Navigate after a delay
    const timer = setTimeout(() => {
      router.replace('/gallery');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/splash.png')} // 👈 place your AI/futuristic art image here
        style={{
          flex: 1,
          width,
          height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode='cover'
      >
      </ImageBackground>

      <StatusBar barStyle='light-content' />

      {/* Text Container with Blur */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          zIndex: 2,
          alignItems: 'center',
        }}
      >
        <LinearGradient
          colors={['rgba(241, 241, 241, 0.88)', 'rgba(255, 255, 255, 1)']}
          style={{
            height: '200',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            borderRadius: 20
          }}
        />
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 20,
            fontFamily: 'Poppins-Bold',
          }}
        >
          Chroma wallpapers
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#555',
            marginBottom: 60,
            fontFamily: 'Poppins-Regular',
          }}
        >
          AI-generated wallpapers at your fingertips
        </Text>
      </Animated.View>
    </View>
  );
}
