import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Animated module
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo Router with proper store handling
jest.mock('expo-router', () => {
  // Create a mock store that matches expo-router's expectations
  const mockStore = {
    routeNode: null,
    rootState: null,
    linking: null,
    isReady: () => true,
    navigationRef: { current: null },
    routeInfo: null,
  };

  return {
    useRouter: () => ({
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
      canGoBack: jest.fn(() => true),
      navigate: jest.fn(),
    }),
    usePathname: jest.fn(() => '/test-path'),
    useLocalSearchParams: jest.fn(() => ({})),
    useSegments: jest.fn(() => []),
    useGlobalSearchParams: jest.fn(() => ({})),
    router: {
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
      navigate: jest.fn(),
      canGoBack: jest.fn(() => true),
    },
    // Mock router store
    store: mockStore,
    // Mock navigation state
    NavigationContainer: ({ children }: any) => children,
  };
});

// Mock Expo Font with proper loadedNativeFonts handling
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoadingAsync: jest.fn(() => Promise.resolve(false)),
}));

// Mock the native font memory module that Vector Icons uses
jest.mock('expo-font/src/memory', () => {
  // Create a mock object that has both Set and Array methods
  const loadedNativeFonts: any = [];
  // Add Set-like methods that Vector Icons might use
  loadedNativeFonts.add = jest.fn();
  loadedNativeFonts.has = jest.fn(() => true);
  loadedNativeFonts.delete = jest.fn();
  loadedNativeFonts.clear = jest.fn();
  // forEach is already available on arrays
  
  return {
    loadedNativeFonts,
  };
});

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(() => Promise.resolve()),
    })),
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20,
    deviceId: 'test-device',
    platform: {
      ios: false,
      android: true,
    },
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 32.0853,
      longitude: 34.7818,
    },
  })),
  reverseGeocodeAsync: jest.fn(() => Promise.resolve([{
    street: 'Test Street',
    city: 'Test City',
    country: 'Test Country',
  }])),
}));

jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock your stores - will be overridden in individual tests
jest.mock('@/store', () => ({
  useCartStore: jest.fn(),
  useLocationStore: jest.fn(),
  useGroceryStore: jest.fn(),
  useOptimizationStore: jest.fn(),
  usePromotionsSummaryStore: jest.fn(),
  useSettingsStore: jest.fn(),
  useCategoryStore: jest.fn(),
  useBookmarkStore: jest.fn(),
  useListStore: jest.fn(),
  useListDetailsStore: jest.fn(),
}));

// Mock React Native Vector Icons with better font handling
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  
  // Create a mock icon component that doesn't check fonts
  const MockIcon = (props: any) => {
    return require('react-native').createElement(Text, {
      ...props,
      children: props.name || 'icon',
      testID: props.testID,
    });
  };

  return {
    Feather: MockIcon,
    MaterialCommunityIcons: MockIcon,
    Ionicons: MockIcon,
    AntDesign: MockIcon,
    Entypo: MockIcon,
    EvilIcons: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    Foundation: MockIcon,
    MaterialIcons: MockIcon,
    Octicons: MockIcon,
    SimpleLineIcons: MockIcon,
    Zocial: MockIcon,
  };
});

// Mock lucide-react-native which is also used
jest.mock('lucide-react-native', () => {
  const { Text } = require('react-native');
  
  const MockLucideIcon = (props: any) => {
    return require('react-native').createElement(Text, {
      ...props,
      children: props.name || 'lucide-icon',
      testID: props.testID,
    });
  };

  return {
    Search: MockLucideIcon,
    Plus: MockLucideIcon,
    Minus: MockLucideIcon,
    ShoppingCart: MockLucideIcon,
    Heart: MockLucideIcon,
    MapPin: MockLucideIcon,
    Camera: MockLucideIcon,
    BarChart3: MockLucideIcon,
    Settings: MockLucideIcon,
    List: MockLucideIcon,
    Home: MockLucideIcon,
    User: MockLucideIcon,
    Filter: MockLucideIcon,
    X: MockLucideIcon,
    Check: MockLucideIcon,
    ChevronDown: MockLucideIcon,
    ChevronUp: MockLucideIcon,
    ChevronLeft: MockLucideIcon,
    ChevronRight: MockLucideIcon,
    Star: MockLucideIcon,
    Trash2: MockLucideIcon,
    Edit: MockLucideIcon,
    Eye: MockLucideIcon,
    EyeOff: MockLucideIcon,
  };
});

// Mock React Native Maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock React Native Swipe List View
jest.mock('react-native-swipe-list-view', () => {
  const { FlatList } = require('react-native');
  return {
    SwipeListView: FlatList,
    SwipeRow: require('react-native').View,
  };
});

// Mock React Native Modal
jest.mock('react-native-modal', () => {
  const { Modal } = require('react-native');
  return Modal;
});

// Global fetch mock
global.fetch = jest.fn();

// Mock console.warn for cleaner test output
global.console.warn = jest.fn();

// Setup for RTL testing
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.I18nManager = {
    isRTL: true,
    forceRTL: jest.fn(),
    allowRTL: jest.fn(),
  };
  return RN;
}); 