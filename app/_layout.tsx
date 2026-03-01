import { Dialog } from '@/src/shared/ui/organisms/dialog';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RootLayout() {
  const hasRequested = useRef(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
    writeOnly: false,
    granularPermissions: ['photo'],
  });
  const { width } = Dimensions.get('window');

  useEffect(() => {
    async function checkAndRequestPermissions() {
      if (hasRequested.current) return;
      hasRequested.current = true;

      const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();

      if (status !== 'granted') {
        if (canAskAgain) {
          const { status: newStatus } =
            await MediaLibrary.requestPermissionsAsync(true);
          if (newStatus !== 'granted') {
            setShowPermissionDialog(true);
          }
        } else {
          setShowPermissionDialog(true);
        }
      }
    }

    checkAndRequestPermissions();
  }, []);

  return (
    <>
      <StatusBar style='light' />
      <ThemeProvider value={DarkTheme}>
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
      </ThemeProvider>

      {/* Permission Dialog */}
      {showPermissionDialog && (
        <Dialog>
          <AutoTrigger />
          <Dialog.Backdrop
            blurAmount={15}
            backgroundColor='rgba(0, 0, 0, 0.8)'
          />

          <Dialog.Content onClose={() => setShowPermissionDialog(false)}>
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
              <Text
                style={{
                  color: '#FAFAFA',
                  fontSize: 20,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Permissions Required
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
                Chroma needs storage permissions to save and set wallpapers.
                Please enable them in your device settings.
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Dialog.Close asChild>
                  <TouchableOpacity
                    style={{
                      flex: 1,
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
                      Later
                    </Text>
                  </TouchableOpacity>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <TouchableOpacity
                    onPress={() => Linking.openSettings()}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: '#FAFAFA',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#0A0A0A',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Settings
                    </Text>
                  </TouchableOpacity>
                </Dialog.Close>
              </View>
            </View>
          </Dialog.Content>
        </Dialog>
      )}
    </>
  );
}

// Helper component to auto-trigger the Reacticx Dialog once mounted
const AutoTrigger = () => {
  return (
    <Dialog.Trigger asChild>
      <AutoClickView />
    </Dialog.Trigger>
  );
};

// Ensure trigger fires
const AutoClickView = ({ onPress }: any) => {
  useEffect(() => {
    if (onPress) {
      setTimeout(onPress, 50);
    }
  }, [onPress]);
  return <View style={{ display: 'none' }} />;
};
