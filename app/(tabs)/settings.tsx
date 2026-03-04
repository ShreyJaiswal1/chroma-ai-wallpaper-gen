import { AutoTrigger } from '@/src/shared/ui/base/auto-trigger';
import { InsightCard } from '@/src/shared/ui/base/insight-card';
import { SettingsRow } from '@/src/shared/ui/base/settings-row';
import { Dialog } from '@/src/shared/ui/organisms/dialog';
import { loadGallery } from '@/utils/imageService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import {
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
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const GITHUB_REPO = 'ShreyJaiswal1/ai-wallpaper-app';
  const currentVersion = Constants.expoConfig?.version ?? '1.0.0';

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
      await AsyncStorage.removeItem('@wallpaper_gallery');

      const dirUrl = FileSystem.documentDirectory;
      if (dirUrl) {
        const files = await FileSystem.readDirectoryAsync(dirUrl);
        for (const file of files) {
          if (file.startsWith('wallpaper_')) {
            await FileSystem.deleteAsync(dirUrl + file, { idempotent: true });
          }
        }
      }

      await fetchInsights();

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
    Linking.openURL(`https://github.com/${GITHUB_REPO}`);
  };

  const handleCheckForUpdate = async () => {
    setIsCheckingUpdate(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      );
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      const release = await res.json();

      const latestVersion = (release.tag_name || '').replace(/^v/, '');

      if (!latestVersion) {
        throw new Error('Could not determine latest version');
      }

      const isNewer = latestVersion !== currentVersion;

      if (!isNewer) {
        setDialogConfig({
          visible: true,
          title: 'Up to Date',
          message: `You're already on the latest version (v${currentVersion}).`,
          type: 'success',
        });
        return;
      }

      const apkAsset = release.assets?.find((a: any) =>
        a.name?.endsWith('.apk'),
      );

      if (apkAsset?.browser_download_url) {
        setDialogConfig({
          visible: true,
          title: 'Update Available',
          message: `v${latestVersion} is available (you have v${currentVersion}). Downloading the update now...`,
          type: 'success',
        });
        await Linking.openURL(apkAsset.browser_download_url);
      } else {
        setDialogConfig({
          visible: true,
          title: 'Update Available',
          message: `v${latestVersion} is available. Opening the release page...`,
          type: 'success',
        });
        await Linking.openURL(
          release.html_url ||
            `https://github.com/${GITHUB_REPO}/releases/latest`,
        );
      }
    } catch (error) {
      console.error('Update check failed:', error);
      setDialogConfig({
        visible: true,
        title: 'Update Check Failed',
        message:
          'Could not reach GitHub. Please check your internet connection and try again.',
        type: 'error',
      });
    } finally {
      setIsCheckingUpdate(false);
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
            <InsightCard
              icon='images-outline'
              value={totalImages}
              label='Images Created'
              isLoading={isLoading}
            />
            <InsightCard
              icon='server-outline'
              value={cacheSize}
              label='Cache Storage'
              isLoading={isLoading}
              valueFontSize={24}
            />
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

          <SettingsRow
            icon='logo-github'
            title='GitHub Repository'
            subtitle='View the source code'
            onPress={handleOpenGithub}
            showChevron
          />

          <SettingsRow
            icon='download-outline'
            title='Check for Updates'
            subtitle={
              isCheckingUpdate
                ? 'Checking...'
                : 'Download the latest release from GitHub'
            }
            onPress={handleCheckForUpdate}
            disabled={isCheckingUpdate}
            isLoading={isCheckingUpdate}
            showChevron
          />
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

          <SettingsRow
            icon='trash-outline'
            iconColor='#FF3B30'
            iconBgColor='rgba(255, 59, 48, 0.1)'
            title='Clear Cache & Data'
            subtitle='Delete all generated history and clean storage'
            onPress={() => setIsConfirmDialogVisible(true)}
            disabled={isClearing}
            isLoading={isClearing}
          />
        </View>

        {/* Version Footer */}
        <TouchableOpacity
          onPress={() => Linking.openURL('https://chroma.lazyshrey.in')}
          activeOpacity={0.6}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#444',
              fontSize: 12,
              marginTop: 8,
              marginBottom: 40,
            }}
          >
            Chroma AI v{currentVersion}
          </Text>
        </TouchableOpacity>
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
