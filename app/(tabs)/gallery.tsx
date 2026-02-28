import { loadGallery, saveGallery } from '@/utils/imageService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
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


  useFocusEffect(
    useCallback(() => {
      loadGalleryData();
    }, [])
  );

  const loadGalleryData = async () => {
    const data = await loadGallery();
    setGallery(data);
  };



  const handleImagePress = (image: any) => {
    router.push({
      pathname: '/preview',
      params: { imageUrl: image.url, prompt: image.prompt },
    });
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert('Delete Image', 'Remove this wallpaper?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedGallery = gallery.filter(
            (img: any) => img.id !== imageId
          );
          setGallery(updatedGallery);
          await saveGallery(updatedGallery);
        },
      },
    ]);
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
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.5 }}>
          Gallery
        </Text>
        <Text style={{ fontSize: 13, color: '#A3A3A3', marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>
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
            <Ionicons name="images-outline" size={48} color="#333" style={{ marginBottom: 16 }} />
            <Text style={{ color: '#666', fontSize: 16, textAlign: 'center', fontWeight: '500' }}>
              Your gallery is empty.
            </Text>
            <Text style={{ color: '#444', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
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


    </View>
  );
}
