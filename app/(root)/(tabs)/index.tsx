import React, { useEffect } from 'react';
import { useRef, useCallback, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, I18nManager, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import "react-native-get-random-values";
import * as Location from 'expo-location';
// Import our new components
import CategoryList from '@/components/grocery/CategoryList';
import LocationHeader from '@/components/header/LocationHeader';
import { useLocationStore, usePromotionsSummaryStore } from '@/store';
import FilterModal from '@/components/filter/FilterModal';
import GroceryAutocompleteInput from '@/components/grocery/GroceryAutoCompleteInput';
import PromotionCard from '@/components/grocery/PromotionCard';
// Force RTL for the app
I18nManager.forceRTL(true);

const categories = [
  { id: 1, name: 'פירות', icon: 'fruit-cherries' },
  { id: 2, name: 'בשרים', icon: 'food-steak' },
  { id: 3, name: 'ירקות', icon: 'carrot' },
  { id: 4, name: 'משקאות', icon: 'glass-wine' },
  { id: 5, name: 'אפייה', icon: 'chef-hat' },
];

const topGroceries = [
  {
    id: 1,
    name: 'תפוז טרי',
    category: 'פירות',
    weight: '1 ק"ג',
    price: '₪5',
    discount: '35% הנחה',
    image: 'https://images.unsplash.com/photo-1600423115367-87ea7661688f?ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80',
    bookmarked: true
  },
  {
    id: 2,
    name: 'בשר בקר',
    category: 'בשרים',
    weight: '500 גרם',
    price: '₪12',
    discount: '35% הנחה',
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80',
    bookmarked: false
  },
];

// RTL-friendly styles
const rtlStyles = StyleSheet.create({
  container: {
    flex: 1,
    direction: 'rtl',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});

// Placeholder image for grocery items
const PLACEHOLDER_IMAGE = "https://cdn-icons-png.flaticon.com/512/1046/1046869.png";

interface DetailedGroceryItem {
  itemCode: string;
  itemName?: string;
  isWeighted?: boolean;
  qtyInPackage?: string;
  unitOfMeasure?: string;
  [key: string]: any;
}

export default function HomeScreen() {
  // State for search query input
  const [searchQuery, setSearchQuery] = useState("");

  // State to track bookmarked grocery items
  const [bookmarkedItems, setBookmarkedItems] = useState(topGroceries);

  // Filter-related states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Default selected categories
  const [priceRange, setPriceRange] = useState({ min: 0, max: 125 }); // Default price range
  const [selectedCompany, setSelectedCompany] = useState(""); // Default selected company
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Track if filter modal is open

  // States for location
  const {setUserLocation,setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const { promotions, isLoading, error, fetchPromotions } = usePromotionsSummaryStore();

  // New state to control ScrollView scrollability
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  // New state for grocery search results
  const [searchResults, setSearchResults] = useState<DetailedGroceryItem[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  /**
   * Opens the filter modal
   */
  const openFilter = () => {
    setIsFilterOpen(true);
  };

  /**
   * Closes the filter modal
   */
  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  /**
   * Resets all filter values to defaults and closes the modal
   */
  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 125 });
    setSelectedCompany("");
    closeFilter();
  };

  /**
   * Applies the current filter values to the data
   */
  const applyFilters = () => {
    // Apply the filters to your data
    console.log("Applying filters:", {
      selectedCategories,
      priceRange,
      selectedCompany,
    });
    closeFilter();
  };

  /**
   * Updates the search query when text changes in the search input
   * @param query - The new search text
   */
  const onChangeSearch = (query: string) => setSearchQuery(query);

  /**
   * Handles when a category is pressed
   * @param category - The category that was pressed
   */
  const handleCategoryPress = (category: any) => {
    console.log("Category pressed:", category.name);
  };

  /**
   * Handles when a quick filter is pressed
   * @param filter - The filter that was pressed
   */
  const handleFilterPress = (filter: string) => {
    console.log("Filter pressed:", filter);
  };

  /**
   * Toggles the bookmark status of a grocery item
   */
  const handleToggleBookmark = (groceryItem: any) => {
    // Map through all items and toggle the bookmarked property of the matching item
    const updatedItems = bookmarkedItems.map((item) =>
      item.id === groceryItem.id
        ? { ...item, bookmarked: !item.bookmarked }
        : item
    );
    setBookmarkedItems(updatedItems);
  };

  /**
   * Navigates to the settings screen
   */
  const navigateToSettings = () => {
    router.push("../settings");
  };

  /**
   * Toggles the selection of a category in the filter
   */
  const toggleCategorySelection = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category) // Remove if exists
        : [...prevSelected, category] // Add if doesn't exist
    );
  };

  /**
   * Navigates to the location screen
   */
  const navigateToLocation = () => {
    router.push("/location");
  };

  // Callbacks for dropdown state
  const handleDropdownOpen = () => {
    setScrollEnabled(false);
    setDropdownVisible(true);
  };

  const handleDropdownClose = () => {
    setScrollEnabled(true);
    setDropdownVisible(false);
  };

  // Handle selection of a grocery item from dropdown
  const handleSelectGrocery = (item: DetailedGroceryItem) => {
    setDropdownVisible(false);
    setScrollEnabled(true);
    router.push({
      pathname: "./groceryInfo",
      params: { id: item.itemCode },
    });
  };

  const handleSubmit = (searchText: string) => {
    router.push({
      pathname: "../groceryResults",
      params: { searchQuery: searchText },
    });
  };

  const { userAddress } = useLocationStore();
  const searchBarRef = useRef<View>(null);
  const [searchBarPosition, setSearchBarPosition] = useState({ top: 0, height: 0 });

  // Get dropdown position
  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.measure((x, y, width, height, pageX, pageY) => {
        setSearchBarPosition({
          top: pageY + height,
          height: height
        });
      });
    }
  }, [searchBarRef.current]);

  // Retrieve location from user
  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=he&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        const components = data.results?.[0]?.address_components || [];
        const cityComp = components.find((comp: any) =>
          comp.types.includes("locality")
        );
        const countryComp = components.find((comp: any) =>
          comp.types.includes("country")
        );

        const city = cityComp ? cityComp.long_name : "";
        const country = countryComp ? countryComp.long_name : "";

        setUserLocation({
          latitude,
          longitude,
          address: city && country ? `${city}, ${country}` : "כתובת לא זמינה",
        });
      } catch (error) {
        console.error("Failed to fetch address from Google:", error);
        setUserLocation({
          latitude,
          longitude,
          address: "כתובת לא זמינה",
        });
      }
    };

    requestLocation();
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-white px-1"
      edges={["top"]}
      style={rtlStyles.container}
    >
      <StatusBar style="dark" />

      <View className="flex-1 z-10">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
          scrollEnabled={scrollEnabled}
        >
          {/* Header - now inside ScrollView */}
          <LocationHeader
            location={userAddress ?? "מחפש כתובת..."}
            onSettingsPress={navigateToSettings}
            onLocationPress={navigateToLocation}
            isRTL={true}
            locationLabel="מיקום"
          />

          {/* Search Input - now inside ScrollView */}
          <View 
            ref={searchBarRef}
            className="relative z-10 mx-4 mt-2"
            onLayout={() => {
              if (searchBarRef.current) {
                searchBarRef.current.measure((x, y, width, height, pageX, pageY) => {
                  setSearchBarPosition({
                    top: pageY + height,
                    height: height
                  });
                });
              }
            }}
          >
            <GroceryAutocompleteInput
              onSelectGrocery={handleSelectGrocery}
              isRTL={true}
              containerStyle={{}}
              onDropdownOpen={handleDropdownOpen}
              onDropdownClose={handleDropdownClose}
              onResultsChange={setSearchResults}
              onSubmit={handleSubmit}
              renderRightButton={() => (
                <TouchableOpacity onPress={openFilter}>
                  <MaterialCommunityIcons name="tune" size={24} color="#000" />
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Categories Section */}
          <View className="px-6 mt-4 mb-2 flex flex-row-reverse justify-between items-center">
            <TouchableOpacity>
              <Text className="text-blue-600">הצג הכל</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold">קטגוריות</Text>
          </View>

          <CategoryList
            categories={categories}
            onCategoryPress={handleCategoryPress}
            isRTL={true}
          />

          {/* Top Groceries Section */}
          <View className="px-6 mt-4 mb-5 flex flex-row-reverse justify-between items-center">
            <TouchableOpacity>
              <Text className="text-blue-600">הצג הכל</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold">מבצעים חמים</Text>
          </View>

          {/* Grocery Items */}
          {isLoading ? (
            <Text className="text-center my-4 text-gray-500">
              טוען מבצעים...
            </Text>
          ) : error ? (
            <Text className="text-center my-4 text-red-600">{error}</Text>
          ) : promotions.length === 0 ? (
            <Text className="text-center my-4 text-gray-500">
              אין מבצעים זמינים
            </Text>
          ) : (
            promotions.map((promo, idx) => (
              <PromotionCard
                key={promo.promotionId || idx}
                storeName={promo.storeName || ""}
                promotionName={promo.promotionName || ""}
                expiryDate={
                  promo.expiryDate
                    ? `עד ${new Date(promo.expiryDate).toLocaleDateString(
                        "he-IL",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}`
                    : ""
                }
                items={promo.groceries
                  .slice(0, 4)
                  .map((g) => ({ name: g.itemName, price: "" }))}
                image="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80"
                // optionally: use a real promo image if you have one
              />
            ))
          )}
        </ScrollView>

        {/* Dropdown list rendered OUTSIDE of ScrollView to prevent nesting VirtualizedLists */}
        {dropdownVisible && searchResults.length > 0 && (
          <View 
            style={[
              styles.dropdown,
              {
                top: searchBarPosition.top,
                position: 'absolute',
                left: 16,
                right: 16,
                zIndex: 1000
              }
            ]}
          >
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={searchResults}
              keyExtractor={(item: DetailedGroceryItem) => item.itemCode}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectGrocery(item)}
                >
                  <Image
                    source={{ uri: PLACEHOLDER_IMAGE }}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.itemName}>
                      {item.itemName || ""}
                    </Text>
                    <Text style={styles.itemUnit}>
                      {item.isWeighted
                        ? `כמות באריזה: ${item.qtyInPackage}`
                        : item.unitOfMeasure}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 250 }}
            />
          </View>
        )}
      </View>

      {/* Use the new FilterModal component */}
      <FilterModal
        isVisible={isFilterOpen}
        onClose={closeFilter}
        onApply={applyFilters}
        onReset={resetFilters}
        selectedCategories={selectedCategories}
        toggleCategorySelection={toggleCategorySelection}
        priceRange={priceRange}
        selectedCompany={selectedCompany}
        isRTL={true}
        applyButtonText="החל"
        resetButtonText="איפוס"
        filterTitle="סינון"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 2,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 32,
    height: 32,
    marginRight: 5,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
    marginRight: 8,
  },
  itemUnit: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    marginRight: 8,
  },
});
