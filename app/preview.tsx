import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { saveToDeviceGallery } from '../utils/imageService';

const { width, height } = Dimensions.get('window');

export default function Preview() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { imageUrl, prompt } = params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = async () => {
    if (imageUrl && !isSaving && !hasSaved) {
      setIsSaving(true);
      const success = await saveToDeviceGallery(imageUrl as string);
      setIsSaving(false);

      if (success) {
        setHasSaved(true);
      } else {
        Alert.alert('Error', 'Failed to save image.');
      }
    }
  };

  if (!imageUrl) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A0A0A',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FAFAFA' }}>Image not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
      />

      {/* Edge-to-Edge Image */}
      <Image
        source={{ uri: imageUrl as string }}
        style={{
          width,
          height,
          position: 'absolute',
        }}
        resizeMode='cover'
      />

      {/* Subtle Gradient Overlay at bottom for text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(10, 10, 10, 0.9)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.4,
        }}
      />

      {/* Top Floating Action Button - Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 10,
        }}
        activeOpacity={0.7}
      >
        <BlurView
          intensity={80}
          tint='dark'
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Ionicons
            name='chevron-back'
            size={24}
            color='#FAFAFA'
            style={{ marginLeft: -2 }}
          />
        </BlurView>
      </TouchableOpacity>

      {/* Bottom Content Area */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 20,
          right: 20,
        }}
      >
        {/* Prompt Text */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text
            style={{
              color: '#FAFAFA',
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 24,
              marginBottom: 24,
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
            numberOfLines={isExpanded ? undefined : 3}
          >
            "{prompt}"
          </Text>
        </TouchableOpacity>

        {/* Floating Action Button - Save */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isSaving || hasSaved}
        >
          <BlurView
            intensity={80}
            tint='light' // Contrasting button
            style={{
              paddingVertical: 16,
              borderRadius: 20,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              overflow: 'hidden',
              opacity: hasSaved ? 0.8 : 1,
            }}
          >
            {isSaving ? (
              <ActivityIndicator size='small' color='#0A0A0A' />
            ) : hasSaved ? (
              <>
                <Ionicons
                  name='checkmark-circle'
                  size={20}
                  color='#0A0A0A'
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: '#0A0A0A',
                    fontSize: 16,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}
                >
                  Saved to Gallery
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name='download-outline'
                  size={20}
                  color='#0A0A0A'
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: '#0A0A0A',
                    fontSize: 16,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}
                >
                  Save Wallpaper
                </Text>
              </>
            )}
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );
}
