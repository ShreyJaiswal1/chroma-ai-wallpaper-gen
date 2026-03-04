import { AutoTrigger } from '@/src/shared/ui/base/auto-trigger';
import { PromptInput } from '@/src/shared/ui/base/prompt-input';
import { StyleSelector } from '@/src/shared/ui/base/style-selector';
import { Dialog } from '@/src/shared/ui/organisms/dialog';
import {
  generateImage,
  generatePromptIdea,
  loadGallery,
  saveGallery,
} from '@/utils/imageService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Generate() {
  const router = useRouter();

  const { width } = Dimensions.get('window');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSurprising, setIsSurprising] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState('none');

  // Animated value for input bar bottom position
  const INPUT_RESTING_BOTTOM = 110;
  const inputBottom = useRef(new Animated.Value(INPUT_RESTING_BOTTOM)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.spring(inputBottom, {
        toValue: e.endCoordinates.height + 10,
        useNativeDriver: false,
        friction: 8,
        tension: 80,
      }).start();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.spring(inputBottom, {
        toValue: INPUT_RESTING_BOTTOM,
        useNativeDriver: false,
        friction: 8,
        tension: 80,
      }).start();
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Dialog State Management
  const [dialogConfig, setDialogConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
  });

  const closeDialog = () =>
    setDialogConfig((prev) => ({ ...prev, visible: false }));

  const handleSurpriseMe = async () => {
    setIsSurprising(true);
    try {
      const idea = await generatePromptIdea();
      if (idea) {
        setPrompt(idea);
      } else {
        setDialogConfig({
          visible: true,
          title: 'Oops',
          message: 'Failed to generate an idea. Try again!',
          type: 'error',
        });
      }
    } catch (error) {
      setDialogConfig({
        visible: true,
        title: 'Error',
        message: 'Something went wrong.',
        type: 'error',
      });
    } finally {
      setIsSurprising(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setDialogConfig({
        visible: true,
        title: 'Prompt Required',
        message:
          'Please enter a description or use Surprise Me to generate an idea.',
        type: 'error',
      });
      return;
    }

    const promptToGenerate = prompt;
    Keyboard.dismiss();
    setPrompt('');
    setIsGenerating(true);

    try {
      const newImage = await generateImage(promptToGenerate, selectedStyle);

      if (newImage) {
        const currentGallery = await loadGallery();
        const updatedGallery = [newImage, ...currentGallery].slice(0, 50);
        await saveGallery(updatedGallery);

        setGeneratedImage(newImage);
      } else {
        throw new Error('Image generation failed');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setDialogConfig({
        visible: true,
        title: 'Generation Failed',
        message: 'We were unable to create your masterpiece. Please try again.',
        type: 'error',
      });
    } finally {
      setIsGenerating(false);
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

      {/* Style Selector */}
      <StyleSelector
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
      />

      {/* Main Content Area */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingBottom: 60,
          marginBottom: 80,
        }}
      >
        {isGenerating ? (
          <View
            style={{
              height: '80%',
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
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: '80%',
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
                  initialImageId: generatedImage.id,
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
      <PromptInput
        prompt={prompt}
        onChangePrompt={setPrompt}
        onGenerate={handleGenerate}
        onSurpriseMe={handleSurpriseMe}
        isGenerating={isGenerating}
        isSurprising={isSurprising}
        bottomPosition={inputBottom}
      />

      {/* Dynamic Status Dialog */}
      {dialogConfig.visible && (
        <Dialog>
          <AutoTrigger />
          <Dialog.Backdrop
            blurAmount={15}
            backgroundColor='rgba(0, 0, 0, 0.6)'
          />

          <Dialog.Content onClose={closeDialog}>
            <View
              style={{
                backgroundColor: '#171717',
                borderRadius: 24,
                padding: 24,
                width: width * 0.85,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#333',
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor:
                    dialogConfig.type === 'error'
                      ? 'rgba(255, 60, 60, 0.1)'
                      : 'rgba(52, 199, 89, 0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  alignSelf: 'center',
                }}
              >
                <Ionicons
                  name={
                    dialogConfig.type === 'error'
                      ? 'warning-outline'
                      : 'checkmark-circle-outline'
                  }
                  size={24}
                  color={dialogConfig.type === 'error' ? '#FF3B30' : '#34C759'}
                />
              </View>

              <Text
                style={{
                  color: '#FAFAFA',
                  fontSize: 20,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {dialogConfig.title}
              </Text>
              <Text
                style={{
                  color: '#A3A3A3',
                  fontSize: 15,
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                {dialogConfig.message}
              </Text>

              <Dialog.Close asChild>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: '#262626',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FAFAFA',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Got it
                  </Text>
                </TouchableOpacity>
              </Dialog.Close>
            </View>
          </Dialog.Content>
        </Dialog>
      )}
    </View>
  );
}
