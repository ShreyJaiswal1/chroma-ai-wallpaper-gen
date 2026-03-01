import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

const STORAGE_KEY = '@wallpaper_gallery';
// Note: In production, API keys should never be hardcoded or shipped to the client device.
const A4F_API_KEY = process.env.EXPO_PUBLIC_A4F_API_KEY;
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export interface WallpaperImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
}

// Load gallery from AsyncStorage
export const loadGallery = async (): Promise<WallpaperImage[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error loading gallery:', error);
    return [];
  }
};

// Save gallery to AsyncStorage
export const saveGallery = async (gallery: WallpaperImage[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
  } catch (error) {
    console.error('Error saving gallery:', error);
  }
};
// 1. Define high-impact creative "anchors"
const aesthetics = [
  // NATURE & ORGANIC
  'Bioluminescent Mycology: Translucent neon fungi, glowing mycelium networks, damp dark forest floor, macro bokeh, fiber-optic spores, ethereal deep-blue ambiance, cinematic depth of field.',
  'Iridescent Petal-Core: Macro photography of a crystalline flower, liquid mercury dewdrops, prismatic light refraction, soft pastel gradients, hyper-realistic silk textures, f/1.8 aperture.',
  'Frozen Volcanic Earth: Jagged obsidian rock formations meeting glowing molten lava, rising volcanic steam, high-contrast chiaroscuro, cinematic wide-angle, epic scale, 8k resolution.',
  'Celestial Flora: Floating cherry blossoms in zero-gravity, glowing stardust petals, deep space background, ethereal purple nebulae, soft cinematic glow, astronomical photography style.',
  'Ancient Redwood Temple: Massive moss-covered roots, sun-drenched volumetric fog, ancient stone runes, lush ferns, 8k nature photography, vertical composition, sacred atmosphere.',
  'Arctic Aurora Glass: Transparent ice sculptures on a black sand beach, reflecting green aurora borealis, crystalline textures, long exposure, cold ethereal lighting.',

  // FUTURISTIC & TECH
  'Cyber-Organic Synthesis: Humanoid silhouette composed of glowing fiber optics, transparent glass skin, internal hardware glow, dark-synth aesthetic, ray-traced reflections.',
  'Neon-Tokyo Rain: Rain-drenched asphalt, anamorphic pink and teal lens flares, vertical neon signage, moody cyberpunk atmosphere, 35mm film grain, cinematic street photography.',
  'Retro-NASA Solarpunk: White ceramic spacecraft, gold-leaf solar panels, lush interior vertical gardens, bright clean lighting, 1970s futuristic optimism, Kodak Portra aesthetic.',
  'Glitch-Industrial: Corrupted digital architecture, circuit board patterns, distorted VHS scanlines, harsh flickering LED lights, gritty metallic textures, 90s hardware hacking vibe.',
  'Minimalist Data-Flow: Streaming ribbons of golden light particles, obsidian void, mathematical geometry, elegant motion blur, high-end tech aesthetic, abstract vector art.',
  'Satellite Earth-Core: High-altitude satellite view of swirling turquoise ocean currents and coral reefs, hyper-detailed textures, abstract natural patterns, orbital photography.',

  // ARCHITECTURAL & MINIMALIST
  'Brutalist Desert Minimalism: Monolithic raw concrete slabs, sharp geometric shadows, lone palm tree, harsh desert sun, 120mm medium format film, silent liminal atmosphere.',
  'Zen Glass Pavilion: Transparent architecture over a perfectly still mountain lake, heavy reflections, misty morning, soft blue-hour lighting, minimalist perfection, 8k architectural render.',
  'Lush Mediterranean Brutalism: Raw white stone walls, overflowing vibrant bougainvillea, deep turquoise water, harsh noon sunlight, high-contrast shadows, architectural digest style.',
  'Liminal Mall-Wave: Endless white tiled corridors, soft fluorescent glow, nostalgic 90s aesthetic, dreamy liminal space, pastel vaporwave tones, eerie peacefulness.',
  'Gothic Cathedral Noir: Towering stone arches, intricate stained glass, single beam of moonlight, suspended dust motes, dramatic dark-fantasy atmosphere, low-angle perspective.',
  'Scandinavian Hygge-Minimal: Light oak wood textures, soft linen fabrics, warm fireplace glow, snowy window view, soft-focus, cozy minimalist interior photography.',

  // SURREAL & DREAMLIKE
  'Floating Magritte-Core: Floating green apples and faceless figures in a cloud-filled room, soft day-lit shadows, Belgian surrealism, crisp focus, dream-logic composition.',
  'Liquid Gold Surrealism: A desert where dunes are flowing molten gold, silk-textured sand ripples, chrome-polished sky, high-fashion editorial aesthetic, surreal lighting.',
  'Clockwork Dreamscape: Levitating mechanical gears, brass and ivory textures, sepia-toned clouds, intricate Victorian steampunk, macro details, polished copper reflections.',
  'Underwater Ballroom: Sunken Victorian architecture, schools of glowing fish, swaying silk curtains, shimmering water caustic patterns, ethereal teal atmosphere, submerged dream.',
  'Abstract Clay-Morphism: 3D soft-touch organic shapes, matte pastel textures, satisfying curves, studio lighting, modern UI/UX wallpaper style, high-end 3D render.',
  'Ethereal Origami World: A landscape made entirely of folded iridescent paper, sharp geometric folds, soft backlighting, delicate paper grain, whimsical and intricate.',

  // ARTISTIC & PAINTERLY
  'Impressionist Sunset: Thick oil paint brushstrokes, vibrant orange and violet sky, textured canvas, impasto technique, glowing light, Monet-inspired landscape.',
  'Ukiyo-e Modernism: Traditional Japanese woodblock style combined with modern cityscapes, flat colors, bold outlines, crashing waves, stylized clouds, Hokusai aesthetic.',
  'Renaissance Sci-Fi: Da Vinci style sketches of interstellar engines, aged parchment texture, charcoal and sepia tones, intricate anatomical engineering, vintage manuscript.',
  'Expressionist Chaos: Bold distorted shapes, high-energy brushwork, clashing neon colors, emotional intensity, abstract street-art influence.',
  'Paper-Cut Diorama: Layered depth of field, handcrafted paper silhouettes, back-lit shadows, miniature world aesthetic, vibrant storytelling colors.',
];

