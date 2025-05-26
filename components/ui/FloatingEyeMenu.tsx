// Simplified Example (Option 1)
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  withTiming, // Keep for press anim
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const FloatingEyeMenu: React.FC<FloatingEyeMenuProps> = ({
  onHeartPress = () => console.log("Heart pressed"),
  onPlusPress = () => console.log("Plus pressed"),
  onStarPress = () => console.log("Star pressed"),
  containerClassName = "absolute bottom-5 right-5 items-center",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animationProgress = useSharedValue(0);

  const toggleMenu = () => {
    const newValue = isOpen ? 0 : 1;
    animationProgress.value = withSpring(newValue, {
      damping: 12,
      stiffness: 100,
    });
    setIsOpen(!isOpen);
  };

  // Animate the container holding the buttons
  const menuContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
      transform: [
        {
          translateY: interpolate(
            animationProgress.value,
            [0, 1],
            [20, 0], // Start slightly lower and move up
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            animationProgress.value,
            [0, 0.5, 1],
            [0.8, 1.1, 1], // Add a little bounce effect
            Extrapolate.CLAMP
          ),
        },
      ],
      // Use opacity to hide instead of display:none for smoother transitions
      // display: animationProgress.value === 0 ? 'none' : 'flex',
    };
  });

  // --- Bonus: Button Press Animation --- (Keep this part)
  const createPressAnimationStyle = () => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
    const onPressIn = () => {
      scale.value = withTiming(0.9, { duration: 100 });
    };
    const onPressOut = () => {
      scale.value = withTiming(1, { duration: 100 });
    };
    return { style: animatedStyle, onPressIn, onPressOut };
  };

  const heartPressAnim = createPressAnimationStyle();
  const plusPressAnim = createPressAnimationStyle();
  const starPressAnim = createPressAnimationStyle();
  const eyePressAnim = createPressAnimationStyle();

  return (
    <View className={containerClassName}>
      {/* Only render buttons when potentially visible */}
      {/* Use pointerEvents to prevent interaction when closed */}
      <Animated.View
        style={menuContainerStyle}
        className="absolute bottom-[55px] right-0 items-center"
        pointerEvents={isOpen ? "auto" : "none"} // Control interactability
      >
        <View className="bg-white/90 p-1.5 rounded-full shadow-lg flex flex-col items-center">
          {/* Buttons no longer need individual animation styles */}
          <AnimatedTouchableOpacity
            style={heartPressAnim.style}
            className="w-12 h-12 rounded-full bg-blue-700 items-center justify-center shadow-md mb-1"
            onPress={onHeartPress}
            onPressIn={heartPressAnim.onPressIn}
            onPressOut={heartPressAnim.onPressOut}
            activeOpacity={0.8}
            disabled={!isOpen} // Disable when closed
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={24}
              color="#fff"
            />
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            style={plusPressAnim.style}
            className="w-12 h-12 rounded-full bg-blue-700 items-center justify-center shadow-md mb-1"
            onPress={onPlusPress}
            onPressIn={plusPressAnim.onPressIn}
            onPressOut={plusPressAnim.onPressOut}
            activeOpacity={0.8}
            disabled={!isOpen}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            style={starPressAnim.style}
            className="w-12 h-12 rounded-full bg-blue-700 items-center justify-center shadow-md"
            onPress={onStarPress}
            onPressIn={starPressAnim.onPressIn}
            onPressOut={starPressAnim.onPressOut}
            activeOpacity={0.8}
            disabled={!isOpen}
          >
            <MaterialCommunityIcons
              name="star-outline"
              size={24}
              color="#fff"
            />
          </AnimatedTouchableOpacity>
        </View>
      </Animated.View>

      {/* Eye Button (Main FAB) */}
      <AnimatedTouchableOpacity
        style={eyePressAnim.style}
        className="w-14 h-14 rounded-full bg-gray-800 items-center justify-center shadow-lg z-10"
        onPress={toggleMenu}
        onPressIn={eyePressAnim.onPressIn}
        onPressOut={eyePressAnim.onPressOut}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={isOpen ? "eye-off-outline" : "eye-outline"}
          size={28}
          color="#fff"
        />
      </AnimatedTouchableOpacity>
    </View>
  );
};

export default FloatingEyeMenu;
