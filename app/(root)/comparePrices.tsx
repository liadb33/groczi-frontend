import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView, // For inner item list scroll
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Settings, ChevronsUpDown, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react-native"; // Added ChevronsUpDown
import { useOptimizationStore, useLocationStore, useSettingsStore, useStores } from "@/store";
import CustomListModal from "@/components/grocery/CustomListModal";
import AppHeader from "@/components/header/AppHeader";
import HeaderComponent from "@/components/comparePrices/HeaderComponent";
import EmptyOrErrorComponent from "@/components/comparePrices/EmptyOrError";
import MultiStoreSolutionItem from "@/components/comparePrices/MultiStoreSolutionItem";
import LoadingComponent from "@/components/ui/LoadingComponent";
import SingleStoreItemCard from "@/components/comparePrices/SingleStoreItemCard";
import OptimizationTypeDropdown from "@/components/comparePrices/OptimizationTypeDropdown";
import { PLACEHOLDER_IMAGE } from '@/constants/Placeholders';

const OPTION_SINGLE_STORE = "חנות יחידה";
const OPTION_MULTI_STORE = "מספר חנויות";
const DEFAULT_LAMBDA_TRAVEL = 1.0;
const COST_PRIORITY_LAMBDA = 0.1; // Small value to still consider travel a bit if items costs are equal
const DISTANCE_PRIORITY_LAMBDA = 10.0;

// Dropdown options for optimization type
const OPTIMIZATION_OPTIONS = [
  { value: OPTION_SINGLE_STORE, label: OPTION_SINGLE_STORE },
  { value: OPTION_MULTI_STORE, label: OPTION_MULTI_STORE },
];

