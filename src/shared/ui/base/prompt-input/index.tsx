import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface PromptInputProps {
  prompt: string;
  onChangePrompt: (text: string) => void;
  onGenerate: () => void;
  onSurpriseMe: () => void;
  isGenerating: boolean;
  isSurprising: boolean;
  bottomPosition: Animated.Value;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onChangePrompt,
  onGenerate,
  onSurpriseMe,
  isGenerating,
  isSurprising,
  bottomPosition,
}) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: bottomPosition,
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
            alignItems: 'flex-end',
          }}
        >
          {/* Surprise Me Button */}
          <TouchableOpacity
            onPress={onSurpriseMe}
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
              paddingTop: 12,
              paddingBottom: 12,
              maxHeight: 100,
            }}
            multiline={true}
            placeholder='Imagine something beautiful...'
            placeholderTextColor='#666'
            value={prompt}
            onChangeText={onChangePrompt}
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
            onPress={onGenerate}
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
    </Animated.View>
  );
};
