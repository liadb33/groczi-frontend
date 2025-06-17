declare interface GoogleInputProps {
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  placeholder?: string;
  enableAutoComplete?: boolean;
  renderRightButton?: () => React.ReactElement;
  isRTL?: boolean;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  storeId: string | null;
  chainId: string | null;
  subChainId: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
    storeId,
    chainId,
    subChainId,
  }: {
    latitude?: number;
    longitude?: number;
    address?: string;
    storeId?: string;
    chainId?: string;
    subChainId?: string;
  }) => void;
}

// Cart Store
declare interface CartStore {
  cartItems: CartItemType[];
  isLoading: boolean;
  setCartItems: (rawData: any) => void;
  loadCart: () => Promise<void>;
  clearCart: () => void;
  removeFromCart: (cartItemId: string) => Promise<void>;
  incrementQuantity: (cartItemId: string) => Promise<void>;
  decrementQuantity: (cartItemId: string) => Promise<void>; 
  addToCart: (itemCode: string) => Promise<void>;
}

declare interface BookmarkStore {
  bookmarks: SavedGroceryItemType[];
  isLoading: boolean;
  setBookmarks: (items: SavedGroceryItemType[]) => void;
  loadBookmarks: () => Promise<void>;
  addToBookmarks: (itemCode: string) => Promise<void>;
  removeFromBookmarks: (itemCode: string) => Promise<void>;
  clearBookmarks: () => void;
}


// List Store
declare interface ListStore {
  lists: ListItem[];
  isLoading: boolean;
  fetchAllLists: () => Promise<void>;
  addNewList: (name: string) => Promise<void>;
  removeLists: (ids: string[]) => Promise<void>;
  renameList: (id: string, newName: string) => Promise<void>;
};

// List Details Store
declare interface ListDetailsStore {
  id: string | null;
  name: string;
  items: DetailedListItem[];
  isLoading: boolean;

  fetchList: (listId: string) => Promise<void>;
  addItem: (itemCode: string, quantity: number) => Promise<void>;
  removeItem: (itemCode: string) => Promise<void>;
  clearList: () => void;
  updateItemQuantity: (
    itemCode: string,
    quantityDelta: number
  ) => Promise<void>;
}

// Grocery Store
declare interface GroceryStore {
  groceries: DetailedGroceryItem[];
  groceriesResults: SavedGroceryItemType[];
  priceHistory: StorePriceHistory[];
  currentItem: DetailedGroceryItem | null;
  itemStores: GroceryStoreInfoProps[];
  minPrice?: String;
  page: number;
  totalPages: number;
  isLoading: boolean;
  // Pagination fields for item stores
  storesPage: number;
  storesTotalPages: number;
  storesHasNextPage: boolean;
  isLoadingStores: boolean;

