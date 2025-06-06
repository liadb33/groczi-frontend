import { addBookmark, fetchBookmarks, removeBookmark } from "@/utils/api/bookmarks";
import { addCartItem, fetchCart, removeCartItem, updateCartItemQuantity } from "@/utils/api/cart";
import { addListItem, createList, deleteListItem, deleteLists, fetchListDetail, fetchLists, updateListItemQuantity, updateListName } from "@/utils/api/lists";
import { mapCartResponseToCartItems } from "@/utils/mappers/cartMapper";
import { create } from "zustand";
import { fetchAllGroceries, fetchGroceryByItemCode, fetchStoresByGroceryItemCode, searchGroceries } from "@/utils/api/groceries";
import { fetchAllPromotions, fetchDiscountedGroceriesByPromotionId, fetchPromotionsByGroceryItemCode, fetchPromotionsByStore, fetchPromotionsGroupedByStore } from "@/utils/api/promotions";
import { fetchAllStores } from "@/utils/api/stores";
import { optimizeMultiStoreList, optimizeSingleStoreList } from "@/utils/api/optimization";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  storeId: null,
  chainId: null,
  subChainId: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },

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
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
        destinationAddress: address,
      storeId: storeId,
      chainId: chainId,
      subChainId: subChainId,
    }));
  },
}));


// Cart Store
export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  isLoading: false,

  setCartItems: (rawData: any) => {
    set({ cartItems: mapCartResponseToCartItems(rawData) });
  },

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await fetchCart();
      set({ cartItems: mapCartResponseToCartItems(cart) });
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: () => set({ cartItems: [] }),

  removeFromCart: async (cartItemId: string) => {
    try {
      const updatedCart = await removeCartItem(cartItemId);
      set({ cartItems: mapCartResponseToCartItems(updatedCart) });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  },

  incrementQuantity: async (cartItemId: string) => {
    try {
      const updatedCart = await updateCartItemQuantity(cartItemId, 1);
      set({ cartItems: mapCartResponseToCartItems(updatedCart) });
    } catch (error) {
      console.error("Failed to increment quantity:", error);
    }
  },

  decrementQuantity: async (cartItemId: string) => {
    try {
      const currentItem = get().cartItems.find(
        (item) => item.id === cartItemId
      );
      if (!currentItem) return;

      if (currentItem.quantity <= 1) {
        const updatedCart = await removeCartItem(cartItemId);
        set({ cartItems: mapCartResponseToCartItems(updatedCart) });
      } else {
        const updatedCart = await updateCartItemQuantity(cartItemId, -1);
        set({ cartItems: mapCartResponseToCartItems(updatedCart) });
      }
    } catch (error) {
      console.error("Failed to decrement quantity:", error);
    }
  },
  addToCart: async (itemCode: string) => {
    try {
      const cartItems = get().cartItems;
      const existingItem = cartItems.find(
        (cartItem) => cartItem.itemCode === itemCode
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = await updateCartItemQuantity(existingItem.id, 1);
      } else {
        updatedCart = await addCartItem(itemCode, 1);
      }

      set({ cartItems: mapCartResponseToCartItems(updatedCart) });
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  },
}));

// Bookmark Store
export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  isLoading: false,
  setBookmarks: (items) => set({ bookmarks: items }),

  loadBookmarks: async () => {
    set({ isLoading: true });
    try {
      const bookmarks = await fetchBookmarks();
      set({ bookmarks });
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addToBookmarks: async (itemCode) => {
    try {
      const updated = await addBookmark(itemCode);
      set({ bookmarks: updated });
    } catch (err) {
      console.error("Failed to add bookmark:", err);
    }
  },

  removeFromBookmarks: async (itemCode) => {
    try {
      const updated = await removeBookmark(itemCode);
      set({ bookmarks: updated });
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  },

  clearBookmarks: () => set({ bookmarks: [] }),
}));



// List Store
export const useListStore = create<ListStore>((set, get) => ({
  lists: [],
  isLoading: false,

  fetchAllLists: async () => {
    set({ isLoading: true });
    const data = await fetchLists();
    set({ lists: data });
    set({ isLoading: false });
  },

  addNewList: async (name: string) => {
    const newListFromServer = await createList(name); // Call the enhanced createList
    set((state) => {
      const updatedLists = [...state.lists, newListFromServer];
      return { lists: updatedLists };
    });
  },

  removeLists: async (ids: string[]) => {
    await deleteLists(ids);
    set({ lists: get().lists.filter((list) => !ids.includes(list.id)) });
  },

  renameList: async (id: string, newName: string) => {
    const updated = await updateListName(id, newName);
    set({
      lists: get().lists.map((list) =>
        list.id === id ? { ...list, name: updated.name } : list
      ),
    });
  },
}));

