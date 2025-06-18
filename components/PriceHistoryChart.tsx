import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { CartesianChart, Line, Scatter } from 'victory-native';
import { useFont, SkFont, SkPoint } from '@shopify/react-native-skia';

// Interfaces for data props
interface PricePoint {
  date: string;
  price: number;
}

interface StorePriceHistory {
  store_id: string;
  store_name: string;
  prices: PricePoint[];
}

interface PriceHistoryChartProps {
  data: StorePriceHistory[];
  maxStores?: number;
   disableShuffling?: boolean;
}

// Pre-defined colors for store lines (fallback for small numbers)
export const STORE_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
];

// Sophisticated color generation for large numbers of stores
export const generateUniqueColors = (count: number): string[] => {
  if (count <= STORE_COLORS.length) {
    return STORE_COLORS.slice(0, count);
  }

  const colors: string[] = [];
  
  // Use golden ratio for optimal hue distribution
  const goldenRatio = 0.618033988749;
  
  for (let i = 0; i < count; i++) {
    // Distribute hues evenly using golden ratio for better visual separation
    const hue = (i * goldenRatio * 360) % 360;
    
    // Vary saturation and lightness for additional distinction
    const saturationBase = 65; // Base saturation for good visibility
    const lightnessBase = 50;  // Base lightness for good contrast
    
    // Add subtle variations to saturation and lightness
    const saturationVariation = (i % 3) * 10; // 0, 10, 20
    const lightnessVariation = Math.floor(i / 3) % 4 * 8; // 0, 8, 16, 24
    
    const saturation = Math.min(85, saturationBase + saturationVariation);
    const lightness = Math.max(30, Math.min(70, lightnessBase + lightnessVariation));
    
    colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
};

// Default formatter in case useMemo returns early
const defaultFormatDate = (value: number) => {
  const d = new Date(value);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
};

interface ChartMetadata {
  selectedStores: StorePriceHistory[];
  hasOnlyCurrentPrices: boolean;
  minDate: Date;
  maxDate: Date;
  totalDataPoints: number;
  isEmpty: boolean;
  formatDate: (value: number) => string;
}

// Custom hook to process chart data
export const usePriceHistoryData = (data: StorePriceHistory[], maxStores: number = 5, disableShuffling: boolean = false): ChartMetadata => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        selectedStores: [],
        hasOnlyCurrentPrices: false,
        minDate: new Date(),
        maxDate: new Date(),
        totalDataPoints: 0,
        isEmpty: true,
        formatDate: (value: number) => {
          const date = new Date(value);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          return `${day}/${month}`;
        }
      };
    }

    const storesWithData = data.filter(
      (store) => store.prices && store.prices.length > 0
    );
    
    let processedStores: StorePriceHistory[];
    if (disableShuffling) {
      // For 'all' and 'single' modes - use all stores as is
      processedStores = storesWithData;
    } else {
      // For 'top5' mode - sort by number of data points (descending)
      processedStores = [...storesWithData].sort((a, b) => b.prices.length - a.prices.length);
    }
    
    const selectedStores = processedStores.slice(
      0,
      Math.min(maxStores, storesWithData.length)
    );

    const hasOnlyCurrentPrices =
      selectedStores.length > 0 &&
      selectedStores.every((store) => store.prices.length === 1);

    const allPoints: { x: number; y: number; store_id: string }[] = [];
    selectedStores.forEach((store) => {
      store.prices.forEach((point) => {
        allPoints.push({
          x: new Date(point.date).getTime(),
          y: point.price,
          store_id: store.store_id,
        });
      });
    });

    const allDates = allPoints.map((p) => p.x);
    const minDate = allDates.length > 0 ? Math.min(...allDates) : Date.now();
    const maxDate = allDates.length > 0 ? Math.max(...allDates) : Date.now();

    const formatDate = (value: number) => {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    };

    return {
      selectedStores,
      hasOnlyCurrentPrices,
      minDate: new Date(minDate),
      maxDate: new Date(maxDate),
      totalDataPoints: allPoints.length,
      isEmpty: false,
      formatDate,
    };
  }, [data, maxStores, disableShuffling]);
};

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  data,
  maxStores = 5,
  disableShuffling = false,
}) => {
  let font: SkFont | null = null;
  let smallFont: SkFont | null = null;
  try {
    font = useFont(require('../assets/fonts/NotoSans-Black.ttf'), 12);
    smallFont = useFont(require('../assets/fonts/NotoSans-Black.ttf'), 10); // Smaller font for date labels
  } catch (error) {
    console.warn('PriceHistoryChart: Could not load font for chart axes:', error);
  }

  const {
    chartData,
    hasOnlyCurrentPrices,
    selectedStores,
    yDomain,
    xDomain,
    dynamicFormatXLabel,
    dynamicTickCount,
  } = useMemo(() => {
    if (!data || data.length === 0) {
      const now = Date.now();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return {
        chartData: [],
        selectedStores: [],
        yDomain: [0, 10] as [number, number],
        xDomain: [oneDayAgo.getTime(), now] as [number, number],
        hasOnlyCurrentPrices: false,
        dynamicFormatXLabel: defaultFormatDate,
        dynamicTickCount: 5,
      };
    }

    const storesWithData = data.filter(
      (store) => store.prices && store.prices.length > 0
    );
    
    let processedStores: StorePriceHistory[];
    if (disableShuffling) {
      // For 'all' and 'single' modes - use all stores as is
      processedStores = storesWithData;
    } else {
      // For 'top5' mode - sort by number of data points (descending)
      processedStores = [...storesWithData].sort((a, b) => b.prices.length - a.prices.length);
    }
    
    const currentSelectedStores = processedStores.slice(
      0,
      Math.min(maxStores, storesWithData.length)
    );

    const currentHasOnlyCurrentPrices =
      currentSelectedStores.length > 0 &&
      currentSelectedStores.every((store) => store.prices.length === 1);

    let allPoints: { x: number; y: number; store_id: string }[] = [];
    currentSelectedStores.forEach((store) => {
      const sortedPrices = [...store.prices].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      sortedPrices.forEach((point) => {
        allPoints.push({
          x: new Date(point.date).getTime(),
          y: point.price,
          store_id: store.store_id,
        });
      });
    });

    allPoints.sort((a, b) => a.x - b.x);

    // Filter out outlier dates from chart data (older than 1 year)
    const latestDataDate = allPoints.length > 0 ? Math.max(...allPoints.map(p => p.x)) : Date.now();
    const oneYearAgoData = latestDataDate - (1 * 365 * 24 * 60 * 60 * 1000); // 1 year in milliseconds
    
    // Filter data points to only include recent ones (within 1 year of latest date)
    const filteredPoints = allPoints.filter(point => point.x >= oneYearAgoData);
    
    // Use filtered points if we have any, otherwise use all points
    const finalDataPoints = filteredPoints.length > 0 ? filteredPoints : allPoints;

    const allDataDates = finalDataPoints.map((p) => p.x);
    const allPrices = finalDataPoints.map((p) => p.y);
    
    let finalYDomain: [number, number];
    if (allPoints.length === 0) {
      finalYDomain = [0, 10];
    } else {
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      if (minPrice === maxPrice) {
        finalYDomain = [minPrice > 0 ? minPrice -1 : minPrice -1, maxPrice + 1];
        if (minPrice === 0) finalYDomain = [-1, 1];
      } else {
        finalYDomain = [minPrice * 0.95, maxPrice * 1.05];
      }
      if (minPrice >= 0 && finalYDomain[0] < 0 && minPrice > 0.01 ) {
         finalYDomain[0] = 0;
      }
       if (finalYDomain[0] === finalYDomain[1]) {
        finalYDomain = [finalYDomain[0] === 0 ? 0 : finalYDomain[0] -1, finalYDomain[1] +1];
      }
      if(finalYDomain[0] === 0 && finalYDomain[1] === 0 && allPoints.length > 0) finalYDomain = [-1,1];
    }

    let currentXDomain: [number, number];
    let currentFormatXLabel: (value: number) => string;
    let currentTickCount: number;

    if (allDataDates.length === 0) {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      currentXDomain = [startOfCurrentMonth.getTime(), endDate.getTime()];
    } else {
      // Filter out outlier dates to avoid huge time gaps (older than 1 year)
      const latestDate = Math.max(...allDataDates);
      const oneYearAgo = latestDate - (1 * 365 * 24 * 60 * 60 * 1000); // 1 year in milliseconds
      
      // Filter dates to only include recent data (within 1 year of latest date)
      const recentDates = allDataDates.filter(date => date >= oneYearAgo);
      
      // If we have recent dates, use them; otherwise fall back to all dates
      const datesToUse = recentDates.length > 0 ? recentDates : allDataDates;
      
      const earliestDateOverall = new Date(Math.min(...datesToUse));
      const latestDateOverall = new Date(Math.max(...datesToUse));
      
      // Start from beginning of earliest month
      const startOfEarliestMonth = new Date(earliestDateOverall.getFullYear(), earliestDateOverall.getMonth(), 1);
      
      // End one month after the latest date (end of that month)
      const endOfLatestPlusOneMonth = new Date(latestDateOverall.getFullYear(), latestDateOverall.getMonth() + 1, 0, 23, 59, 59, 999);
      
      currentXDomain = [startOfEarliestMonth.getTime(), endOfLatestPlusOneMonth.getTime()];
    }

    currentFormatXLabel = (value: number) => {
      const d = new Date(value);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear().toString().slice(-2);
      return `${month}/${year}`;
    };
    
    // Calculate exact number of months in the range
    let rangeInMonths: number;
    if (allDataDates.length === 0) {
      rangeInMonths = 2;
    } else {
      const startDate = new Date(currentXDomain[0]);
      const endDate = new Date(currentXDomain[1]);
      rangeInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth()) + 1;
    }
    currentTickCount = Math.min(rangeInMonths, 8); // Cap at 8 to avoid overcrowding

    return {
      chartData: finalDataPoints,
      hasOnlyCurrentPrices: currentHasOnlyCurrentPrices,
      selectedStores: currentSelectedStores,
      yDomain: finalYDomain,
      xDomain: currentXDomain,
      dynamicFormatXLabel: currentFormatXLabel,
      dynamicTickCount: currentTickCount,
    };
  }, [data, maxStores, disableShuffling]);

  const formatPrice = (value: number) => `₪${value.toFixed(2)}`;

  const isEmpty = !data || data.length === 0 || (chartData.length === 0 && selectedStores.length === 0);

  if (isEmpty && chartData.length === 0) {
    return (
      <View className="items-center justify-center p-8" style={{ flex: 1, height: 350 }}>
        <Text className="text-gray-500 text-center">
          No price history data available
        </Text>
      </View>
    );
  }

  return (
    <View style={{ height: 350, width: 400 }}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['y']}
        padding={{ right: 50 }}
        domain={{
          x: xDomain,
          y: yDomain,
        }}
        axisOptions={{
          font: smallFont, // Use smaller font for all axis labels
          formatXLabel: dynamicFormatXLabel,
          formatYLabel: formatPrice,
          labelColor: "#374151",
          lineColor: "#d1d5db",
          tickCount: { x: dynamicTickCount, y: 5 },
        }}
      >
        {({ points, chartBounds }) => {
          const pointsByStore = new Map<string, any[]>();
          chartData.forEach((dataItem: any, i: number) => {
            const storeId = dataItem.store_id;
            if (!pointsByStore.has(storeId)) {
              pointsByStore.set(storeId, []);
            }
            if (points.y && points.y[i]) {
              pointsByStore.get(storeId)!.push(points.y[i]);
            }
          });

          const storeColors = generateUniqueColors(selectedStores.length);
          
          return (
            <>
              {selectedStores.map((store, index) => {
                const color = storeColors[index];
                const skiaStorePoints = pointsByStore.get(store.store_id) || [];
                
                if (skiaStorePoints.length === 0) return null;

                return (
                  <React.Fragment key={store.store_id}>
                    {skiaStorePoints.length > 1 && (
                      <Line
                        points={skiaStorePoints}
                        color={color}
                      />
                    )}
                    <Scatter
                      points={skiaStorePoints}
                      color={color}
                      radius={hasOnlyCurrentPrices || skiaStorePoints.length === 1 ? 5 : 3.5}
                    />
                  </React.Fragment>
                );
              })}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
}; 
