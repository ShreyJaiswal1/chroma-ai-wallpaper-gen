import { IMAGE_STYLES, type ImageStyle } from '@/utils/imageService';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
}) => {
  return (
    <View style={{ paddingBottom: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 8,
        }}
      >
        {IMAGE_STYLES.map((style: ImageStyle) => {
          const isActive = selectedStyle === style.id;
          return (
            <TouchableOpacity
              key={style.id}
              onPress={() => onStyleChange(style.id)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isActive
                  ? 'rgba(250, 250, 250, 0.12)'
                  : 'rgba(255, 255, 255, 0.04)',
                borderWidth: 1,
                borderColor: isActive
                  ? 'rgba(250, 250, 250, 0.4)'
                  : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <Text
                style={{
                  color: isActive ? '#FAFAFA' : '#888',
                  fontSize: 13,
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {style.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
