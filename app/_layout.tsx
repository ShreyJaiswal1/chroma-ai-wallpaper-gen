import * as MediaLibrary from 'expo-media-library';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Request permissions on app start
    MediaLibrary.requestPermissionsAsync(true);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0A' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name='index' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='preview' />
      </Stack>
    </>
  );
}
// import { NativeTabs } from 'expo-router/unstable-native-tabs';

// export default function TabLayout() {
//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="gallery">
//         <NativeTabs.Trigger.Label>Gallery</NativeTabs.Trigger.Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="preview">
//         <NativeTabs.Trigger.Label>Preview</NativeTabs.Trigger.Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }
