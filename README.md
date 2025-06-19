# Groczi Frontend 🛒

**A sophisticated React Native mobile application for intelligent grocery shopping optimization**

[![React Native](https://img.shields.io/badge/React%20Native-0.76.9-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~52.0.42-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.3-orange.svg)](https://github.com/pmndrs/zustand)

---

## 📋 Table of Contents

- [📱 App Screenshots](#-app-screenshots)
- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🗄️ State Management](#️-state-management)
- [🧭 Navigation System](#-navigation-system)
- [🎨 Component Library](#-component-library)
- [🔌 API Integration](#-api-integration)
- [🚀 Setup & Installation](#-setup--installation)
- [🔄 Development Workflow](#-development-workflow)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🌐 Internationalization](#-internationalization)
- [📱 Core Screen Functionality](#-core-screen-functionality)
- [🛒 Shopping Features](#-shopping-features)
- [🎨 UI/UX Excellence](#-uiux-excellence)
- [🔧 Advanced Features](#-advanced-features)

---

## 🎯 Overview

Groczi is a cutting-edge React Native mobile application that revolutionizes grocery shopping through intelligent optimization algorithms. Built as a comprehensive frontend for a grocery comparison and optimization platform, it empowers users to make informed shopping decisions by comparing prices across multiple stores, optimizing shopping routes, and managing personalized shopping lists.

The application leverages advanced location-based services, real-time price comparison, and sophisticated optimization algorithms to deliver a seamless shopping experience that saves both time and money.

---

## 📱 App Screenshots

<div align="center">

### 🏠 Main Navigation & Core Features

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>Home Screen</h4>
      <img src="https://github.com/user-attachments/assets/f310cb73-3918-447e-acdc-03c1e5451684" alt="Home Screen" width="300px">
    </td>
    <td align="center" width="50%">
      <h4>Shopping Cart</h4>
      <img src="https://github.com/user-attachments/assets/d534e793-b7e6-40aa-a384-721646ddf99d" alt="Shopping Cart" width="300px">
    </td>
  </tr>
</table>

### 🔍 Search & Discovery Features

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>Search Filters</h4>
      <img src="https://github.com/user-attachments/assets/156e237d-5555-42dd-a042-eece90ba0c18" alt="Search Filters" width="300px">
    </td>
    <td align="center" width="50%">
      <h4>Promotions</h4>
      <img src="https://github.com/user-attachments/assets/7fee7ca3-141a-4fed-8fcf-f24c404b8f0a" alt="Promotions Popup" width="300px">
    </td>
  </tr>
</table>

### 📋 List Management & Bookmarks

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>My Lists</h4>
      <img src="https://github.com/user-attachments/assets/d89a955f-508c-4e82-a2b9-e2e80af1da5a" alt="My Lists Screen" width="300px">
    </td>
    <td align="center" width="50%">
      <h4>My Groceries</h4>
      <img src="https://github.com/user-attachments/assets/b063069b-fac9-4efa-87d5-c1494f6c28ca" alt="My Groceries Screen" width="300px">
    </td>
  </tr>
</table>

### 📝 List Operations

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>List Details</h4>
      <img src="https://github.com/user-attachments/assets/4f04c5a1-5ff8-4b10-8c71-6e60fb4ecffa" alt="List Info Screen" width="300px">
    </td>
    <td align="center" width="50%">
      <h4>Add New List</h4>
      <img src="https://github.com/user-attachments/assets/0e295a5f-570d-4802-aff6-a743721db2b7" alt="Add List Popup" width="300px">
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h4>Add to List</h4>
      <img src="https://github.com/user-attachments/assets/b3d9b05c-08bb-41e8-9d78-72b1488fbbd8" alt="Add to List Popup" width="300px">
    </td>
  </tr>
</table>

### 🛍️ Product Discovery & Optimization

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>Product Information</h4>
      <img src="https://github.com/user-attachments/assets/029b8276-6bde-4892-a4b4-dd9f4fa51b19" alt="Product Info Screen" width="300px">
    </td>
    <td align="center" width="50%">
      <h4>Price Comparison</h4>
      <img src="https://github.com/user-attachments/assets/31322aed-052b-4944-8d70-3020fc450fb7" alt="Compare Prices Screen" width="300px">
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h4>Price History Analytics</h4>
      <img src="https://github.com/user-attachments/assets/2cac0e6d-f08e-4013-91d4-43a7d943957d" alt="Price History Screen" width="300px">
    </td>
  </tr>
</table>

### 📍 Location Services

<table align="center">
  <tr>
    <td align="center" width="50%">
      <h4>Location Panel</h4>
      <img src="https://github.com/user-attachments/assets/c5aa6866-e378-4817-a918-cab0b53e3b72" alt="Location Floating Panel" width="300px">
    </td>
    <td align="center" width="50%">
      <h4>Online Stores</h4>
      <img src="https://github.com/user-attachments/assets/21f0aa31-ad05-486c-bca3-03b7629a98f0" alt="Online Stores Popup" width="300px">
    </td>
  </tr>
</table>

### ⚙️ Settings & Configuration

<table align="center">
  <tr>
    <td align="center" colspan="2">
      <h4>Settings & Preferences</h4>
      <img src="https://github.com/user-attachments/assets/71457cd8-5766-45b5-98ff-d52281abf3a2" alt="Settings Screen" width="300px">
    </td>
  </tr>
</table>

</div>

---

## ✨ Key Features

### 🔍 **Intelligent Product Discovery**
- **Advanced Search Engine**: Real-time autocomplete with semantic search capabilities
- **Barcode Scanner**: Instant product identification using device camera
- **Category-Based Browsing**: Organized product exploration with custom iconography
- **Smart Filtering**: Multi-dimensional filtering by price, category, and brand

### 🛒 **Shopping Cart Management**
- **Real-time Synchronization**: Cloud-synced cart across devices
- **Quantity Management**: Intuitive increment/decrement with haptic feedback
- **Price Tracking**: Live price updates and total calculations
- **Swipe Interactions**: Gesture-based item removal and editing

### 📋 **List Management System**
- **Multiple Lists**: Create and manage unlimited shopping lists
- **Collaborative Features**: Share lists with family members
- **Price Estimation**: Automatic cost calculation for entire lists
- **Smart Suggestions**: AI-powered product recommendations

### 🎯 **Advanced Optimization Engine**
- **Single-Store Optimization**: Find the best store for your entire list
- **Multi-Store Optimization**: Optimal route planning across multiple stores
- **Cost vs. Distance Preferences**: Customizable optimization parameters
- **Real-time Route Planning**: Integration with mapping services

### 📍 **Location-Aware Services**
- **GPS Integration**: Automatic location detection and store proximity
- **Store Mapping**: Interactive maps with store locations and details
- **Promotion Discovery**: Location-based deals and discounts
- **Navigation Integration**: Seamless handoff to navigation apps

### 💾 **Personalization Features**
- **Bookmark System**: Save favorite products for quick access
- **Shopping History**: Track past purchases and preferences
- **Custom Preferences**: Personalized optimization settings
- **Smart Notifications**: Contextual alerts and reminders

---

## 🏗️ Architecture

### **Design Patterns**
- **Component-Based Architecture**: Modular, reusable UI components
- **State Management**: Centralized Zustand stores with domain separation
- **File-Based Routing**: Expo Router for type-safe navigation
- **Layered Architecture**: Clear separation of concerns (UI, Business Logic, Data)

### **Core Architectural Principles**
- **Separation of Concerns**: Clean boundaries between UI, state, and API layers
- **Scalability**: Modular structure supporting feature expansion
- **Performance**: Optimized rendering with lazy loading and memoization
- **Maintainability**: TypeScript-first approach with comprehensive type definitions

### **Data Flow Architecture**
```
User Interaction → Component → Zustand Store → API Layer → Backend
                                    ↓
                              Local State Update
                                    ↓
                              UI Re-render
```

---

## 🛠️ Technology Stack

### **Core Framework**
- **React Native 0.76.9**: Cross-platform mobile development
- **Expo ~52.0.42**: Development platform and build tools
- **TypeScript 5.3.3**: Type-safe JavaScript development

### **Navigation & Routing**
- **Expo Router 4.0.20**: File-based routing system
- **React Navigation 7.0.14**: Navigation primitives

### **State Management**
- **Zustand 5.0.3**: Lightweight state management
- **React Native Async Storage**: Persistent local storage

### **UI & Styling**
- **NativeWind 4.1.23**: Tailwind CSS for React Native
- **React Native Paper 5.13.1**: Material Design components
- **Lucide React Native**: Modern icon library
- **React Native Reanimated 3.16.1**: High-performance animations

### **Maps & Location**
- **React Native Maps 1.18.0**: Interactive mapping
- **Expo Location 18.0.10**: GPS and location services
- **React Native Google Places**: Address autocomplete

### **Camera & Media**
- **Expo Camera 16.0.18**: Barcode scanning capabilities
- **Expo Image**: Optimized image handling

### **Development Tools**
- **ESLint**: Code linting and formatting
- **Jest**: Unit testing framework
- **TypeScript**: Static type checking

---

## 📁 Project Structure

```
Frontend/
├── app/                          # Expo Router pages
│   ├── (root)/                   # Main application routes
│   │   ├── (tabs)/              # Tab-based navigation
│   │   │   ├── index.tsx        # Home screen
│   │   │   ├── cart.tsx         # Shopping cart
│   │   │   ├── my-groceries.tsx # Bookmarked items
│   │   │   ├── my-lists.tsx     # Shopping lists
│   │   │   ├── location.tsx     # Location selection
│   │   │   └── listInfo.tsx     # List details
│   │   ├── groceryResults.tsx   # Search results
│   │   ├── groceryInfo.tsx      # Product details
│   │   ├── comparePrices.tsx    # Optimization engine
│   │   ├── barcodeScanner.tsx   # Camera scanner
│   │   └── settings.tsx         # User preferences
│   ├── _layout.tsx              # Root layout with providers
│   └── +not-found.tsx           # 404 error page
├── components/                   # Reusable UI components
│   ├── ui/                      # Core UI components
│   │   ├── FloatingEyeMenu.tsx  # Animated FAB menu
│   │   ├── *Shimmer.tsx         # Loading skeletons
│   │   └── IconSymbol.ios.tsx   # Platform-specific icons
│   ├── grocery/                 # Product-related components
│   ├── comparePrices/           # Optimization UI
│   ├── promotions/              # Deals and offers
│   ├── header/                  # Navigation headers
│   ├── lists/                   # List management
│   └── filter/                  # Search filtering
├── store/                       # Zustand state management
│   └── index.ts                 # Centralized store definitions
├── types/                       # TypeScript definitions
│   └── types.d.ts              # Global type declarations
├── utils/                       # Utility functions
│   └── api/                     # API integration layer
├── constants/                   # App constants
├── hooks/                       # Custom React hooks
└── assets/                      # Static assets
```

---

## 🗄️ State Management

The application uses **Zustand** for state management, organized into domain-specific stores:

### **Location Store** (`useLocationStore`)
Manages user and destination coordinates, store selection, and address information.

```typescript
interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  storeId: string | null;
  chainId: string | null;
  subChainId: string | null;
}
```

### **Cart Store** (`useCartStore`)
Handles shopping cart operations with real-time API synchronization.

```typescript
interface CartStore {
  cartItems: CartItemType[];
  isLoading: boolean;
  loadCart: () => Promise<void>;
  addToCart: (itemCode: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  incrementQuantity: (cartItemId: string) => Promise<void>;
  decrementQuantity: (cartItemId: string) => Promise<void>;
}
```

### **Optimization Store** (`useOptimizationStore`)
Powers the core optimization engine with single and multi-store algorithms.

```typescript
interface OptimizationStore {
  groceries: CustomOptimizationItem[];
  singleStoreResult: RankedStoresOptimizationResult | null;
  multiStoreResult: TopMultiStoreSolutionsResult | null;
  runSingleStoreOptimization: (params: OptimizeSingleStoreListRequestBody) => Promise<void>;
  runMultiStoreOptimization: (params: OptimizeMultiStoreListRequestBody) => Promise<void>;
}
```

### **Additional Stores**
- **Bookmark Store**: Manages saved/favorite products
- **List Store**: Handles shopping list CRUD operations
- **Grocery Store**: Product search and details
- **Promotions Store**: Location-based deals and discounts
- **Category Store**: Product categorization and filtering
- **Settings Store**: User preferences and optimization parameters

---

## 🧭 Navigation System

### **File-Based Routing with Expo Router**
The app uses Expo Router's file-based routing system for type-safe navigation:

```
app/
├── _layout.tsx                   # Root layout with providers
├── (root)/                       # Main app group
│   ├── _layout.tsx              # Stack navigator
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home tab
│   │   ├── cart.tsx             # Cart tab
│   │   ├── my-groceries.tsx     # Bookmarks tab
│   │   ├── my-lists.tsx         # Lists tab
│   │   ├── location.tsx         # Hidden location screen
│   │   └── listInfo.tsx         # Hidden list details
│   ├── groceryResults.tsx       # Search results
│   ├── groceryInfo.tsx          # Product details
│   ├── comparePrices.tsx        # Optimization screen
│   ├── barcodeScanner.tsx       # Camera scanner
│   └── settings.tsx             # Settings screen
```

### **Navigation Features**
- **Type-Safe Routing**: Full TypeScript support for route parameters
- **Deep Linking**: URL-based navigation support
- **Tab Navigation**: Bottom tab bar with haptic feedback
- **Stack Navigation**: Hierarchical screen management
- **Modal Presentation**: Overlay screens for focused interactions

---

## 🎨 Component Library

### **UI Components**

#### **Shimmer Loading System**
Sophisticated loading states with skeleton screens:
- `GroceryResultCardShimmer`: Product grid loading
- `CartItemShimmer`: Cart item loading
- `ListItemShimmer`: List item loading
- `ShimmerContainer`: Reusable shimmer wrapper

#### **FloatingEyeMenu**
Advanced animated floating action button with spring animations:
```typescript
interface FloatingEyeMenuProps {
  onHeartPress?: () => void;
  onPlusPress?: () => void;
  onStarPress?: () => void;
  containerClassName?: string;
}
```

#### **Platform-Specific Components**
- `IconSymbol.ios.tsx`: SF Symbols integration for iOS
- `TabBarBackground.ios.tsx`: Native blur effects

### **Feature Components**

#### **Grocery Components**
- `GroceryAutocompleteInput`: Smart search with autocomplete
- `GroceryResultCard`: Product display with actions
- `CategoryList`: Organized product browsing

#### **Optimization Components**
- `SingleStoreItemCard`: Store comparison display
- `MultiStoreSolutionItem`: Multi-store route visualization
- `OptimizationTypeDropdown`: Algorithm selection

#### **Interactive Components**
- `SwipeDeleteItem`: Gesture-based item removal
- `ThreeStatesSlider`: Multi-state preference selector
- `CustomRTLToast`: Right-to-left toast notifications

---

## 🔌 API Integration

### **API Layer Architecture**
Organized by domain with consistent patterns:

```
utils/api/
├── config.ts                    # API configuration
├── index.ts                     # Centralized exports
├── groceries.ts                 # Product operations
├── cart.ts                      # Cart management
├── lists.ts                     # List operations
├── bookmarks.ts                 # Bookmark management
├── promotions.ts                # Deals and offers
├── optimization.ts              # Route optimization
├── categories.ts                # Product categories
└── stores.ts                    # Store information
```

### **API Features**
- **Centralized Configuration**: Environment-based API URLs
- **Type-Safe Requests**: Full TypeScript integration
- **Error Handling**: Consistent error management
- **Request/Response Mapping**: Data transformation utilities
- **Caching Strategy**: Optimized data fetching

### **Key API Endpoints**
- **Product Search**: `/groceries/search`
- **Optimization**: `/optimization/single-store`, `/optimization/multi-store`
- **Cart Operations**: `/cart/add`, `/cart/update`, `/cart/remove`
- **Location Services**: `/stores/nearby`, `/promotions/by-location`

---

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio
- Physical device for testing (recommended)

### **Installation Steps**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=your_backend_api_url
   ```

4. **Start Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on Device/Simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

### **Development Setup**
- **Code Editor**: VS Code with React Native extensions
- **Debugging**: Flipper or React Native Debugger
- **Testing**: Jest for unit tests
- **Linting**: ESLint with React Native rules

---

## 🔄 Development Workflow

### **Code Organization**
- **Component Structure**: One component per file with co-located types
- **Naming Conventions**: PascalCase for components, camelCase for functions
- **Import Organization**: Absolute imports using `@/` alias
- **Type Definitions**: Centralized in `types/types.d.ts`

### **State Management Patterns**
- **Store Separation**: Domain-specific stores for better organization
- **Async Operations**: Consistent async/await patterns
- **Error Handling**: Centralized error management
- **Loading States**: Unified loading indicators

### **Performance Best Practices**
- **Lazy Loading**: Dynamic imports for large components
- **Memoization**: React.memo and useMemo for expensive operations
- **Image Optimization**: Expo Image with caching
- **List Virtualization**: FlatList for large datasets

---

## ⚡ Performance Optimizations

### **Rendering Optimizations**
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive calculations
- **FlatList**: Virtualized lists for large datasets
- **Image Caching**: Optimized image loading and caching

### **State Management Optimizations**
- **Selective Subscriptions**: Subscribe only to needed state slices
- **Debounced Updates**: Prevent excessive API calls
- **Optimistic Updates**: Immediate UI feedback

### **Bundle Optimizations**
- **Code Splitting**: Dynamic imports for large features
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Compressed images and fonts

---

## 🌐 Internationalization

### **RTL Support**
The application is built with comprehensive Right-to-Left (RTL) support:

- **Layout Direction**: Automatic RTL layout adaptation
- **Text Alignment**: Proper text direction handling
- **Icon Mirroring**: Directional icons flip appropriately
- **Navigation**: RTL-aware navigation patterns

### **Localization Features**
- **Hebrew Interface**: Native Hebrew text throughout
- **Cultural Adaptation**: Local shopping patterns and preferences
- **Date/Time Formatting**: Localized formatting
- **Currency Display**: Local currency formatting

---

## 📱 Core Screen Functionality

### **Home Screen** (`index.tsx`)
The central hub featuring:
- **Location-aware dashboard** with automatic GPS detection
- **Smart search** with autocomplete and voice input
- **Category browsing** with custom iconography
- **Promotion discovery** based on user location
- **Quick actions** for barcode scanning and settings

### **Optimization Engine** (`comparePrices.tsx`)
Advanced shopping optimization featuring:
- **Single-store optimization**: Find the best store for your entire list
- **Multi-store optimization**: Optimal route planning across multiple stores
- **Cost vs. distance preferences**: Customizable lambda parameters
- **Real-time calculations** with loading states and error handling
- **Interactive results** with expandable store details

### **Product Discovery** (`groceryResults.tsx`)
Comprehensive product search and browsing:
- **Multiple search modes**: Search, promotions, and category-based
- **Advanced filtering**: Price range, category, and brand filters
- **Pagination support**: Efficient loading of large result sets
- **Shimmer loading**: Skeleton screens for better UX
- **Quick actions**: Add to cart, bookmark, and view details

### **Product Details** (`groceryInfo.tsx`)
Detailed product information screen:
- **Multi-store pricing**: Compare prices across different stores
- **Store locations**: Interactive map with store details
- **Floating action menu**: Quick access to cart, bookmarks, and lists
- **Promotion integration**: Show applicable deals and discounts

### **Barcode Scanner** (`barcodeScanner.tsx`)
Camera-based product identification:
- **Real-time scanning**: Instant barcode recognition
- **Product lookup**: Automatic product information retrieval
- **Error handling**: Graceful fallback for unrecognized codes
- **Permission management**: Camera access handling

---

## 🛒 Shopping Features

### **Cart Management** (`cart.tsx`)
Full-featured shopping cart:
- **Real-time synchronization**: Cloud-synced across devices
- **Quantity controls**: Increment/decrement with haptic feedback
- **Swipe actions**: Gesture-based item removal
- **Price calculations**: Live total updates
- **Empty state handling**: Engaging empty cart experience

### **List Management** (`my-lists.tsx`)
Comprehensive list management system:
- **Multiple lists**: Create and organize unlimited lists
- **Edit modes**: Bulk selection and deletion
- **Price estimation**: Automatic cost calculation
- **Search and filter**: Find lists quickly
- **Sharing capabilities**: Export and share lists

### **Bookmarks** (`my-groceries.tsx`)
Personal product collection:
- **Favorite products**: Save frequently purchased items
- **Quick access**: Fast add-to-cart functionality
- **Organization**: Category-based grouping
- **Sync across devices**: Cloud-based bookmark storage

---

## 🎨 UI/UX Excellence

### **Design System**
- **Consistent Typography**: Hierarchical text styles
- **Color Palette**: Accessible color schemes with dark mode support
- **Spacing System**: Consistent margins and padding
- **Component Library**: Reusable UI components

### **Interaction Design**
- **Haptic Feedback**: Tactile responses for user actions
- **Smooth Animations**: React Native Reanimated for fluid transitions
- **Gesture Support**: Swipe, pinch, and tap interactions
- **Loading States**: Engaging skeleton screens and spinners

### **Accessibility**
- **Screen Reader Support**: VoiceOver and TalkBack compatibility
- **High Contrast**: Accessible color combinations
- **Font Scaling**: Dynamic type support
- **Focus Management**: Keyboard navigation support

---

## 🔧 Advanced Features

### **Location Services**
- **GPS Integration**: Automatic location detection
- **Store Proximity**: Distance-based store filtering
- **Map Integration**: Interactive store locations
- **Navigation Handoff**: Seamless transition to navigation apps

### **Optimization Algorithms**
- **Single-Store Algorithm**: Find optimal store for shopping list
- **Multi-Store Algorithm**: Route optimization across multiple stores
- **Cost-Distance Balancing**: Configurable optimization parameters
- **Real-time Calculations**: Live optimization results

### **Data Management**
- **Offline Capabilities**: Local data caching
- **Sync Mechanisms**: Conflict resolution and data merging
- **Performance Monitoring**: Real-time performance tracking
- **Error Recovery**: Graceful error handling and recovery

---

*Built with ❤️ using React Native and Expo*