  fetchGroceries: (params?: {
    minPrice?: number;
    maxPrice?: number;
    company?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  search: (term: string, page?: number, limit?: number) => Promise<void>;
  fetchItemDetail: (itemCode: string) => Promise<void>;
  fetchItemStores: (itemCode: string, page?: number, limit?: number) => Promise<void>;
  loadMoreStores: (itemCode: string) => Promise<void>;
  fetchPriceHistory: (itemCode: string) => Promise<void>;
};

declare interface PricePoint {
  date: string; // ISO string
  price: number;
}

declare interface StorePriceHistory {
  store_id: string;
  store_name: string;
  prices: PricePoint[];
}

// Grocery Store Info
declare interface GroceryStoreInfoProps {
  itemCode: string;
  ChainId: string;
  SubChainId: string;
  StoreId: string;
  itemPrice: string; // or number if you cast it
  allowDiscount: boolean;
  StoreName: string;
  Address: string;
  City: string;
  distance?: number; // Distance in kilometers when user coordinates are provided
  subchains?: {
    imageUrl?: string;
    SubChainName?: string;
  };
}

// Grocery Autocomplete Input
interface GroceryAutocompleteInputProps {
  onSelectGrocery: (item: DetailedGroceryItem) => void;
  placeholder?: string;
  containerStyle?: object;
  isRTL?: boolean;
  renderRightButton?: () => React.ReactNode;
}


// Grocery Item Info
declare interface DetailedGroceryItem {
  itemCode: string;
  itemType?: number;
  itemName?: string | null;
  manufacturerName?: string | null;
  imageUrl?: string | null;
  unitQty?: string | null;
  unitOfMeasure?: string | null;
  isWeighted?: boolean;
  qtyInPackage?: number | null;
  unitOfMeasurePrice?: string; 
  quantity?: string; 
}


// Cart Types
declare interface CartItemType {
  id: string;
  itemCode: string;
  name: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  quantity: number;
  subtotal?: string;
}

declare interface CartItemProps {
  item: CartItemType;
  onIncrease: (itemId: string) => void;
  onDecrease: (itemId: string) => void;
  onImagePress: (itemId: string) => void;
  onPress?: (item: CartItemType) => void;
}


declare interface SavedGroceryItemType {
  id: string;
  itemCode: string;
  itemName: string;
  price: string;
  unitQty: string;
  quantity: string;
  isWeighted: boolean;
  qtyInPackage: number | null;
  category: string;
  imageUrl: string;
}

declare interface GrocerySavedCardProps {
  item: SavedGroceryItemType;
  onAddToCart: (item: SavedGroceryItemType) => void;
  onImagePress: (item: SavedGroceryItemType) => void;
}



// Grocery Top Item
declare interface GroceryResultCardProps {
  itemCode: number;
  name: string;
  category: string;
  weight: string;
  price: string;
  image: string;
  bookmarked: boolean;
  onAddToCart?: () => void;
  onToggleBookmark?: () => void;
  onPress?: () => void;
  isRTL?: boolean;
  addToCartText?: string;
  categoryLabel?: string;
}

declare interface QuickFiltersProps {
  filters: string[];
  onFilterPress?: (filter: string) => void;
  isRTL?: boolean;
}

declare interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
}

declare interface LocationHeaderProps {
  location: string;
  onLocationPress?: () => void;
  onQRCodePress?: () => void;
  onSettingsPress?: () => void;
  className?: string;
  isRTL?: boolean;
  locationLabel?: string;
}

declare interface FloatingEyeMenuProps {
  onHeartPress?: () => void;
  onPlusPress?: () => void;
  onStarPress?: () => void;
  containerClassName?: string;
}

// List Types
declare interface ListItem {
  id: string;
  name: string;
  itemCount: number;
  estimatedMinPrice: string;
}

declare interface DetailedListItem {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  subtotal: string;
}

declare interface CategoryListProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
  isRTL?: boolean;
}

declare interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  selectedCategories: string[];
  toggleCategorySelection: (category: string) => void;
  priceRange: { min: number; max: number };
  selectedCompany: string;
  availableCategories?: string[];
  isRTL?: boolean;
  applyButtonText?: string;
  resetButtonText?: string;
  filterTitle?: string;
}

declare interface ListsHeaderProps {
  isEditMode: boolean;
  selectedListIds: string[];
  onToggleEditMode: () => void;
  onNavigateBack: () => void;
  onAddList: () => void;
  onDeleteSelected: () => void;
}

declare interface ListItemProps {
  item: ListItem;
  isEditMode: boolean;
  isSelected: boolean;
  onNavigate: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

declare interface AddListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  listName: string;
  onChangeListName: (text: string) => void;
}

declare interface ListFooterProps {
  onAddList: () => void;
}


// Promotion Types
declare interface PromotionItem {
  promotionId: string;
  promotionName: string;
  startDate: string;
  endDate: string;
}

declare interface PromotionItemProps {
  promotion: { 
    promotionName: string; 
    endDate: string; 
  };
  isRTL: boolean;
  onPromotionPress?: (promotion: { promotionName: string; endDate: string; }) => void;
}

// Type for a store with its promotions
declare interface StoreWithPromotions {
  chainId: string;
  subChainId: string;
  storeId: string;
  storeName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  promotions: PromotionItem[];
}

declare interface PromotionsSummaryStore {
  promotions: any[];
  discountedGroceries: any[];
  isLoading: boolean;
  error: string | null;

