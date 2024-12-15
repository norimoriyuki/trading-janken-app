import { Image, View, Text, Pressable, PanResponder, GestureResponderEvent, PanResponderGestureState } from "react-native";
import { useState, useRef } from 'react';

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
  const [r, g, b] = color.match(/\d+/g)!.map(Number);
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
  const [hasTriggeredSwipe, setHasTriggeredSwipe] = useState(false);
  const isSwipingRef = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        setHasTriggeredSwipe(false);
        isSwipingRef.current = false;
      },

      onPanResponderMove: (_, gestureState) => {
        if (
          gestureState.dy < -50 && 
          isPlayerHand && 
          !hasTriggeredSwipe && 
          !isSwipingRef.current
        ) {
          isSwipingRef.current = true;
          onSwipeUp();
          setHasTriggeredSwipe(true);
        }
      },

      onPanResponderRelease: () => {
        setHasTriggeredSwipe(false);
        isSwipingRef.current = false;
      },

      onPanResponderTerminate: () => {
        setHasTriggeredSwipe(false);
        isSwipingRef.current = false;
      },
    })
  ).current;

  const baseColor =
    {
      rock: "rgb(153, 51, 51)",
      scissors: "rgb(204, 153, 51)",
      paper: "rgb(51, 102, 153)",
      other: "rgb(211, 211, 211)",
    }[choice.type] || "rgb(255, 255, 255)";

  const borderColor = adjustColorBrightness(baseColor);
  const imageSource = choice.img ? choice.img : require("@assets/zari.png");

  const handlePress = () => {
    onCardPress();
  };

  return (
    <View {...panResponder.panHandlers}>
      <Pressable
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
    </View>
  );
}
