declare module 'react-native-manage-wallpaper' {
  export const TYPE: {
    HOME: number;
    LOCK: number;
    BOTH: number;
  };

  interface WallpaperResponse {
    status: 'success' | 'error';
    msg: string;
    url: string;
  }

  export default class ManageWallpaper {
    static setWallpaper(
      source: { uri: string },
      callback: (res: WallpaperResponse) => void,
      type: number,
    ): void;
  }
}
