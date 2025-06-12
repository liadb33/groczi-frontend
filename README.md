# Groczi Frontend: The Smart Grocery Shopping Assistant

This repository contains the official frontend for **Groczi**, a modern mobile application designed to revolutionize your grocery shopping experience. Built with React Native and Expo, this application provides a powerful yet intuitive interface for finding the best prices, managing shopping lists, and optimizing your shopping trips.

This document serves as an in-depth guide to the frontend architecture, features, and development workflows, tailored for project evaluators, developers, and contributors.

---

## 🌟 Table of Contents

- [Live Demo (Placeholder)](#-live-demo)
- [Key Features](#-key-features)
  - [The Optimization Engine](#-the-optimization-engine)
  - [Comprehensive List Management](#-comprehensive-list-management)
  - [Advanced Product Discovery](#-advanced-product-discovery)
  - [Personalization](#-personalization)
- [Architectural Deep Dive](#-architectural-deep-dive)
  - [Core Philosophy](#core-philosophy)
  - [Project Structure Analysis](#-project-structure-analysis)
  - [State Management with Zustand](#-state-management-with-zustand)
  - [Navigation with Expo Router](#-navigation-with-expo-router)
  - [Component-Driven UI Development](#-component-driven-ui-development)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Available Scripts](#-available-scripts)
- [Final Degree Project](#-final-degree-project)

---

## 🎥 Live Demo

*(Here you could embed a GIF showcasing the app in action.)*

![Groczi App Demo](https://via.placeholder.com/800x450.png?text=Groczi+App+Demo+GIF)

---

## 🚀 Key Features

Groczi is not just another shopping list app. It's an intelligent assistant designed to save users time and money.

### 💡 The Optimization Engine

This is the core of the Groczi experience, accessible from the `comparePrices` screen. Once a user has items in their cart or a shopping list, they can initiate the optimization process.

-   **Dual Optimization Modes:**
    -   **Single-Store:** Finds the single best store for the entire list.
    -   **Multi-Store:** Calculates the most cost-effective trip by splitting the list across several nearby stores.
-   **User-Centric Preferences:** A custom `ThreeStatesSlider` component allows users to weigh their preference between **minimum cost** and **minimum travel distance**, giving them full control over the optimization algorithm's priorities.
-   **Detailed Results UI:**
    -   For single-store results, the `SingleStoreItemCard` presents the best option, clearly displaying total cost, distance, and even listing any items that are unavailable at that location.
    -   For multi-store results, each potential trip is shown as a `MultiStoreSolutionItem`. These cards are expandable, revealing a `StoreInSolutionItem` for each stop on the trip. Expanding a store then shows the exact items to purchase there, rendered by the `StoreItemInSolution` component.
-   **Seamless Navigation:** From any result, users can tap a button to get turn-by-turn directions via their device's native mapping application.

### 📋 Comprehensive List Management

Groczi provides robust functionality for creating and managing shopping lists, making it a powerful tool for household organization.

-   **Full CRUD Functionality:** Users can Create, Read, Update, and Delete any number of lists from the `my-lists` tab.
-   **Intuitive Edit Mode:** A dedicated "Edit Mode" allows for the bulk selection and deletion of multiple lists, streamlined for efficiency.
-   **Price Awareness:** Each list item (`ListItem`) displays an estimated minimum price for the entire list, giving users a budget forecast at a glance.
-   **Dedicated List View:** Tapping a list navigates to the `listInfo` screen, which displays all items in that specific list using the reusable `CartItem` component. From here, users can adjust quantities or send the entire list directly to the Price Comparison engine.

### 🔍 Advanced Product Discovery

Finding items is fast, intuitive, and versatile.

-   **Autocomplete Search:** The home screen features a `GroceryAutoCompleteInput` that provides instant search suggestions by calling the groceries API on a debounced timer as the user types.
-   **Barcode Scanning:** The `barcodeScanner` screen uses `expo-camera` to provide a fast and reliable way to look up products. Simply scan a barcode, and the app navigates directly to the `groceryInfo` screen for that item.
-   **Category Browsing:** The home screen displays a horizontal `CategoryList` for browsing items by their department (e.g., "Dairy & Eggs," "Fruits & Vegetables").
-   **Advanced Filtering:** The `FilterModal` component allows for powerful multi-faceted filtering. Users can select multiple categories to refine their search, and the results are displayed on the `groceryResults` screen.

### ✨ Personalization

Groczi adapts to the user's habits and location.

-   **My Groceries (Bookmarks):** Users can bookmark any item. These saved products appear in the `my-groceries` tab, rendered as `GrocerySavedCard`s. This creates a personalized catalog of frequently bought items, which can be quickly re-added to the cart or removed with a simple swipe gesture via the `SwipeDeleteItem` component.
-   **Location-Aware Promotions:** The home screen uses the device's location to fetch and display relevant promotions from nearby stores in `PromotionCard` components. Tapping a promotion shows all included products; tapping "Show More" opens a `PromotionListModal` with all deals from that store.

---

## 🏛️ Architectural Deep Dive

### Core Philosophy

The application is built on principles of **modularity, scalability, and separation of concerns**.

1.  **Feature-First Organization:** Code is grouped by feature (e.g., `components/promotions`, `utils/api/promotions.ts`, `usePromotionsSummaryStore`). This makes the codebase easy to navigate and maintain.
2.  **Centralized State:** All application state is managed by Zustand, completely decoupling state logic from the UI. Components are "dumb" consumers of state and dispatchers of actions.
3.  **Component Reusability:** The UI is composed of small, reusable components with well-defined props. This promotes consistency and accelerates development.
4.  **Abstraction of Services:** All external interactions (like API calls) are abstracted into a dedicated service layer (`utils/api`), ensuring that components and stores are not directly concerned with the implementation details of data fetching.

### 📁 Project Structure Analysis

Here is a detailed breakdown of the project's directory structure:

| Path | Description |
| :--- | :--- |
| **`app/`** | **Navigation & Screens.** Contains all application routes, managed by Expo Router. |
| `app/(root)/` | The main navigation group, defining the primary `Stack.Navigator`. |
| `app/(root)/(tabs)/` | Defines the four primary tabs of the app (`index`, `cart`, `my-groceries`, `my-lists`). |
| `app/_layout.tsx` | The root layout. Initializes fonts, the splash screen, and global providers like `PaperProvider`. |
| `app/+not-found.tsx` | A catch-all route for unmatched URLs. |
| **`assets/`** | **Static Assets.** Contains all fonts, icons, and images used in the application. |
| **`components/`** | **Reusable UI Components.** This is the heart of the UI library. |
| `components/comparePrices/` | All components specific to the complex price comparison and results screen. |
| `components/filter/` | Contains the `FilterModal` used for advanced product searching. |
| `components/grocery/` | Components for displaying grocery items in various contexts (results, saved cards, etc.). |
| `components/header/` | Reusable headers, like the generic `AppHeader` and the specialized `LocationHeader`. |
| `components/lists/` | Components for the "My Lists" feature, including items, headers, and modals. |
| `components/promotions/` | Components for displaying store promotions on cards and in modals. |
| `components/ui/` | **Base UI Kit.** General-purpose elements like modals, settings rows, and the extensive shimmer loading placeholder library. |
| **`constants/`** | **Global Constants.** Holds static, app-wide values like the `Colors.ts` palette. |
| **`hooks/`** | **Custom React Hooks.** E.g., `useColorScheme` for theme detection. |
| **`store/`** | **Zustand State Management.** A single `index.ts` file defines all state stores for the entire app. |
| **`types/`** | **TypeScript Definitions.** A global `types.d.ts` file for all custom types. |
| **`utils/`** | **Utility Functions & Services.** |
| `utils/api/` | **API Layer.** Contains all functions that fetch data from the backend. Each file corresponds to a backend resource (e.g., `cart.ts`, `lists.ts`). |
| `utils/mappers/` | Data transformation functions, e.g., mapping raw API responses to client-side types. |
| `tailwind.config.js` | Configuration file for NativeWind, allowing for custom utility classes and theme extensions. |

### 🧠 State Management with Zustand

We use a single, monolithic `store/index.ts` file to define all our Zustand stores. This provides a single source of truth for the entire application's state and makes it easy to understand data flow.

| Store | State Properties | Key Actions | Description |
| :--- | :--- | :--- | :--- |
| **`useLocationStore`** | `userLatitude`, `userLongitude`, `destinationLatitude`, etc. | `setUserLocation`, `setDestinationLocation` | Tracks the user's location and any selected map destination. |
| **`useCartStore`** | `cartItems`, `isLoading` | `loadCart`, `addToCart`, `removeFromCart`, `incrementQuantity` | Manages all aspects of the user's shopping cart. |
| **`useBookmarkStore`** | `bookmarks`, `isLoading` | `loadBookmarks`, `addToBookmarks`, `removeFromBookmarks` | Manages the user's list of saved/"favorite" items. |
| **`useListStore`** | `lists`, `isLoading` | `fetchAllLists`, `addNewList`, `removeLists` | Manages the collection of user-created shopping lists. |
| **`useListDetailsStore`** | `id`, `name`, `items` | `fetchList`, `addItem`, `updateItemQuantity` | Manages the state of a *single*, currently viewed shopping list. |
| **`useGroceryStore`** | `groceriesResults`, `currentItem`, `itemStores` | `search`, `fetchItemDetail`, `fetchItemStores` | Handles fetching, searching, and displaying individual grocery products. |
| **`usePromotionsSummaryStore`** | `promotions`, `isLoading` | `fetchPromotionsGroupedByStore` | Fetches and stores the promotion data displayed on the home screen. |
| **`useCategoryStore`** | `categories`, `isLoading` | `fetchCategories` | Fetches and stores the list of all available product categories. |
| **`useSettingsStore`** | `maxStoreDistance`, `maxTravelDistance`, `maxStores` | `setMaxStoreDistance`, etc. | Persists the user's preferences for the optimization engine. |
| **`useOptimizationStore`** | `groceries`, `singleStoreResult`, `multiStoreResult` | `runSingleStoreOptimization`, `runMultiStoreOptimization` | The most complex store; it holds the input for the optimization engine and stores its results. |

### 🧭 Navigation with Expo Router

Navigation is handled declaratively using **Expo Router v3**.

-   **File-Based Routing:** Every screen is a file in the `app/` directory. This makes the navigation structure intuitive and easy to follow.
-   **Layouts:** The `_layout.tsx` files define the navigation hierarchy. The root layout sets up global providers, and nested layouts configure navigators like `Stack` and `Tabs`.
-   **Grouped Routes:** We use directory groups like `(root)` and `(tabs)` to organize routes and share layouts without affecting the URL structure.
-   **Hiding Tabs:** Screens that are part of a stack but should not appear in the tab bar (e.g., `listInfo`, `location`) are configured with `href: null` in their options. This is a clean way to handle nested navigation within a tab group.
-   **Typed Routes:** We leverage Expo Router's features for type-safe navigation, ensuring that `router.push` calls are checked against existing routes and their required parameters.

### 🎨 Component-Driven UI Development

The UI is built from the ground up with a library of custom, reusable components.

-   **Atomic Design Principles:** The `components/` directory is organized logically, with foundational elements in `components/ui` and more complex, feature-specific components in their respective folders.
-   **Shimmer Placeholders:** To create a perception of speed and to avoid jarring loading spinners, the app makes extensive use of shimmer placeholders. A `ShimmerContainer` component is used to easily generate lists of shimmer items, and there is a dedicated shimmer component for almost every major UI card (e.g., `GroceryResultCardShimmer`, `CartItemShimmer`, `ListItemShimmer`).
-   **Platform-Specific Polish:** We pay close attention to platform conventions.
    -   `IconSymbol.tsx` uses the `.ios.tsx` extension to render native **SF Symbols** on iOS for a perfect system look, while gracefully falling back to **Material Icons** on Android.
    -   `TabBarBackground.ios.tsx` uses `expo-blur` to create a translucent, blurred tab bar that matches the native iOS aesthetic, while other platforms get a standard opaque background.
-   **Complex Custom Components:**
    -   `SwipeDeleteItem`: A reusable wrapper for `react-native-swipe-list-view` that provides a consistent "swipe-to-delete" interaction across the app.
    -   `FloatingEyeMenu`: A complex, animated Floating Action Button built with `react-native-reanimated` that provides a delightful user interaction on the `groceryInfo` screen.
    -   `GoogleTextInput` & `GroceryAutoCompleteInput`: Powerful, reusable input components that abstract away the complexity of integrating with Google Places and the backend search API.

---

## 🛠️ Tech Stack

-   **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (v3)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
-   **Styling:** [NativeWind](https://www.nativewind.dev/) (v4)
-   **UI Libraries:** [React Native Paper](https://react-native-paper.com/), [React Native Modal](https://github.com/react-native-modal/react-native-modal), [React Native Maps](https://github.com/react-native-maps/react-native-maps)
-   **Icons:** [Lucide React Native](https://lucide.dev/), [Expo Vector Icons](https://docs.expo.dev/guides/icons/), [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (LTS version recommended)
-   `npm` package manager
-   [Expo Go](https://expo.dev/go) app on your iOS or Android device, or an [Android](https://docs.expo.dev/workflow/android-studio-emulator/)/[iOS](https://docs.expo.dev/workflow/ios-simulator/) emulator installed on your machine.
-   A Google Maps API key with the Places API enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/groczi-frontend.git
    cd groczi-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project. This file is ignored by Git and should contain your secret keys.
    ```
    EXPO_PUBLIC_GOOGLE_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"
    ```

4.  **Run the application:**
    ```bash
    npx expo start
    ```
    This will start the Metro bundler. You can then scan the QR code with the Expo Go app on your phone or run the app on an emulator.

---

## 📜 Available Scripts

In the project directory, you can run:

-   `npm start`: Runs the app in development mode using Expo.
-   `npm run android`: Deploys the app to a connected Android device or emulator.
-   `npm run ios`: Deploys the app to the iOS simulator.
-   `npm run web`: Runs the app in a web browser.
-   `npm test`: Runs the test suite using Jest.
-   `npm run lint`: Lints the code using Expo's recommended ESLint configuration.

---

## ✨ Final Degree Project

This project was developed as a final degree project, showcasing the application of modern mobile development practices to solve a real-world problem. The focus was on creating a feature-rich, user-friendly, and technically robust application. It demonstrates a deep understanding of mobile architecture, state management, and UI/UX design on the React Native platform. 