import React from 'react';
import { StatusBar, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StatusBar barStyle='light-content' />
      <Text
        style={{
          color: '#FAFAFA',
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        Settings
      </Text>
      <Text style={{ color: '#A3A3A3', fontSize: 16 }}>Coming soon</Text>
    </View>
  );
}
