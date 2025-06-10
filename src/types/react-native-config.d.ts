declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAPS_API_KEY?: string;
  }

  export const Config: NativeConfig;
  // eslint-disable-next-line no-restricted-syntax
  export default Config;
}