// Grocery Store
export const useGroceryStore = create<GroceryStore>((set) => ({
  groceries: [],
  groceriesResults: [],
  currentItem: null,
  itemStores: [],
  page: 1,
  totalPages: 1,
  isLoading: false,

  fetchGroceries: async (params) => {
    set({ isLoading: true });
    try {
      const res = await fetchAllGroceries(params);
      set({
        groceries: res.data,
        page: res.page,
        totalPages: res.totalPages,
      });
    } catch (error) {
      console.error("Failed to fetch groceries:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  search: async (term, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const res = await searchGroceries(term, page, limit);
      set((state) => ({
        groceriesResults: page === 1 ? res.data : [...state.groceriesResults, ...res.data],
        page: res.page,
        totalPages: res.totalPages,
      }));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchItemDetail: async (itemCode) => {
    try {
      const detail = await fetchGroceryByItemCode(itemCode);
      set({ currentItem: detail });
    } catch (error) {
      console.error("Failed to fetch item detail:", error);
    }
  },

  fetchItemStores: async (itemCode) => {
    try {
      const res = await fetchStoresByGroceryItemCode(itemCode);
      set({
        itemStores: res.stores,
        minPrice: res.minPrice, // ✅ store the lowest price (optional)
      });
    } catch (error) {
      console.error("Failed to fetch item stores:", error);
    }
  },
}));

// List Details Store
export const useListDetailsStore = create<ListDetailsStore>((set, get) => ({
  id: null,
  name: "",
  items: [],
  isLoading: false,

  fetchList: async (listId) => {
    set({ isLoading: true });
    try {
      const data = await fetchListDetail(listId);
      set({
        id: data.id,
        name: data.name,
        items: data.items,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch list:", error);
      set({ isLoading: false });
    }
  },

  addItem: async (itemCode, quantity) => {
    const listId = get().id;
    if (!listId) return;

    try {
      await addListItem(listId, itemCode, quantity);
      await get().fetchList(listId); // re-fetch updated list
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  },

  removeItem: async (itemCode) => {
    const listId = get().id;
    if (!listId) return;

    try {
      await deleteListItem(listId, itemCode);
      set({
        items: get().items.filter((item) => item.itemCode !== itemCode),
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  },

  clearList: () => {
    set({
      id: null,
      name: "",
      items: [],
      isLoading: false,
    });
  },

  updateItemQuantity: async (itemCode, quantityDelta) => {
    const listId = get().id;
    if (!listId) return;

    try {
      const updatedList = await updateListItemQuantity(
        listId,
        itemCode,
        quantityDelta
      );
      set({ items: updatedList.items });
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  },
}));


// Promotion Store
export const usePromotionsSummaryStore = create<PromotionsSummaryStore>((set) => ({
  promotions: [],
  discountedGroceries: [],
  isLoading: false,
  error: null,

  fetchAllPromotions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchAllPromotions();
      set({ promotions: data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Failed to fetch promotions",
        isLoading: false,
      });
    }
  },

  fetchDiscountedGroceries: async (
    promotionId,
    chainId,
    subChainId,
    storeId
  ) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchDiscountedGroceriesByPromotionId(
        promotionId,
        chainId,
        subChainId,
        storeId
      );
      set({ discountedGroceries: data.groceries ?? [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Failed to fetch discounted groceries",
        isLoading: false,
      });
    }
  },

  fetchPromotionsByStore: async (chainId, subChainId, storeId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPromotionsByStore(chainId, subChainId, storeId);
      set({ promotions: data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Failed to fetch store promotions",
        isLoading: false,
      });
    }
  },

  fetchPromotionsByGroceryItemCode: async (itemCode) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPromotionsByGroceryItemCode(itemCode);
      set({ promotions: data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Failed to fetch grocery promotions",
        isLoading: false,
      });
    }
  },

  fetchPromotionsGroupedByStore: async (
    userLat: number,
    userLon: number,
    maxStoreDistance: number
  ) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPromotionsGroupedByStore(
        userLat,
        userLon,
        maxStoreDistance
      );
      set({ promotions: data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Failed to fetch grouped promotions",
        isLoading: false,
      });
    }
  },
}));



// Stores's Store
export const useStores = create<StoreStateProps>((set) => ({
  stores: [],
  isLoading: false,
  error: null,

  fetchStores: async () => {
    set({ isLoading: true, error: null });
    try {
      const data: Store[] = await fetchAllStores();
      set({ stores: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Unknown error", isLoading: false });
    }
  },
}));


// Optimization Store
export const useOptimizationStore = create<OptimizationStore>((set) => ({
  isLoading: false,
  error: null,
  singleStoreResult: null,
  multiStoreResult: null,
  lastSingleStoreRequest: null,
  lastMultiStoreRequest: null,
  groceries: [],

  setGroceries: (items: CustomOptimizationItem[]) => set({ groceries: items }),

  runSingleStoreOptimization: async (params) => {
    set({ isLoading: true, error: null, singleStoreResult: null, lastSingleStoreRequest: params });
    try {
      const result = await optimizeSingleStoreList(params);
      set({ singleStoreResult: result, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || "Failed to optimize (single store)", isLoading: false });
    }
  },

  runMultiStoreOptimization: async (params) => {
    set({ isLoading: true, error: null, multiStoreResult: null, lastMultiStoreRequest: params });
    try {
      const result = await optimizeMultiStoreList(params);
      set({ multiStoreResult: result, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || "Failed to optimize (multi store)", isLoading: false });
    }
  },

  clearResults: () => set({ singleStoreResult: null, multiStoreResult: null }),
  clearError: () => set({ error: null }),
}));


export const useSettingsStore = create<SettingsStore>((set) => ({
  maxStoreDistance: 150,
  maxStores: 3,
  maxTravelDistance: 50,
  setMaxStoreDistance: (val) => set({ maxStoreDistance: val }),
  setMaxStores: (val) => set({ maxStores: val }),
  setMaxTravelDistance: (val) => set({ maxTravelDistance: val }),
}));