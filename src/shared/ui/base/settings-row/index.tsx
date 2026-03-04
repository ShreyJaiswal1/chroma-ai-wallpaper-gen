import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;
  isLoading?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  iconColor = '#FAFAFA',
  iconBgColor = 'rgba(255, 255, 255, 0.05)',
  title,
  subtitle,
  onPress,
  disabled = false,
  showChevron = false,
  isLoading = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? { onPress, disabled, activeOpacity: 0.7 }
    : {};

  return (
    <Container
      {...(containerProps as any)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#171717',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#262626',
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: iconBgColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 16,
        }}
      >
        {isLoading ? (
          <ActivityIndicator size='small' color={iconColor} />
        ) : (
          <Ionicons name={icon} size={24} color={iconColor} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FAFAFA', fontSize: 16, fontWeight: '600' }}>
          {title}
        </Text>
        <Text style={{ color: '#A3A3A3', fontSize: 13, marginTop: 2 }}>
          {subtitle}
        </Text>
      </View>
      {showChevron && (
        <Ionicons name='chevron-forward' size={20} color='#666' />
      )}
    </Container>
  );
};
