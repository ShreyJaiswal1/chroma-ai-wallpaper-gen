import { Dialog } from '@/src/shared/ui/organisms/dialog';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import {
  loadGallery,
  saveToDeviceGallery,
  WallpaperImage,
} from '../utils/imageService';

const { width, height } = Dimensions.get('window');

export default function Preview() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    initialImageId,
    imageUrl: paramImageUrl,
    prompt: paramPrompt,
  } = params;

  const [gallery, setGallery] = useState<WallpaperImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [savingStatus, setSavingStatus] = useState<
    Record<string, 'saving' | 'saved'>
  >({});
  const [settingStatus, setSettingStatus] = useState<
    Record<string, 'setting' | 'set'>
  >({});
  const [isLoading, setIsLoading] = useState(true);

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

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const init = async () => {
      if (initialImageId) {
        const data = await loadGallery();
        setGallery(data);
        const index = data.findIndex((img) => img.id === initialImageId);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } else if (paramImageUrl && paramPrompt) {
        setGallery([
          {
            id: 'temp',
            url: paramImageUrl as string,
            prompt: paramPrompt as string,
            timestamp: new Date().toISOString(),
          },
        ]);
        setCurrentIndex(0);
      }
      setIsLoading(false);
    };
    init();
  }, [initialImageId, paramImageUrl, paramPrompt]);

  const handleSave = async (image: WallpaperImage) => {
    if (
      !image.url ||
      savingStatus[image.id] === 'saving' ||
      savingStatus[image.id] === 'saved'
    )
      return;

    setSavingStatus((prev) => ({ ...prev, [image.id]: 'saving' }));
    const success = await saveToDeviceGallery(image.url);

    setSavingStatus((prev) => ({
      ...prev,
      [image.id]: success ? 'saved' : prev[image.id],
    }));

    if (!success) {
      setSavingStatus((prev) => {
        const next = { ...prev };
        delete next[image.id];
        return next;
      });
      setDialogConfig({
        visible: true,
        title: 'Save Failed',
        message:
          'There was an issue saving the image to your gallery. Please check your permissions and try again.',
        type: 'error',
      });
    }
  };

  const handleSetWallpaper = (image: WallpaperImage) => {
    if (
      !image.url ||
      settingStatus[image.id] === 'setting' ||
      settingStatus[image.id] === 'set'
    )
      return;

    setSettingStatus((prev) => ({ ...prev, [image.id]: 'setting' }));

    ManageWallpaper.setWallpaper(
      { uri: image.url },
      (res: any) => {
        if (res.status === 'success') {
          setSettingStatus((prev) => ({ ...prev, [image.id]: 'set' }));
          setDialogConfig({
            visible: true,
            title: 'Wallpaper Applied',
            message:
              'Your new AI wallpaper has been successfully set to your device!',
            type: 'success',
          });
        } else {
          setSettingStatus((prev) => {
            const next = { ...prev };
            delete next[image.id];
            return next;
          });
          setDialogConfig({
            visible: true,
            title: 'Application Error',
            message:
              'Failed to set the wallpaper. Your device may restrict this action.',
            type: 'error',
          });
        }
      },
      TYPE.BOTH,
    );
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setIsExpanded(false); // reset expanded state when swiping
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A0A0A',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size='large' color='#FAFAFA' />
      </View>
    );
  }

  if (gallery.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A0A0A',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FAFAFA' }}>Image not found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: WallpaperImage }) => {
    return (
      <View style={{ width, height }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ width: '100%', height: '100%' }}
          onPress={() => setIsFullScreen((prev) => !prev)}
        >
          <Image
            source={{ uri: item.url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode='cover'
          />
        </TouchableOpacity>
        {/* Subtle Gradient Overlay at bottom for text readability */}
        {!isFullScreen && (
          <LinearGradient
            colors={['transparent', 'rgba(10, 10, 10, 0.9)']}
            pointerEvents='none'
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: height * 0.4,
            }}
          />
        )}
      </View>
    );
  };

  const currentItem = gallery[currentIndex] || gallery[0];
  const isSavingCurrent = savingStatus[currentItem?.id] === 'saving';
  const hasSavedCurrent = savingStatus[currentItem?.id] === 'saved';
  const isSettingCurrent = settingStatus[currentItem?.id] === 'setting';
  const hasSetCurrent = settingStatus[currentItem?.id] === 'set';

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
        hidden={isFullScreen}
      />

      <FlatList
        ref={flatListRef}
        data={gallery}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={currentIndex}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        windowSize={5}
        removeClippedSubviews={false}
        extraData={isFullScreen}
      />

      {/* Top Floating Action Button - Back */}
      {!isFullScreen && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 10,
          }}
          activeOpacity={0.7}
        >
          <BlurView
            intensity={80}
            tint='dark'
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Ionicons
              name='chevron-back'
              size={24}
              color='#FAFAFA'
              style={{ marginLeft: -2 }}
            />
          </BlurView>
        </TouchableOpacity>
      )}

      {/* Pagination Indicator (Subtle) */}
      {!isFullScreen && gallery.length > 1 && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}
        >
          <Text style={{ color: '#FAFAFA', fontSize: 12, fontWeight: '600' }}>
            {currentIndex + 1} / {gallery.length}
          </Text>
        </View>
      )}

      {/* Bottom Content Area */}
      {!isFullScreen && (
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            left: 20,
            right: 20,
          }}
        >
          {/* Prompt Text */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsExpanded(!isExpanded)}
            onLongPress={async () => {
              if (currentItem?.prompt) {
                await Clipboard.setStringAsync(currentItem.prompt);
                setDialogConfig({
                  visible: true,
                  title: 'Copied!',
                  message: 'Prompt copied to clipboard.',
                  type: 'success',
                });
              }
            }}
          >
            <Text
              style={{
                color: '#FAFAFA',
                fontSize: 16,
                fontWeight: '500',
                lineHeight: 24,
                marginBottom: 24,
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
              numberOfLines={isExpanded ? undefined : 3}
            >
              "{currentItem?.prompt}"
            </Text>
          </TouchableOpacity>

          {/* Floating Action Button - Save */}
          <TouchableOpacity
            onPress={() => handleSave(currentItem)}
            activeOpacity={0.8}
            disabled={isSavingCurrent || hasSavedCurrent}
          >
            <BlurView
              intensity={80}
              tint='light' // Contrasting button
              style={{
                paddingVertical: 16,
                borderRadius: 20,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: hasSavedCurrent ? 0.8 : 1,
              }}
            >
              {isSavingCurrent ? (
                <ActivityIndicator size='small' color='#0A0A0A' />
              ) : hasSavedCurrent ? (
                <>
                  <Ionicons
                    name='checkmark-circle'
                    size={20}
                    color='#0A0A0A'
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: '#0A0A0A',
                      fontSize: 16,
                      fontWeight: '600',
                      letterSpacing: 0.5,
                    }}
                  >
                    Saved to Gallery
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name='download-outline'
                    size={20}
                    color='#0A0A0A'
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: '#0A0A0A',
                      fontSize: 16,
                      fontWeight: '600',
                      letterSpacing: 0.5,
                    }}
                  >
                    Save Wallpaper
                  </Text>
                </>
              )}
            </BlurView>
          </TouchableOpacity>

          {/* Floating Action Button - Set Wallpaper */}
          <TouchableOpacity
            onPress={() => handleSetWallpaper(currentItem)}
            activeOpacity={0.8}
            disabled={isSettingCurrent || hasSetCurrent}
            style={{ marginTop: 12 }}
          >
            <BlurView
              intensity={80}
              tint='dark'
              style={{
                paddingVertical: 16,
                borderRadius: 20,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                opacity: hasSetCurrent ? 0.8 : 1,
              }}
            >
              {isSettingCurrent ? (
                <ActivityIndicator size='small' color='#FAFAFA' />
              ) : hasSetCurrent ? (
                <>
                  <Ionicons
                    name='checkmark-circle'
                    size={20}
                    color='#FAFAFA'
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: '#FAFAFA',
                      fontSize: 16,
                      fontWeight: '600',
                      letterSpacing: 0.5,
                    }}
                  >
                    Applied as Wallpaper
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name='color-wand-outline'
                    size={20}
                    color='#FAFAFA'
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: '#FAFAFA',
                      fontSize: 16,
                      fontWeight: '600',
                      letterSpacing: 0.5,
                    }}
                  >
                    Set as Wallpaper
                  </Text>
                </>
              )}
            </BlurView>
          </TouchableOpacity>
        </View>
      )}

      {/* Dynamic Status Dialog */}
      {dialogConfig.visible && (
        <Dialog>
          <AutoTrigger />
          <Dialog.Backdrop
            blurAmount={15}
            backgroundColor='rgba(0, 0, 0, 0.6)'
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
    </View>
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