  fetchAllPromotions: () => Promise<void>;
  fetchDiscountedGroceries: (
    promotionId: string,
    chainId: string,
    subChainId: string,
    storeId: string
  ) => Promise<void>;
  fetchPromotionsByStore: (
    chainId: string,
    subChainId: string,
    storeId: string
  ) => Promise<void>;
  fetchPromotionsByGroceryItemCode: (itemCode: string) => Promise<void>;
  fetchPromotionsGroupedByStore: (
    userLat: number,
    userLon: number,
    maxStoreDistance: number
  ) => Promise<void>;
}

// Store Types
declare interface Store {
  ChainId: string;
  SubChainId: string;
  StoreId: string;
  StoreType?: number | null;
  StoreName?: string | null;
  Address?: string | null;
  City?: string | null;
  Latitude?: number | null;
  Longitude?: number | null;
  subchains?: {
    imageUrl?: string;
    SubChainName?: string;
  };
}

declare interface StoreStateProps {
  stores: Store[];
  isLoading: boolean;
  error: string | null;
  fetchStores: () => Promise<void>;
}


// Optimization Types
declare interface CustomOptimizationItem {
  itemCode: string;
  quantity: number;
  itemName?: string;
}

declare interface OptimizeSingleStoreListRequestBody {
  userLatitude: number;
  userLongitude: number;
  items: CustomOptimizationItem[];
  costPerDistanceUnit?: number;
  lambdaTravel?: number;
  maxStoreDistance?: number;
}

declare interface OptimizeMultiStoreListRequestBody {
  userLatitude: number;
  userLongitude: number;
  items: CustomOptimizationItem[];
  costPerDistanceUnit?: number;
  lambdaTravel?: number;
  maxStores?: number;
  maxTravelDistance?: number;
  maxStoreDistance?: number;
}

declare interface ItemInListEvaluation {
  itemCode: string;
  itemName: string;
  quantity: number;
  priceAtThisStore: number;
}

declare interface SingleStoreEvaluation {
  store_id: string;
  store_name: string;
  address: string;
  latitude: number;
  longitude: number;
  chainId: string;
  subChainId: string;
  city: string;
  combined_score: number;
  item_cost_at_store: number;
  travel_cost_to_store: number;
  distance_to_store_km: number;
  items_in_list: ItemInListEvaluation[];
  missing_items: string[];
}

declare interface RankedStoresOptimizationResult {
  is_partial_match: boolean;
  ranked_stores: SingleStoreEvaluation[];
}

declare interface MultiStoreSolution {
  assignments: {
    [storeNameOrId: string]: {
      store_id: string;
      address: string;
      latitude: number;
      longitude: number;
      chainId: string;
      subChainId: string;
      city: string;
      items: {
        itemCode: string;
        itemName: string;
        quantity: number;
        price: number;
      }[];
    };
  } | null;
  total_cost: number;
  item_cost: number;
  travel_cost: number;
}

declare interface TopMultiStoreSolutionsResult {
  solutions: MultiStoreSolution[];
}

declare interface OptimizationStore {
  isLoading: boolean;
  error: string | null;
  singleStoreResult: RankedStoresOptimizationResult | null;
  multiStoreResult: TopMultiStoreSolutionsResult | null;
  lastSingleStoreRequest: OptimizeSingleStoreListRequestBody | null;
  lastMultiStoreRequest: OptimizeMultiStoreListRequestBody | null;
  groceries: CustomOptimizationItem[];

  setGroceries: (items: CustomOptimizationItem[]) => void;
  runSingleStoreOptimization: (
    params: OptimizeSingleStoreListRequestBody
  ) => Promise<void>;
  runMultiStoreOptimization: (
    params: OptimizeMultiStoreListRequestBody
  ) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

// Settings Store
declare interface SettingsStore {
  maxStoreDistance: number;
  maxStores: number;
  maxTravelDistance: number;
  setMaxStoreDistance: (val: number) => void;
  setMaxStores: (val: number) => void;
  setMaxTravelDistance: (val: number) => void;
}


// Category Types

declare interface CategoryStore {
  categories: string[];
  selectedCategories: string[];
  groceries: GroceryItem[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  groceryCountByCategory: number | null;

  fetchGroceryCountByCategory: (category: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchGroceriesByCategory: (
    categories: string[],
    page?: number,
    limit?: number
  ) => Promise<void>;
}