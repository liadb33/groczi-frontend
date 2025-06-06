import React from 'react';
import { View, ScrollView } from 'react-native';

interface ShimmerContainerProps {
  count?: number;
  children: React.ReactElement;
  style?: any;
  contentContainerStyle?: any;
}

const ShimmerContainer: React.FC<ShimmerContainerProps> = ({ 
  count = 5, 
  children, 
  style,
  contentContainerStyle 
}) => {
  return (
    <ScrollView 
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      {Array.from({ length: count }, (_, index) => 
        React.cloneElement(children, { key: `shimmer-${index}` })
      )}
    </ScrollView>
  );
};

export default ShimmerContainer; 