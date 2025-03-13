// RFValue.ts - Create this file in your Utils/Responsive folder
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions (standard iPhone 11 size as reference)
const baseWidth = 375;
const baseHeight = 812;

// Calculate based on screen dimension ratio
const widthRatio = width / baseWidth;
const heightRatio = height / baseHeight;

// Use the width ratio for scaling font size
export const RFValue = (fontSize: number, standardScreenHeight = 812) => {
  // Use width-based scaling for a more consistent experience
  const scaleFactor = width / baseWidth;
  
  // Scale the font size
  const newSize = fontSize * scaleFactor;
  
  // Round to nearest pixel for sharper text rendering
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// For percentage-based width calculations
export const widthPercentageToDP = (widthPercent: number | string) => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

// For percentage-based height calculations
export const heightPercentageToDP = (heightPercent: number | string) => {
  const screenHeight = Dimensions.get('window').height;
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

// Listen for dimension changes (e.g., orientation changes)
Dimensions.addEventListener('change', (dimensions) => {
  // Update dimensions if needed
  const { width, height } = dimensions.window;
});

export default RFValue;