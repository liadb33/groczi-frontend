/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Define the brand colors
// const brandColors = {
//   primary: '#5382A6',
//   secondary: '#08263E',
//   gradient: {
//     start: '#5382A6',
//     end: '#08263E',
//   },
// };

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  // brandColors, // Removed brandColors from export
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Removed brandColors from light theme
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Removed brandColors from dark theme
  },
};
