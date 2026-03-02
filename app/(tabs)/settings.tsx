import { Dialog } from '@/src/shared/ui/organisms/dialog';
import { loadGallery } from '@/utils/imageService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Settings() {
  const { width } = Dimensions.get('window');
  const [totalImages, setTotalImages] = useState(0);
  const [cacheSize, setCacheSize] = useState('0.00 MB');
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

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
    type: 'success',
  });

  const closeDialog = () =>
    setDialogConfig((prev) => ({ ...prev, visible: false }));

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const gallery = await loadGallery();
      setTotalImages(gallery.length);

      const dirUrl = FileSystem.documentDirectory;
      if (dirUrl) {
        const files = await FileSystem.readDirectoryAsync(dirUrl);
        let totalBytes = 0;
        for (const file of files) {
          if (file.startsWith('wallpaper_')) {
            const fileInfo = await FileSystem.getInfoAsync(dirUrl + file);
            if (fileInfo.exists && !fileInfo.isDirectory) {
              totalBytes += fileInfo.size || 0;
            }
          }
        }
        setCacheSize((totalBytes / (1024 * 1024)).toFixed(2) + ' MB');
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // 1. Delete AsyncStorage Gallery Data
      await AsyncStorage.removeItem('@wallpaper_gallery');

      // 2. Delete all cached files in the FileSystem documentDirectory
      const dirUrl = FileSystem.documentDirectory;
      if (dirUrl) {
        const files = await FileSystem.readDirectoryAsync(dirUrl);
        for (const file of files) {
          if (file.startsWith('wallpaper_')) {
            await FileSystem.deleteAsync(dirUrl + file, { idempotent: true });
          }
        }
      }

      // 3. Refresh Insights visually
      await fetchInsights();

      // 4. Show Success Dialog
      setDialogConfig({
        visible: true,
        title: 'Cache Cleared',
        message:
          'All generated images and storage caches have been successfully deleted.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      setDialogConfig({
        visible: true,
        title: 'Error',
        message: 'There was a problem wiping the local cache.',
        type: 'error',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleOpenGithub = () => {
    Linking.openURL('https://github.com/ShreyJaiswal1/ai-wallpaper-app');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle='light-content' />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#FAFAFA',
            letterSpacing: -0.5,
          }}
        >
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 32 }}>
        {/* Insights Section */}
        <View style={{ gap: 16 }}>
          <Text
            style={{
              color: '#A3A3A3',
              fontSize: 13,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Insights
          </Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            {/* Total Images Card */}
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
                name='images-outline'
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
                    fontSize: 28,
                    fontWeight: '700',
                    marginBottom: 4,
                  }}
                >
                  {totalImages}
                </Text>
              )}
              <Text
                style={{ color: '#A3A3A3', fontSize: 13, fontWeight: '500' }}
              >
                Images Created
              </Text>
            </View>

            {/* Cache Storage Card */}
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
                name='server-outline'
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
                    fontSize: 24,
                    fontWeight: '700',
                    marginBottom: 8,
                  }}
                  numberOfLines={1}
                >
                  {cacheSize}
                </Text>
              )}
              <Text
                style={{ color: '#A3A3A3', fontSize: 13, fontWeight: '500' }}
              >
                Cache Storage
              </Text>
            </View>
          </View>
        </View>

        {/* Links Section */}
        <View style={{ gap: 16 }}>
          <Text
            style={{
              color: '#A3A3A3',
              fontSize: 13,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            About
          </Text>

          <TouchableOpacity
            onPress={handleOpenGithub}
            activeOpacity={0.7}
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
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name='logo-github' size={24} color='#FAFAFA' />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: '#FAFAFA', fontSize: 16, fontWeight: '600' }}
              >
                GitHub Repository
              </Text>
              <Text style={{ color: '#A3A3A3', fontSize: 13, marginTop: 2 }}>
                View the source code
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#666' />
          </TouchableOpacity>

          <View
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
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons
                name='information-circle-outline'
                size={24}
                color='#FAFAFA'
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: '#FAFAFA', fontSize: 16, fontWeight: '600' }}
              >
                Version
              </Text>
              <Text style={{ color: '#A3A3A3', fontSize: 13, marginTop: 2 }}>
                Chroma AI v{Constants.expoConfig?.version ?? '1.0.0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={{ gap: 16, marginBottom: 20 }}>
          <Text
            style={{
              color: '#a7a7a7ff',
              fontSize: 13,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Danger Zone
          </Text>

          <TouchableOpacity
            onPress={() => setIsConfirmDialogVisible(true)}
            disabled={isClearing}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(250, 250, 250, 0.05)',
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(110, 110, 110, 0.2)',
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              {isClearing ? (
                <ActivityIndicator size='small' color='#FF3B30' />
              ) : (
                <Ionicons name='trash-outline' size={24} color='#FF3B30' />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: '#ffffffff', fontSize: 16, fontWeight: '600' }}
              >
                Clear Cache & Data
              </Text>
              <Text
                style={{
                  color: 'rgba(177, 177, 177, 0.8)',
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Delete all generated history and clean storage
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dynamic Status Dialog */}
      {dialogConfig.visible && (
        <Dialog>
          <AutoTrigger />
          <Dialog.Backdrop
            blurAmount={15}
            backgroundColor='rgba(0, 0, 0, 0.8)'
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

      {/* Confirmation Dialog */}
      {isConfirmDialogVisible && (
        <Dialog>
          <AutoTrigger />
          <Dialog.Backdrop
            blurAmount={15}
            backgroundColor='rgba(0, 0, 0, 0.8)'
          />

          <Dialog.Content onClose={() => setIsConfirmDialogVisible(false)}>
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
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  alignSelf: 'center',
                }}
              >
                <Ionicons name='warning-outline' size={24} color='#FF3B30' />
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
                Clear Cache?
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
                This action cannot be undone. All generated images and storage
                caches will be permanently deleted.
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setIsConfirmDialogVisible(false)}
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
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setIsConfirmDialogVisible(false);
                    handleClearCache();
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 59, 48, 0.1)',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 59, 48, 0.2)',
                  }}
                >
                  <Text
                    style={{
                      color: '#FF3B30',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog.Content>
        </Dialog>
      )}
    </View>
  );
}

// Helper component to auto-trigger the Dialog once mounted
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
