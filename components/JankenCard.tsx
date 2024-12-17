import { Image, View, Text, Pressable, PanResponder, Animated } from "react-native";
import { useRef } from 'react';

interface JankenCardProps {
  choice: {
    name: string;
    img: string;
    description: string;
    type: string;
    level: number;
  };
  onSwipeUp: () => void;
  onCardPress: () => void;
  isPlayerHand?: boolean;
  className?: string;
}

const adjustColorBrightness = (color: string): string => {
  const brightnessAdjustment = 1;
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) {
    console.error('Invalid color format:', color);
    return color;
  }
  const [r, g, b] = match.map(Number);
  return `rgb(${Math.floor(r * brightnessAdjustment)}, ${Math.floor(
    g * brightnessAdjustment
  )}, ${Math.floor(b * brightnessAdjustment)})`;
};

export default function JankenCard({
  choice,
  onSwipeUp,
  onCardPress,
  isPlayerHand = false,
  className = "",
}: JankenCardProps) {
  const isSwipingRef = useRef(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: () => {
        isSwipingRef.current = true;
      },
      onPanResponderMove: isPlayerHand
        ? Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })
        : undefined,
      onPanResponderRelease: (_, gestureState) => {
        pan.setValue({ x: 0, y: 0 });
        if (isPlayerHand && gestureState.dy < -50) {
          onSwipeUp();
        } else {
          isSwipingRef.current = false;
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const handlePress = () => {
    if (!isSwipingRef.current) {
      onCardPress();
    }
  };

  const baseColor = {
    rock: "rgb(153, 51, 51)",
    scissors: "rgb(204, 153, 51)",
    paper: "rgb(51, 102, 153)",
    other: "rgb(211, 211, 211)",
  }[choice.type] || "rgb(255, 255, 255)";

  const borderColor = adjustColorBrightness(baseColor);
  const imageSource = choice.img || require("@assets/zari.png");

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        isPlayerHand && { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
    >
      <Pressable
        hitSlop={5}
        onPress={handlePress}
        style={{
          margin: 16,
          padding: 16,
          borderWidth: 2,
          borderColor: borderColor,
          borderRadius: 16,
          backgroundColor: "#f9f9f9",
          width: 80,
          height: 128,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "relative",
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={imageSource}
            style={{
              width: 80,
              height: 80,
              resizeMode: "contain",
            }}
          />
        </View>
        <Text style={{ marginTop: 8, fontWeight: "bold" }}>{choice.name}</Text>
      </Pressable>
    </Animated.View>
  );
}
