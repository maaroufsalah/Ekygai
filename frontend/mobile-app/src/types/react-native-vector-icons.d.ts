declare module 'react-native-vector-icons/MaterialIcons' {
    import { IconProps } from 'react-native-vector-icons/Icon';
    import React from 'react';
    
    export default class MaterialIcons extends React.Component<IconProps> {
      static getImageSource(
        name: string,
        size?: number,
        color?: string,
      ): Promise<any>;
      static getRawGlyphMap(): { [name: string]: number };
      static loadFont(
        file?: string,
      ): Promise<void>;
      static hasIcon(name: string): boolean;
    }
  }