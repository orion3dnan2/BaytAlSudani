import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1B4F72', // Deep Blue (Sudanese heritage)
    accent: '#E74C3C', // Red (Sudanese flag)
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2C3E50',
    gold: '#F1C40F', // Gold accent
    sand: '#D4AF37', // Sand color
    disabled: '#BDC3C7',
    placeholder: '#95A5A6',
    backdrop: 'rgba(0,0,0,0.5)',
  },
};

export const sudaneseColors = {
  blue: '#1B4F72',
  red: '#E74C3C',
  white: '#FFFFFF',
  gold: '#F1C40F',
  sand: '#D4AF37',
  darkGreen: '#27AE60',
  lightGreen: '#2ECC71',
};