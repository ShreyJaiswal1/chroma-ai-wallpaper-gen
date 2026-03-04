import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface InsightCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  isLoading?: boolean;
  valueFontSize?: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  value,
  label,
  isLoading = false,
  valueFontSize = 28,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#171717',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#262626',
      }}
    >
      <Ionicons
        name={icon}
        size={24}
        color='#FAFAFA'
        style={{ marginBottom: 16 }}
      />
      {isLoading ? (
        <ActivityIndicator
          size='small'
          color='#FAFAFA'
          style={{ alignSelf: 'flex-start', marginVertical: 4 }}
        />
      ) : (
        <Text
          style={{
            color: '#FAFAFA',
            fontSize: valueFontSize,
            fontWeight: '700',
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {value}
        </Text>
      )}
      <Text style={{ color: '#A3A3A3', fontSize: 13, fontWeight: '500' }}>
        {label}
      </Text>
    </View>
  );
};
