import {
  Image,
  View,
  Text,
  Pressable,
  PanResponder,
  Animated,
  StyleSheet,
} from "react-native";
import { useRef } from "react";
import { ChoiceType } from "../app/types/models";
import getResult from "../app/lib/get_result";

interface JankenCardProps {
  choice: ChoiceType;
  onSwipeUp: () => void;
  onCardPress: () => void;
  isPlayerHand?: boolean;
  className?: string;
  showResult: {
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
  } | null;
  selectedCard?: ChoiceType | null;
}

const adjustColorBrightness = (color: string): string => {
  const brightnessAdjustment = 1;
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) {
    console.error("Invalid color format:", color);
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
  showResult,
  selectedCard,
}: JankenCardProps) {
  const isSwipingRef = useRef(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) =>
        showResult === null &&
        (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2),
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        showResult === null &&
        (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2),
      onPanResponderGrant: () => {
        isSwipingRef.current = true;
      },
      onPanResponderMove:
        isPlayerHand && showResult === null
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
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handlePress = () => {
    if (!isSwipingRef.current) {
      onCardPress();
    }
  };

  const baseColor =
    {
      rock: "rgb(153, 51, 51)",
      scissors: "rgb(204, 153, 51)",
      paper: "rgb(51, 102, 153)",
      other: "rgb(211, 211, 211)",
    }[choice.type] || "rgb(255, 255, 255)";

  const borderColor = adjustColorBrightness(baseColor);
  const imageSource = choice.img || require("@assets/zari.png");

  const getBorderColor = () => {
    if (!selectedCard || isPlayerHand) return borderColor;

    if (getResult(selectedCard, choice) === "win") {
      return "rgb(0, 255, 0)";
    } else if (getResult(selectedCard, choice) === "lose") {
      return "rgb(255, 0, 0)";
    }
    return borderColor;
  };

  const getBorderWidth = () => {
    if (!selectedCard || isPlayerHand) return 2;

    if (
      getResult(selectedCard, choice) === "win" ||
      getResult(choice, selectedCard) === "win"
    ) {
      return 4;
    }
    return 2;
  };

  const getResultText = () => {
    if (!selectedCard || isPlayerHand) return null;

    const result = getResult(selectedCard, choice);
    if (result === "win") return "勝てる";
    if (result === "lose") return "負ける";
    return null; // 引き分けの場合は表示しない
  };

  const resultText = getResultText();

  return (
    <Animated.View
      {...(showResult === null ? panResponder.panHandlers : {})}
      style={[
        isPlayerHand &&
          showResult === null && {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
      ]}
    >
      <Pressable
        hitSlop={5}
        onPress={handlePress}
        style={[
          styles.card,
          {
            borderWidth: getBorderWidth(),
            borderColor: getBorderColor(),
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.image} />
        </View>
        {/* <Text style={styles.cardText}>{choice.name}</Text> */}
        {resultText && (
          <View style={styles.resultTextWrapper}>
            <Text style={styles.resultText}>{resultText}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    width: 80,
    height: 140,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
    overflow: "hidden",
    opacity: 1,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 1.847 },
    shadowOpacity: 0.25,
    shadowRadius: 7.39,
    elevation: 7.39, // Android 用
  },
  imageWrapper: {
    position: "relative",
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  cardText: {
    marginTop: 8,
    fontWeight: "bold",
  },
  resultTextWrapper: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
  },
  resultText: {
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});
