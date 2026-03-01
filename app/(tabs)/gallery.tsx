import { Dialog } from '@/src/shared/ui/organisms/dialog';
import { loadGallery, saveGallery } from '@/utils/imageService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Gallery() {
  const router = useRouter();
  type WallpaperImage = {
    id: string;
    url: string;
    prompt: string;
    timestamp: string;
  };

  const [gallery, setGallery] = useState<WallpaperImage[]>([]);
  const { width } = Dimensions.get('window');

  useFocusEffect(
    useCallback(() => {
      loadGalleryData();
    }, []),
  );

  const loadGalleryData = async () => {
    const data = await loadGallery();
    setGallery(data);
  };

  const handleImagePress = (image: any) => {
    router.push({
      pathname: '/preview',
      params: {
        initialImageId: image.id,
        imageUrl: image.url,
        prompt: image.prompt,
      },
    });
  };

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (selectedImageId) {
      const updatedGallery = gallery.filter(
        (img: any) => img.id !== selectedImageId,
      );
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
      setSelectedImageId(null);
    }
  };

  const cancelDelete = () => {
    setSelectedImageId(null);
  };

  const handleDeleteImage = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  // Split gallery into two columns for true masonry
  const leftColumn = gallery.filter((_, i) => i % 2 === 0);
  const rightColumn = gallery.filter((_, i) => i % 2 !== 0);

  const renderColumnItem = (image: any, index: number, isLeft: boolean) => {
    // Generate deterministic but varied heights based on ID for a natural masonry look
    const charCode = image.id.charCodeAt(image.id.length - 1) || 0;
    const height = 200 + (charCode % 3) * 60; // Heights will be 200, 260, or 320

    return (
      <TouchableOpacity
        key={image.id}
        style={{
          width: '100%',
          marginBottom: 16,
        }}
        onPress={() => handleImagePress(image)}
        onLongPress={() => handleDeleteImage(image.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: image.url }}
          style={{
            width: '100%',
            height: height,
            borderRadius: 16,
            backgroundColor: '#171717',
          }}
          resizeMode='cover'
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle='light-content' />

      {/* Header */}
      <View
        style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#FAFAFA',
            letterSpacing: -0.5,
          }}
        >
          Gallery
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#A3A3A3',
            marginTop: 4,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {gallery.length} Items
        </Text>
      </View>

      {/* Gallery - True Masonry Layout */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }} // padding for tabs
        showsVerticalScrollIndicator={false}
      >
        {gallery.length === 0 ? (
          <View
            style={{
              width: '100%',
              padding: 40,
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
            }}
          >
            <Ionicons
              name='images-outline'
              size={48}
              color='#333'
              style={{ marginBottom: 16 }}
            />
            <Text
              style={{
                color: '#666',
                fontSize: 16,
                textAlign: 'center',
                fontWeight: '500',
              }}
            >
              Your gallery is empty.
            </Text>
            <Text
              style={{
                color: '#444',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Generate your first wallpaper below.
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingTop: 8,
              gap: 16, // Space between columns
            }}
          >
            {/* Left Column */}
            <View style={{ flex: 1 }}>
              {leftColumn.map((img, i) => renderColumnItem(img, i, true))}
            </View>

            {/* Right Column */}
            <View style={{ flex: 1, paddingTop: 32 }}>
              {/* Padding top staggers the start of the right column for better masonry feel */}
              {rightColumn.map((img, i) => renderColumnItem(img, i, false))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Reacticx Dialog for Deletion Confirmation */}
      {selectedImageId && (
        <Dialog>
          {/* We must render a Trigger to actually make the Dialog open. 
              We can use auto-triggering on mount with a ref */}
          <AutoTrigger />

          <Dialog.Backdrop
            blurAmount={15}
            backgroundColor='rgba(0, 0, 0, 0.6)'
          />

          <Dialog.Content onClose={cancelDelete}>
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
                  backgroundColor: 'rgba(255, 60, 60, 0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  alignSelf: 'center',
                }}
              >
                <Ionicons name='trash-outline' size={24} color='#FF3B30' />
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
                Delete Wallpaper?
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
                This action cannot be undone. Are you sure you want to
                permanently remove this image from your gallery?
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Dialog.Close asChild>
                  <TouchableOpacity
                    onPress={cancelDelete}
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
                </Dialog.Close>

                <Dialog.Close asChild>
                  <TouchableOpacity
                    onPress={confirmDelete}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: '#FF3B30',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </Dialog.Close>
              </View>
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

// We need a view that takes the 'onPress' prop injected by Dialog.Trigger
const AutoClickView = ({ onPress }: any) => {
  useEffect(() => {
    if (onPress) {
      // Slight delay ensures the modal mounts before we try to open it
      setTimeout(onPress, 50);
    }
  }, [onPress]);
  return <View style={{ display: 'none' }} />;
};