const constraints = [
  'Focus on extreme textures like brushed metal, wet silk, or jagged glass.',
  "Use a 'Double Exposure' photographic technique.",
  "Emphasize a 'Top-Down' or 'Extreme Low-Angle' perspective.",
  "Apply a 'Muted Pastel' or 'Monochromatic High-Contrast' color palette.",
];

// Generate image using A4F API
export const generateImage = async (
  prompt: string,
): Promise<WallpaperImage | null> => {
  try {
    const response = await fetch('https://api.a4f.co/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${A4F_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'http://localhost',
      },
      body: JSON.stringify({
        model: 'provider-4/imagen-4',
        prompt: prompt,
        n: 1,
        size: '1024x1792', // 6:19 aspect ratio approximation
      }),
    });

    const data = await response.json();

    if (data.data && data.data[0] && data.data[0].url) {
      const remoteUrl = data.data[0].url;
      // Immediately download the image to local storage to prevent expiration
      const fileUri =
        FileSystem.documentDirectory + `wallpaper_${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(remoteUrl, fileUri);

      const newImage: WallpaperImage = {
        id: Date.now().toString(),
        url: downloadResult.uri, // use local URI instead of remote
        prompt: prompt,
        timestamp: new Date().toISOString(),
      };
      return newImage;
    }

    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

// Generate a creative prompt idea using A4F Chat Completion API
export const generatePromptIdea = async (): Promise<string | null> => {
  try {
    const randomAesthetic =
      aesthetics[Math.floor(Math.random() * aesthetics.length)];
    const randomConstraint =
      constraints[Math.floor(Math.random() * constraints.length)];

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: 'http://localhost',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content: `You are an elite Prompt Engineer for high-end mobile wallpapers. 
              Your specific style for this request is: ${randomAesthetic}. 
              Instruction: ${randomConstraint}
              
              RULES:
              - Generate ONE singular, breathtaking image prompt.
              - Use evocative, sensory language. 
              - Return ONLY the prompt text. No quotes. Under 40 words.`,
            },
            {
              role: 'user',
              content:
                'Generate a stunning, unique wallpaper concept. Surprise me with the theme.',
            },
          ],
          temperature: 1,
        }),
      },
    );

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
    return null;
  } catch (error) {
    console.error('Error generating prompt idea:', error);
    return null;
  }
};

// Save image to device gallery
export const saveToDeviceGallery = async (
  imageUrl: string,
): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync(false, [
      'photo',
    ]);
    if (status !== 'granted') {
      console.error('Media library permission not granted');
      return false;
    }

    // Since imageUrl is now heavily expected to be a local file URI from our generation,
    // we can pass it directly to MediaLibrary. If it ever is a remote URL, we handle that too.
    if (imageUrl.startsWith('file://')) {
      await MediaLibrary.createAssetAsync(imageUrl);
      return true;
    } else {
      const fileUri =
        FileSystem.documentDirectory + `wallpaper_saved_${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.createAssetAsync(downloadResult.uri);
      return true;
    }
  } catch (error) {
    console.error('Error saving to gallery:', error);
    return false;
  }
};
