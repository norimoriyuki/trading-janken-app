import {
  Image,
  View,
  Text,
  Pressable,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRef, useEffect } from "react";
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
  hide?: boolean;
  isNewCard?: boolean;
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.25;
const CARD_HEIGHT = CARD_WIDTH * 1.75;

const JankenCard: React.FC<JankenCardProps> = ({
  choice,
  onSwipeUp,
  onCardPress,
  isPlayerHand = false,
  className = "",
  showResult,
  selectedCard,
  hide = false,
  isNewCard = false,
}) => {
  if (hide) return null;

  const isSwipingRef = useRef(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isNewCard) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNewCard]);

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
      onPanResponderMove: (_, gestureState) => {
        if (isPlayerHand && showResult === null) {
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy
          });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isPlayerHand && gestureState.dy < -50) {
          onSwipeUp();
        }
        
        // 位置をリセット
        pan.setValue({ x: 0, y: 0 });
        isSwipingRef.current = false;
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
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

  const imageSource = choice.img || require("@assets/zari.png");

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
            transform: [
              { translateX: pan.x }, 
              { translateY: pan.y },
              { scale: scale },
            ],
          },
        !isPlayerHand && {
          transform: [{ scale: scale }],
        },
      ]}
    >
      <Pressable
        hitSlop={5}
        onPress={handlePress}
        style={[
          styles.card,
          {
            borderWidth: 0,
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.image} />
        </View>
        {resultText && (
          <View style={styles.resultTextWrapper}>
            <Text style={styles.resultText}>{resultText}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#fff",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
    overflow: "hidden",
    opacity: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  imageWrapper: {
    position: "relative",
    width: CARD_WIDTH * 0.8,
    height: CARD_WIDTH * 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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

export default JankenCard;
