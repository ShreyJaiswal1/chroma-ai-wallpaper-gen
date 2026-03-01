import {
  generateImage,
  generatePromptIdea,
  loadGallery,
  saveGallery,
} from '@/utils/imageService';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Generate() {
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSurprising, setIsSurprising] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  const handleSurpriseMe = async () => {
    setIsSurprising(true);
    try {
      const idea = await generatePromptIdea();
      if (idea) {
        setPrompt(idea);
      } else {
        Alert.alert('Oops', 'Failed to generate an idea. Try again!');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsSurprising(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    Keyboard.dismiss();
    setIsGenerating(true);

    try {
      const newImage = await generateImage(prompt);

      if (newImage) {
        const currentGallery = await loadGallery();
        const updatedGallery = [newImage, ...currentGallery].slice(0, 50);
        await saveGallery(updatedGallery);

        setGeneratedImage(newImage);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle='light-content' />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 16,
          zIndex: 10,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#FAFAFA',
            letterSpacing: -0.5,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}
        >
          Create
        </Text>
      </View>

      {/* Main Content Area */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingBottom: 100,
          marginBottom: 100, // Increased padding to stay clear of the fixed input
        }}
      >
        {isGenerating ? (
          // Skeleton Loader
          <View
            style={{
              height: '80%', // Replaced width constraint with a height constraint so it scales perfectly vertically
              aspectRatio: 9 / 16,
              maxWidth: 320,
              backgroundColor: '#171717',
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#262626',
              overflow: 'hidden',
            }}
          >
            <ActivityIndicator size='large' color='#FAFAFA' />
            <Text
              style={{
                color: '#666',
                marginTop: 16,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              Creating your vision...
            </Text>
          </View>
        ) : generatedImage ? (
          // Showcased Image (Small Form)
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: '80%', // Replaced width constraint with a height constraint here too
              aspectRatio: 9 / 16,
              maxWidth: 320,
              borderRadius: 24,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10,
            }}
            onPress={() => {
              router.push({
                pathname: '/preview',
                params: {
                  imageUrl: generatedImage.url,
                  prompt: generatedImage.prompt,
                },
              });
            }}
          >
            <Image
              source={{ uri: generatedImage.url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode='cover'
            />
            {/* Minimal gradient for the "tap to preview" affordance */}
            <LinearGradient
              colors={['transparent', 'rgba(10,10,10,0.8)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 80,
                justifyContent: 'flex-end',
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name='expand'
                  size={16}
                  color='#A3A3A3'
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: '#A3A3A3',
                    fontSize: 12,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Tap to Preview
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          // Default Empty State
          <View style={{ alignItems: 'center', opacity: 0.5 }}>
            <Ionicons name='color-wand-outline' size={64} color='#FAFAFA' />
            <Text
              style={{
                color: '#FAFAFA',
                marginTop: 16,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              Your masterpiece will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Floating Prompt Input */}
      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: 20,
          right: 20,
        }}
      >
        <BlurView
          intensity={80}
          tint='dark'
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'rgba(23, 23, 23, 0.7)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              padding: 8,
              alignItems: 'center',
            }}
          >
            {/* Surprise Me Button */}
            <TouchableOpacity
              onPress={handleSurpriseMe}
              disabled={isSurprising || isGenerating}
              style={{
                width: 44,
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              {isSurprising ? (
                <ActivityIndicator size='small' color='#A3A3A3' />
              ) : (
                <Ionicons name='dice-outline' size={24} color='#A3A3A3' />
              )}
            </TouchableOpacity>

            <TextInput
              style={{
                flex: 1,
                color: '#FAFAFA',
                fontSize: 15,
                paddingHorizontal: 8,
                paddingVertical: 12,
              }}
              placeholder='Imagine something beautiful...'
              placeholderTextColor='#666'
              value={prompt}
              onChangeText={setPrompt}
              onSubmitEditing={handleGenerate}
              editable={!isGenerating && !isSurprising}
            />

            {/* Generate Button */}
            <TouchableOpacity
              style={{
                backgroundColor: isGenerating ? '#333' : '#FAFAFA',
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
              }}
              onPress={handleGenerate}
              disabled={isGenerating || !prompt.trim() || isSurprising}
              activeOpacity={0.8}
            >
              {isGenerating ? (
                <ActivityIndicator size='small' color='#A3A3A3' />
              ) : (
                <Ionicons name='sparkles' size={20} color='#0A0A0A' />
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
