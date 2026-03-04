import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

const STORAGE_KEY = '@wallpaper_gallery';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const POLLEN_API_KEY = process.env.EXPO_PUBLIC_POLLEN_API;

// ─── Pollinations AI Configuration ──────────────────────────────────────────

const POLLINATIONS_IMAGE_BASE = 'https://gen.pollinations.ai';
const POLLINATIONS_MODEL = 'flux'; // Fast high-quality default

// ─── Image Styles ───────────────────────────────────────────────────────────

export interface ImageStyle {
  id: string;
  label: string;
  prompt: string;
}

export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: 'none',
    label: 'None',
    prompt: '',
  },
  {
    id: 'photorealistic',
    label: 'Photorealistic',
    prompt:
      'photorealistic, ultra-detailed, sharp focus, 8K UHD, DSLR quality, natural lighting, professional photography',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    prompt:
      'cinematic lighting, dramatic atmosphere, film grain, anamorphic lens flare, moody color grading, movie poster quality',
  },
  {
    id: 'anime',
    label: 'Anime',
    prompt:
      'beautiful anime art style, studio ghibli inspired, vibrant colors, detailed illustration, high quality anime wallpaper',
  },
  {
    id: 'abstract',
    label: 'Abstract',
    prompt:
      'abstract art, vibrant color swirls, geometric patterns, fluid dynamics, mesmerizing fractal, high contrast',
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    prompt:
      'minimalist design, clean lines, negative space, simple composition, elegant, subtle color palette, modern aesthetic',
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    prompt:
      'epic fantasy art, magical atmosphere, enchanted, mystical lighting, otherworldly landscape, highly detailed digital painting',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    prompt:
      'cyberpunk aesthetic, neon lights, futuristic cityscape, rain-soaked streets, holographic signs, synthwave colors, dystopian',
  },
  {
    id: 'nature',
    label: 'Nature',
    prompt:
      'breathtaking nature photography, golden hour, pristine landscape, vivid colors, national geographic quality, serene wilderness',
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    prompt:
      'watercolor painting, soft washes, delicate brushstrokes, artistic, ethereal, dreamy atmosphere, fine art quality',
  },
  {
    id: '3d-render',
    label: '3D Render',
    prompt:
      '3D render, octane render, ray tracing, volumetric lighting, subsurface scattering, ultra-realistic materials, blender quality',
  },
];

// ─── Types ──────────────────────────────────────────────────────────────────

export interface WallpaperImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
}

// ─── Gallery Persistence ────────────────────────────────────────────────────

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

export const saveGallery = async (gallery: WallpaperImage[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
  } catch (error) {
    console.error('Error saving gallery:', error);
  }
};

// ─── Pollinations AI Image Generation ───────────────────────────────────────

function buildPollinationsUrl(prompt: string, styleId: string): string {
  // Find the style and append its modifiers to the prompt
  const style = IMAGE_STYLES.find((s) => s.id === styleId);
  const fullPrompt =
    style && style.prompt ? `${prompt}, ${style.prompt}` : prompt;

  const encoded = encodeURIComponent(fullPrompt);
  let url = `${POLLINATIONS_IMAGE_BASE}/image/${encoded}?width=1080&height=1920&nologo=true&model=${POLLINATIONS_MODEL}`;

  // Add seed for uniqueness
  const seed = Math.floor(Math.random() * 999999);
  url += `&seed=${seed}`;

  // Add API key if available
  if (POLLEN_API_KEY) {
    url += `&key=${POLLEN_API_KEY}`;
  }

  return url;
}

export const generateImage = async (
  prompt: string,
  styleId: string = 'none',
): Promise<WallpaperImage | null> => {
  try {
    const imageUrl = buildPollinationsUrl(prompt, styleId);

    // The Pollinations URL itself returns image bytes — download directly
    const fileUri =
      FileSystem.documentDirectory + `wallpaper_${Date.now()}.jpg`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (downloadResult.status !== 200) {
      throw new Error(
        `Image generation failed with status ${downloadResult.status}`,
      );
    }

    const newImage: WallpaperImage = {
      id: Date.now().toString(),
      url: downloadResult.uri,
      prompt: prompt,
      timestamp: new Date().toISOString(),
    };

    return newImage;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

// ─── Prompt Idea Generation (Groq) ──────────────────────────────────────────

const aesthetics = [
  'Bioluminescent Mycology: Translucent neon fungi, glowing mycelium networks, damp dark forest floor, macro bokeh, fiber-optic spores, ethereal deep-blue ambiance, cinematic depth of field.',
  'Iridescent Petal-Core: Macro photography of a crystalline flower, liquid mercury dewdrops, prismatic light refraction, soft pastel gradients, hyper-realistic silk textures, f/1.8 aperture.',
  'Frozen Volcanic Earth: Jagged obsidian rock formations meeting glowing molten lava, rising volcanic steam, high-contrast chiaroscuro, cinematic wide-angle, epic scale, 8k resolution.',
  'Celestial Flora: Floating cherry blossoms in zero-gravity, glowing stardust petals, deep space background, ethereal purple nebulae, soft cinematic glow, astronomical photography style.',
  'Ancient Redwood Temple: Massive moss-covered roots, sun-drenched volumetric fog, ancient stone runes, lush ferns, 8k nature photography, vertical composition, sacred atmosphere.',
  'Arctic Aurora Glass: Transparent ice sculptures on a black sand beach, reflecting green aurora borealis, crystalline textures, long exposure, cold ethereal lighting.',
  'Cyber-Organic Synthesis: Humanoid silhouette composed of glowing fiber optics, transparent glass skin, internal hardware glow, dark-synth aesthetic, ray-traced reflections.',
  'Neon-Tokyo Rain: Rain-drenched asphalt, anamorphic pink and teal lens flares, vertical neon signage, moody cyberpunk atmosphere, 35mm film grain, cinematic street photography.',
  'Retro-NASA Solarpunk: White ceramic spacecraft, gold-leaf solar panels, lush interior vertical gardens, bright clean lighting, 1970s futuristic optimism, Kodak Portra aesthetic.',
  'Glitch-Industrial: Corrupted digital architecture, circuit board patterns, distorted VHS scanlines, harsh flickering LED lights, gritty metallic textures, 90s hardware hacking vibe.',
  'Minimalist Data-Flow: Streaming ribbons of golden light particles, obsidian void, mathematical geometry, elegant motion blur, high-end tech aesthetic, abstract vector art.',
  'Brutalist Desert Minimalism: Monolithic raw concrete slabs, sharp geometric shadows, lone palm tree, harsh desert sun, 120mm medium format film, silent liminal atmosphere.',
  'Zen Glass Pavilion: Transparent architecture over a perfectly still mountain lake, heavy reflections, misty morning, soft blue-hour lighting, minimalist perfection, 8k architectural render.',
  'Floating Magritte-Core: Floating green apples and faceless figures in a cloud-filled room, soft day-lit shadows, Belgian surrealism, crisp focus, dream-logic composition.',
  'Liquid Gold Surrealism: A desert where dunes are flowing molten gold, silk-textured sand ripples, chrome-polished sky, high-fashion editorial aesthetic, surreal lighting.',
  'Underwater Ballroom: Sunken Victorian architecture, schools of glowing fish, swaying silk curtains, shimmering water caustic patterns, ethereal teal atmosphere, submerged dream.',
  'Abstract Clay-Morphism: 3D soft-touch organic shapes, matte pastel textures, satisfying curves, studio lighting, modern UI/UX wallpaper style, high-end 3D render.',
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

// ─── Save to Device Gallery ─────────────────────────────────────────────────

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
