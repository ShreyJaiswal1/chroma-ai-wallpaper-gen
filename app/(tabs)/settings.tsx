import React from 'react';
import { StatusBar, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle='light-content' />
      <Text style={{ color: '#FAFAFA', fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
    </View>
  );
}
