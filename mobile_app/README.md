# البيت السوداني - Mobile App

## Overview
Native mobile application for البيت السوداني (Sudanese Marketplace) built with React Native and Expo.

## Features
- 🔐 User authentication (Login/Register)
- 🏠 Home screen with featured products and stores
- 🛍️ Marketplace with advanced filtering and search
- 🏪 Store creation and management
- 📦 Product creation and management
- 👤 User profile management
- 🇸🇩 Arabic RTL support
- 🎨 Sudanese cultural design elements

## Technology Stack
- **React Native**: Cross-platform mobile development
- **Expo**: Development and deployment platform
- **React Navigation**: Navigation system
- **React Native Paper**: UI components
- **TypeScript**: Type safety
- **Axios**: HTTP client for API calls
- **AsyncStorage**: Local data persistence

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Install dependencies:
```bash
cd mobile
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Project Structure
```
mobile/
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/              # Main app screens
│   ├── navigation/           # Navigation configuration
│   ├── services/             # API services
│   ├── context/              # React Context providers
│   ├── theme/                # Theme and styling
│   └── utils/                # Utility functions
├── assets/                   # Images and static assets
├── App.tsx                   # Main app component
└── app.json                  # Expo configuration
```

## Screens

### Main Screens
- **LoginScreen**: User authentication
- **HomeScreen**: Dashboard with featured content
- **MarketplaceScreen**: Product and store browsing
- **UserProfileScreen**: User profile management
- **CreateStoreScreen**: Store creation form
- **CreateProductScreen**: Product creation form
- **StoreDetailsScreen**: Individual store view

### Features
- **RTL Support**: Full Arabic right-to-left layout
- **Sudanese Design**: Cultural color scheme (Blue, Red, Gold, Sand)
- **Responsive Design**: Works on phones and tablets
- **Offline Support**: Local data caching with AsyncStorage
- **Search & Filter**: Advanced product and store filtering
- **Real-time Updates**: Live data synchronization

## API Integration

The app integrates with the backend REST API:
- **Authentication**: JWT-based login/register
- **CRUD Operations**: Full create, read, update, delete for all entities
- **Real-time Data**: Automatic data refresh and synchronization
- **Error Handling**: Comprehensive error messages and validation

## Styling & Theme

### Colors
- **Primary**: #1B4F72 (Deep Blue)
- **Secondary**: #E74C3C (Red)
- **Accent**: #F1C40F (Gold)
- **Background**: #F8F9FA (Light Gray)

### Typography
- **Default**: System font with Arabic support
- **RTL**: Right-to-left text direction
- **Responsive**: Scales with device text size

## Development

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add to navigation in `App.tsx`
3. Update TypeScript types if needed

### Adding New API Endpoints
1. Update `src/services/api.ts`
2. Add TypeScript interfaces
3. Update authentication if needed

### Customizing Theme
1. Edit `src/theme/colors.ts`
2. Update component styles
3. Test in both light and dark modes

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

### Expo Publish
```bash
expo publish
```

## Testing

### Running Tests
```bash
npm test
```

### Manual Testing
- Test on both iOS and Android
- Verify RTL layout works correctly
- Test offline functionality
- Validate Arabic text rendering

## Deployment

### Expo Go
- Install Expo Go app on device
- Scan QR code from `expo start`

### App Stores
- Follow Expo documentation for app store submission
- Configure app icons and splash screens
- Test on real devices before submission

## Configuration

### Environment Variables
Create `.env` file in mobile directory:
```
API_BASE_URL=https://your-backend-url.com/api
```

### App Configuration
Update `app.json` for:
- App name and description
- Icons and splash screens
- Platform-specific settings
- Permissions and capabilities

## Support

For issues or questions:
1. Check the troubleshooting guide
2. Review React Native documentation
3. Check Expo documentation
4. Submit an issue on the project repository

## License
This project is proprietary software for البيت السوداني marketplace.