export default function ComparePricesScreen() {
  const router = useRouter();
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Zustand stores
  const {
    groceries, // This is CustomOptimizationItem[]
    runSingleStoreOptimization,
    runMultiStoreOptimization,
    singleStoreResult,
    multiStoreResult, // <<<< NEW: For multi-store results
    isLoading, // Assuming this is a general loading flag, or you might have isLoadingSingle/isLoadingMulti
    error,     // Assuming general error, or errorSingle/errorMulti
    clearResults,
  } = useOptimizationStore();

  const { userLatitude, userLongitude } = useLocationStore();
  const { setDestinationLocation } = useLocationStore();
  const { maxStoreDistance, maxTravelDistance, maxStores } = useSettingsStore();
  const { stores, fetchStores } = useStores();

  // Local state
  const [selectedChip, setSelectedChip] = useState<"מרחק" | "עלות" | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(OPTION_SINGLE_STORE); // Default to single store

  
  // For single-store partial match modal
  const [showPartialMatchModal, setShowPartialMatchModal] = useState(false);
  const [isMissingModalVisible, setIsMissingModalVisible] = useState(false);
  const [selectedStoreMissingItems, setSelectedStoreMissingItems] = useState<
    { id: string; name: string; itemCount?: number }[]
  >([]);

  // For multi-store UI
  const [expandedSolutionId, setExpandedSolutionId] = useState<string | null>(null); // Tracks expanded solution (e.g., using total_cost as a pseudo-ID or an actual index)
  const [expandedStoresInSolution, setExpandedStoresInSolution] = useState<{ [key: string]: boolean }>({}); // Tracks expanded stores within solutions: key = "solutionIndex_storeId"

  // Function to generate a unique key for a solution for state tracking
  const getSolutionKey = (solution: MultiStoreSolution, index: number) => `solution-${index}-${solution.total_cost}`;


  // Initial data fetch logic
  useEffect(() => {
    // Clear previous results when the screen mounts or groceries change
    clearResults(); 
    // Fetch stores data for store images
    fetchStores();
    if (groceries.length > 0 && userLatitude && userLongitude) {
      if (selectedOption === OPTION_SINGLE_STORE) {
        runSingleStoreOptimizationHandler(null); // Pass null for default lambda
      } else {
        runMultiStoreOptimizationHandlerWithParams();
      }
    }
  }, [groceries, userLatitude, userLongitude, fetchStores]); // Removed selectedOption from deps to avoid re-fetch on tab switch before results

  // Show modal for single-store partial match
  useEffect(() => {
    if (selectedOption === OPTION_SINGLE_STORE && singleStoreResult?.is_partial_match && !showPartialMatchModal) {
      setShowPartialMatchModal(true);
    }
  }, [singleStoreResult, selectedOption]);


  const runSingleStoreOptimizationHandler = useCallback(async (chipType: "מרחק" | "עלות" | null) => {
    if (!userLatitude || !userLongitude || groceries.length === 0) {
      console.warn("Single-Store Opt: Missing location or groceries data");
      return;
    }
    setShowPartialMatchModal(false); // Close modal if it was open

    let lambdaTravel = DEFAULT_LAMBDA_TRAVEL;
    if (chipType === "עלות") lambdaTravel = COST_PRIORITY_LAMBDA;
    else if (chipType === "מרחק") lambdaTravel = DISTANCE_PRIORITY_LAMBDA;

    const params: OptimizeSingleStoreListRequestBody = {
      userLatitude,
      userLongitude,
      items: groceries,
      lambdaTravel,
      costPerDistanceUnit: 1, // Default or from settings
      maxStoreDistance: maxStoreDistance, // Default or from settings
    };
    await runSingleStoreOptimization(params);
  }, [userLatitude, userLongitude, groceries, runSingleStoreOptimization, maxStoreDistance]);

  const runMultiStoreOptimizationHandlerWithParams = useCallback(async (chipType: "מרחק" | "עלות" | null = selectedChip) => {
    if (!userLatitude || !userLongitude || groceries.length === 0) {
      console.warn("Multi-Store Opt: Missing location or groceries data");
      return;
    }
     setShowPartialMatchModal(false); // Close single-store partial match modal

    let lambdaTravel = DEFAULT_LAMBDA_TRAVEL; // This lambda applies to travel cost in DP scoring.
    if (chipType === "עלות") lambdaTravel = COST_PRIORITY_LAMBDA;
    else if (chipType === "מרחק") lambdaTravel = DISTANCE_PRIORITY_LAMBDA;

    const params: OptimizeMultiStoreListRequestBody = {
      userLatitude,
      userLongitude,
      items: groceries,
      lambdaTravel, // Pass lambda for scoring/ranking within DP if backend uses it
      costPerDistanceUnit: 1, // Default or from settings
      maxStoreDistance: maxStoreDistance,  // Initial filter for candidate stores
      maxStores: maxStores,           // Example: User might want to visit max 3 stores
      maxTravelDistance: maxTravelDistance, // Example: Max total travel distance for a solution
    };
    await runMultiStoreOptimization(params);
    // Automatically expand the first solution if results are available
    if (multiStoreResult && multiStoreResult.solutions.length > 0) {
        const firstSolutionKey = getSolutionKey(multiStoreResult.solutions[0], 0);
        setExpandedSolutionId(firstSolutionKey);
        // And expand the first store in the first solution
        if (multiStoreResult.solutions[0].assignments) {
            const firstStoreName = Object.keys(multiStoreResult.solutions[0].assignments)[0];
            if (firstStoreName) {
                const firstStoreKey = `${firstSolutionKey}_${multiStoreResult.solutions[0].assignments[firstStoreName].store_id}`;
                setExpandedStoresInSolution(prev => ({ ...prev, [firstStoreKey]: true }));
            }
        }
    }


  }, [userLatitude, userLongitude, groceries, runMultiStoreOptimization, selectedChip]);


  const handleNavigateBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("./index");
  };

  const handleOpenSettings = () => router.push("./settings");

  const handleChipPress = async (chip: "מרחק" | "עלות") => {
    const newSelection = selectedChip === chip ? null : chip;
    setSelectedChip(newSelection);
    if (selectedOption === OPTION_SINGLE_STORE) {
      await runSingleStoreOptimizationHandler(newSelection);
    } else {
      await runMultiStoreOptimizationHandlerWithParams(newSelection);
    }
  };

  const handleDropdownPress = () => setIsDropdownVisible(!isDropdownVisible);

  const handleOptionSelect = async (option: string) => {
    if (selectedOption === option) {
        setIsDropdownVisible(false);
        return;
    }
    setSelectedOption(option);
    setIsDropdownVisible(false);
    clearResults(); // Clear previous results when switching main option type
    setSelectedChip(null); // Reset chips

    // Trigger new optimization based on selected option
    if (option === OPTION_SINGLE_STORE) {
      await runSingleStoreOptimizationHandler(null); // Run with default lambda
    } else if (option === OPTION_MULTI_STORE) {
      await runMultiStoreOptimizationHandlerWithParams(null); // Run with default lambda
    }
  };
  
  const handleShowOptionsAnyway = () => setShowPartialMatchModal(false);
  const handleModalBackdropPress = () => setShowPartialMatchModal(false);

  const onSelectListMissingItem = (itemCode: string) => {
    setIsMissingModalVisible(false);
    router.push({ pathname: "../groceryInfo", params: { id: itemCode } });
  };

  // Handler for navigation from single store card
  const handleNavigateToStore = (locationData: {
    latitude: number;
    longitude: number;
    address: string;
    storeId: string;
    chainId: string;
    subChainId: string;
  }) => {
    setDestinationLocation(locationData);
    router.push("/location");
  };

  // Handler for showing missing items
  const handleShowMissingItems = (missingItems: { id: string; name: string }[]) => {
    setSelectedStoreMissingItems(missingItems);
    setIsMissingModalVisible(true);
  };

  // Render function for single store item cards
  const renderSingleStoreItemCard = ({ item }: { item: SingleStoreEvaluation }) => {
    // Find the store with matching chainId, subChainId, and storeId
    const storeData = stores.find(store => 
      store.ChainId === item.chainId && 
      store.SubChainId === item.subChainId && 
      store.StoreId === item.store_id
    );
    
    return (
      <SingleStoreItemCard
        item={item}
        isPartialMatch={singleStoreResult?.is_partial_match || false}
        groceries={groceries}
        storeImageUrl={storeData?.subchains?.imageUrl ?? PLACEHOLDER_IMAGE}
        onNavigate={handleNavigateToStore}
        onShowMissingItems={handleShowMissingItems}
      />
    );
  };

  // Handler for toggling store expansion within solutions
  const handleToggleStoreExpansion = (storeKey: string) => {
    setExpandedStoresInSolution(prev => ({ ...prev, [storeKey]: !prev[storeKey] }));
  };

  // Handler for toggling solution expansion
  const handleToggleSolutionExpansion = (solutionKey: string) => {
    const isCurrentlyExpanded = expandedSolutionId === solutionKey;
    setExpandedSolutionId(isCurrentlyExpanded ? null : solutionKey);
    
    // When collapsing a solution, also collapse its internal stores (optional)
    if (isCurrentlyExpanded) {
      const newExpandedStores = { ...expandedStoresInSolution };
      Object.keys(newExpandedStores).forEach(key => {
        if (key.startsWith(solutionKey + "_")) {
          delete newExpandedStores[key];
        }
      });
      setExpandedStoresInSolution(newExpandedStores);
    }
  };

  // Render function for multi-store solution items
  const renderMultiStoreSolutionItem = ({ item: solution, index }: { item: MultiStoreSolution; index: number }) => {
    const solutionKey = getSolutionKey(solution, index);
    const isExpanded = expandedSolutionId === solutionKey;

    return (
      <MultiStoreSolutionItem
        solution={solution}
        index={index}
        solutionKey={solutionKey}
        isExpanded={isExpanded}
        expandedStoresInSolution={expandedStoresInSolution}
        stores={stores}
        onToggleSolutionExpansion={() => handleToggleSolutionExpansion(solutionKey)}
        onToggleStoreExpansion={handleToggleStoreExpansion}
        onNavigateToStore={(address) => console.log("Navigate to:", address)}
      />
    );
  };

  // Main return
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <AppHeader title="השוואת מחירים" />

      {isLoading && (!singleStoreResult && !multiStoreResult) ? ( // Show full screen loader only on initial load
        <LoadingComponent text="מחפש את האפשרויות הטובות ביותר..." />
      ) : selectedOption === OPTION_SINGLE_STORE ? (
        <FlatList<SingleStoreEvaluation>
          data={singleStoreResult?.ranked_stores || []}
          renderItem={renderSingleStoreItemCard}
          keyExtractor={(item) => `${item.chainId}-${item.subChainId}-${item.store_id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 5 }}
          ListHeaderComponent={!isLoading || (singleStoreResult || multiStoreResult) ? (
            <HeaderComponent
              selectedChip={selectedChip}
              onChipPress={handleChipPress}
              selectedOption={selectedOption}
              onDropdownPress={handleDropdownPress}
            />
          ) : null}
          ListEmptyComponent={
            <EmptyOrErrorComponent
              isLoading={isLoading}
              error={error}
              groceries={groceries}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              selectedOption={selectedOption}
              singleStoreResult={singleStoreResult}
              multiStoreResult={multiStoreResult}
            />
          }
        />
      ) : (
        <FlatList<MultiStoreSolution>
          data={multiStoreResult?.solutions || []}
          renderItem={renderMultiStoreSolutionItem}
          keyExtractor={(item, index) => getSolutionKey(item, index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 5 }}
          ListHeaderComponent={!isLoading || (singleStoreResult || multiStoreResult) ? (
            <HeaderComponent
              selectedChip={selectedChip}
              onChipPress={handleChipPress}
              selectedOption={selectedOption}
              onDropdownPress={handleDropdownPress}
            />
          ) : null}
          ListEmptyComponent={
            <EmptyOrErrorComponent
              isLoading={isLoading}
              error={error}
              groceries={groceries}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              selectedOption={selectedOption}
              singleStoreResult={singleStoreResult}
              multiStoreResult={multiStoreResult}
            />
          }
        />
      )}


      {/* Single-Store Partial Match Modal */}
      <Modal
        visible={showPartialMatchModal && selectedOption === OPTION_SINGLE_STORE}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalBackdropPress} >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={handleModalBackdropPress} >
          <TouchableOpacity
            className="bg-white rounded-3xl mx-6 p-6 shadow-xl items-center" // Added items-center for RTL text
            activeOpacity={1}
            onPress={() => {}} >
            <Text className="text-xl font-bold text-[#08263E] text-center mb-4">
              לא נמצאה חנות עם כל המוצרים
            </Text>
            <Text className="text-base text-gray-700 text-center mb-6 leading-relaxed" >
              החנויות המוצגות מכילות רק חלק מהרשימה שלך. ניתן לראות אילו מוצרים חסרים בכל חנות.
              {"\n\n"}
              לחלופין, ניתן לחפש פתרון מרובה חנויות.
            </Text>
            <View className="w-full space-y-3">
              <TouchableOpacity
                className="border-2 border-blue-500 rounded-full py-3.5 px-6"
                onPress={handleShowOptionsAnyway} >
                <Text className="text-blue-500 text-base font-semibold text-center" >
                  הצג אפשרויות חלקיות
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 rounded-full py-3.5 px-6"
                onPress={() => {
                  setShowPartialMatchModal(false);
                  handleOptionSelect(OPTION_MULTI_STORE);
                }} >
                <Text className="text-white text-base font-semibold text-center" >
                  חפש במספר חנויות
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Dropdown for selecting optimization type */}
      <OptimizationTypeDropdown
        isVisible={isDropdownVisible}
        options={OPTIMIZATION_OPTIONS}
        selectedOption={selectedOption}
        onSelectOption={handleOptionSelect}
        onClose={() => setIsDropdownVisible(false)}
        statusBarHeight={statusBarHeight}
      />

      {/* Missing Items Modal (for single store) */}
      <CustomListModal
        title="מוצרים חסרים בחנות זו"
        visible={isMissingModalVisible}
        lists={selectedStoreMissingItems}
        loading={false}
        onClose={() => setIsMissingModalVisible(false)}
        onSelectList={onSelectListMissingItem} // Corrected prop name
      />
    </View>
  );
}
