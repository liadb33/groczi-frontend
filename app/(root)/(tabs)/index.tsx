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
import { useLocationStore, usePromotionsSummaryStore, useSettingsStore, useCategoryStore } from '@/store';
import FilterModal from '@/components/filter/FilterModal';
import GroceryAutocompleteInput from '@/components/grocery/GroceryAutoCompleteInput';
import PromotionCard from '@/components/promotions/PromotionCard';
import PromotionListModal from '@/components/promotions/PromotionListModal';
import ShimmerCard from '@/components/ui/ShimmerCard';
import { PLACEHOLDER_IMAGE } from '@/constants/Placeholders';
// Force RTL for the app


const getCategoryIcon = (categoryName: string): string => {
  const iconMap: { [key: string]: string } = {
    "טקסטיל, ביגוד והנעלה": "hanger",
    "אחר": "dots-horizontal",
    "תינוקות": "baby-face",
    "אלקטרוניקה סלולר": "cellphone",
    "כלי עבודה ועוד": "tools",
    "תבלינים": "shaker",
    'אחזקת הבית וב"ח': "hammer-wrench",
    "פנאי, אחסון וארגון ועוד": "toy-brick",
    "פארם טיפוח וניקיון": "spray-bottle",
    "בישול, אפייה, שימורים ורטבים": "chef-hat",
    "משקאות": "glass-wine",
    "קפה, אלכוהול וסיגריות": "coffee",
    "חטיפים וממתקים": "candy",
    "פירות וירקות": "fruit-cherries",
    "בשר ודגים": "food-steak",
    "קפואים / טבעוניים": "snowflake",
    "לחם ומאפים": "bread-slice",
    "ביצים ומוצרי חלב": "cow",
  };
  return iconMap[categoryName] || "help-circle";
};


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

  // Filter-related states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Default selected categories
  const [priceRange, setPriceRange] = useState({ min: 0, max: 125 }); // Default price range
  const [selectedCompany, setSelectedCompany] = useState(""); // Default selected company
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Track if filter modal is open

  // States for location
  const {setUserLocation,setDestinationLocation, userLatitude, userLongitude } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const { promotions, isLoading, error, fetchPromotionsGroupedByStore } = usePromotionsSummaryStore();
  const { maxStoreDistance } = useSettingsStore();
  
  // Category store
  const { categories: backendCategories, fetchCategories, isLoading: categoriesLoading } = useCategoryStore();

  // Transform backend categories to the format expected by CategoryList
  const categories = backendCategories.map((categoryName, index) => ({
    id: index + 1,
    name: categoryName,
    icon: getCategoryIcon(categoryName),
  }));

  // New state to control ScrollView scrollability
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  // New state for grocery search results
  const [searchResults, setSearchResults] = useState<DetailedGroceryItem[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // State for promotion modal
  const [isPromotionModalVisible, setIsPromotionModalVisible] = useState(false);
  const [selectedStorePromotions, setSelectedStorePromotions] = useState<{
    storeName: string;
    storeAddress: string;
    chainId: string;
    subChainId: string;
    storeId: string;
    promotions: Array<{ promotionId: string; promotionName: string; endDate: string }>;
  } | null>(null);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch promotions only after location is retrieved
  useEffect(() => {
    if (userLatitude && userLongitude && !locationError) {
      fetchPromotionsGroupedByStore(userLatitude, userLongitude, maxStoreDistance);
    }
  }, [userLatitude, userLongitude, maxStoreDistance, locationError]);

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
    router.push({
      pathname: "../groceryResults",
      params: { categoryName: category.name },
    });
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

  /**
   * Navigates to the barcode scanner screen
   */
  const navigateToBarcodeScanner = () => {
    router.push("../barcodeScanner");
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

  /**
   * Handles when "הצג עוד" is pressed in a PromotionCard
   */
  const handleShowMorePromotions = (store: {
    storeName: string;
    storeAddress: string;
    chainId: string;
    subChainId: string;
    storeId: string;
    promotions: Array<{ promotionId: string; promotionName: string; endDate: string }>;
  }) => {
    setSelectedStorePromotions(store);
    setIsPromotionModalVisible(true);
  };

  /**
   * Closes the promotion modal
   */
  const closePromotionModal = () => {
    setIsPromotionModalVisible(false);
    setSelectedStorePromotions(null);
  };

 /**
   * Handles when a specific promotion is pressed in a PromotionCard
   */
  const handlePromotionPress = (promotion: {
    promotionId: string;
    promotionName: string;
    endDate: string;
    chainId: string;
    subChainId: string;
    storeId: string;
  }) => {
    if(isPromotionModalVisible){
      closePromotionModal();
    }
    router.push({
      pathname: "../groceryResults",
      params: {
        promotionId: promotion.promotionId,
        chainId: promotion.chainId,
        subChainId: promotion.subChainId,
        storeId: promotion.storeId,
      },
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
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setHasPermission(false);
          setLocationError(true);
          return;
        }

        setHasPermission(true);
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
          setLocationError(false);
        } catch (error) {
          console.error("Failed to fetch address from Google:", error);
          setUserLocation({
            latitude,
            longitude,
            address: "כתובת לא זמינה",
          });
          setLocationError(false);
        }
      } catch (error) {
        console.error("Failed to get location:", error);
        setLocationError(true);
        setHasPermission(false);
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
            onQRCodePress={navigateToBarcodeScanner}
            isRTL={true}
            locationLabel="מיקום"
          />

          {/* Search Input - now inside ScrollView */}
          <View 
            ref={searchBarRef}
            className="relative z-10 mx-4 mt-7"
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
          <View className="px-6 mt-4 mb-2 flex flex-row  justify-between items-right">
            <Text className="text-2xl font-bold">קטגוריות</Text>
          </View>
    
          <CategoryList 
            categories={categories}
            onCategoryPress={handleCategoryPress}
          />

          {/* Top Groceries Section */}
          <View className="px-6 mt-4 mb-5 flex flex-row justify-between items-center">
            {/* <TouchableOpacity>
              <Text className="text-blue-600">הצג הכל</Text>
            </TouchableOpacity> */}
            <Text className="text-2xl font-bold">מבצעים חמים באזורך</Text>
          </View>

          {/* Grocery Items */}
          {locationError ? (
            <View className="px-6 my-8">
              <Text className="text-center text-lg text-gray-600 font-medium">
                לא הצלחנו למצוא מבצעים באזורך
              </Text>
              <Text className="text-center text-sm text-gray-500 mt-2">
                אנא ודא שהגישה למיקום מופעלת ונסה שוב
              </Text>
            </View>
          ) : !userLatitude || !userLongitude ? (
            // Show shimmer loading while waiting for location
            <View>
              {[1, 2, 3, 4].map((index) => (
                <ShimmerCard key={index} />
              ))}
            </View>
          ) : isLoading ? (
            // Show shimmer loading while fetching promotions
            <View>
              {[1, 2, 3, 4].map((index) => (
                <ShimmerCard key={index} />
              ))}
            </View>
          ) : error ? (
            <View className="px-6 my-8">
              <Text className="text-center text-lg text-gray-600 font-medium">
                לא הצלחנו למצוא מבצעים באזורך
              </Text>
              <Text className="text-center text-sm text-gray-500 mt-2">
                נסה שוב מאוחר יותר
              </Text>
            </View>
          ) : promotions.length === 0 ? (
            <View className="px-6 my-8">
              <Text className="text-center text-lg text-gray-600 font-medium">
                אין מבצעים זמינים באזורך
              </Text>
              <Text className="text-center text-sm text-gray-500 mt-2">
                בדוק שוב מאוחר יותר למבצעים חדשים
              </Text>
            </View>
          ) : (
            promotions.map((store, idx) => (
              <PromotionCard
                key={`${store.chainId}-${store.subChainId}-${store.storeId}`}
                storeName={store.storeName || ""}
                storeAddress={store.address || ""}
                chainId={store.chainId}
                subChainId={store.subChainId}
                storeId={store.storeId}
                storeImageUrl={store.subchains?.imageUrl ?? PLACEHOLDER_IMAGE}
                promotions={store.promotions}
                onPromotionPress={handlePromotionPress}
                onShowMorePress={() => handleShowMorePromotions({
                  storeName: store.storeName || "",
                  storeAddress: store.address || "",
                  chainId: store.chainId,
                  subChainId: store.subChainId,
                  storeId: store.storeId,
                  promotions: store.promotions
                })}
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
                    source={{ uri: item.imageUrl ?? PLACEHOLDER_IMAGE }}
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
        availableCategories={backendCategories}
        isRTL={true}
        applyButtonText="החל"
        resetButtonText="איפוס"
        filterTitle="סינון"
      />

      {/* Promotion Modal */}
      {isPromotionModalVisible && selectedStorePromotions && (
        <PromotionListModal
          title="כל המבצעים"
          visible={isPromotionModalVisible}
          onClose={closePromotionModal}
          onSelectPromotion={handlePromotionPress}
          storeName={selectedStorePromotions.storeName}
          chainId={selectedStorePromotions.chainId}
          subChainId={selectedStorePromotions.subChainId}
          storeId={selectedStorePromotions.storeId}
          promotions={selectedStorePromotions.promotions}
        />
      )}
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
