import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Search } from "lucide-react-native";
import { searchGroceries } from "@/utils/api/groceries"; // Adjust path if needed
import { debounce } from "lodash";
import { useRouter, usePathname } from "expo-router";

interface GroceryAutocompleteInputProps {
  onSelectGrocery?: (item: DetailedGroceryItem) => void;
  placeholder?: string;
  containerStyle?: any;
  isRTL?: boolean;
  renderRightButton?: () => React.ReactNode;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
  onResultsChange?: (results: DetailedGroceryItem[]) => void;
  onSubmit?: (text: string) => void;
}

interface DetailedGroceryItem {
  itemCode: string;
  itemName?: string;
  isWeighted?: boolean;
  qtyInPackage?: string;
  unitOfMeasure?: string;
  [key: string]: any;
}

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/1046/1046869.png"; // Any icon or your app asset

const GroceryAutocompleteInput = ({
  onSelectGrocery,
  placeholder = "חיפוש מוצר...",
  containerStyle = {},
  isRTL = false,
  renderRightButton,
  onDropdownOpen,
  onDropdownClose,
  onResultsChange,
  onSubmit,
}: GroceryAutocompleteInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<DetailedGroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const prevPathRef = useRef(pathname);

  const fetchGroceries = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      onResultsChange && onResultsChange([]);
      if (onDropdownClose) onDropdownClose();
      return;
    }
    setLoading(true);
    try {
      const groceries = await searchGroceries(query,1,10);
      setResults(groceries.data);
      onResultsChange && onResultsChange(groceries.data);
      if (groceries.data.length > 0 && onDropdownOpen) {
        onDropdownOpen();
      } else if (groceries.data.length === 0 && onDropdownClose) {
        onDropdownClose();
      }
    } catch (err) {
      setResults([]);
      onResultsChange && onResultsChange([]);
      if (onDropdownClose) onDropdownClose();
    }
    setLoading(false);
  };

  // Debounce to avoid calling API on every keystroke
  const debouncedFetch = useRef(
    debounce((q: string) => fetchGroceries(q), 300)
  ).current;

  const handleChange = (text: string) => {
    setSearchText(text);
    debouncedFetch(text);
  };

  const resetSearch = () => {
    setSearchText("");
    setResults([]);
    onResultsChange && onResultsChange([]);
    if (onDropdownClose) onDropdownClose();
  };

  // Reset search when pathname changes (user navigates away)
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      resetSearch();
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const onKeyboardHide = () => {
      inputRef.current?.blur(); // Remove focus when keyboard closes
      if (onDropdownClose) onDropdownClose();
      onResultsChange && onResultsChange([]);
    };
    const keyboardHideListener = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardHide
    );

    return () => {
      keyboardHideListener.remove();
      debouncedFetch.cancel(); // Cancel any pending debounced calls
    };
  }, []);

  return (
    <View style={[{ zIndex: 1000 }, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          isRTL && { flexDirection: "row-reverse" },
        ]}
      >
        <Search size={22} color="#5382A6" style={{ marginHorizontal: 8 }} />
        <TextInput
          ref={inputRef}
          style={[styles.textInput, isRTL && { textAlign: "right" }]}
          placeholder={placeholder}
          value={searchText}
          onChangeText={handleChange}
          onSubmitEditing={() => onSubmit && onSubmit(searchText)}
          placeholderTextColor="gray"
        />
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#5382A6"
            style={{ marginRight: 10 }}
          />
        ) : renderRightButton ? (
          renderRightButton()
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 10,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    height: 45,
    marginVertical: 2,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
});

export default GroceryAutocompleteInput;
