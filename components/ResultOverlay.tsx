import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { ChoiceType } from "@/app/types/models";
import tradeIcon from '@/assets/tradeButton.png';

interface ResultOverlayProps {
  isVisible: boolean;
  overlayData: {
    result: "win" | "lose" | "draw" | null;
    playerCard: ChoiceType | null;
    computerCard: ChoiceType | null;
  };
  onClose: () => void;
}

// 状態の型定義
type DisplayState = "result" | "trade" | "done" | null;

const ResultOverlay: React.FC<ResultOverlayProps> = ({ isVisible, onClose, overlayData }) => {
  const [displayState, setDisplayState] = useState<DisplayState>("result");
  const flipAnimationPlayer = useRef(new Animated.Value(0)).current;
  const flipAnimationComputer = useRef(new Animated.Value(0)).current;

  const startFlipAnimation = () => {
    Animated.parallel([
      Animated.timing(flipAnimationPlayer, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnimationComputer, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      flipAnimationPlayer.setValue(0);
      flipAnimationComputer.setValue(0);
    });
  };

  const handlePress = () => {
    switch (displayState) {
      case "result":
        setDisplayState("trade");
        break;
      case "trade":
        setDisplayState("done");
        startFlipAnimation();
        break;
      case "done":
        onClose();
        // 1秒後に result 状態に戻す
        setTimeout(() => {
          setDisplayState("result");
        }, 1000);
        break;
    }
  };

  const getResultText = () => {
    switch (overlayData.result) {
      case "win":
        return "+1pt";
      case "lose":
        return "- ❤️";
      case "draw":
        return "+0pt";
      default:
        return "";
    }
  };

  const getDisplayContent = () => {
    switch (displayState) {
      case "result":
        return (
          <>
            <View style={[
              styles.resultBox, 
              overlayData.result === "win" 
                ? styles.winBackground 
                : overlayData.result === "lose" 
                  ? styles.loseBackground 
                  : styles.drawBackground
            ]}>
              <Text style={styles.resultText}>
                {overlayData.result === "win"
                  ? "WIN!"
                  : overlayData.result === "lose"
                  ? "LOSE..."
                  : "あいこ"}
              </Text>            
            </View>
            <Text style={styles.resultText}>{getResultText()}</Text>
          </>
        );
      case "trade":
        return (
          <Image 
            source={tradeIcon} 
            style={styles.tradeIcon}
          />
        );
      case "done":
        return (
          <View style={[styles.resultBox, styles.tradeBackground]}>
            <Text style={styles.resultText}>Traded</Text>
          </View>
        );
    }
  };

  const getCardContent = (isPlayer: boolean) => {
    const showSwappedCards = displayState === "done";
    const card = showSwappedCards
      ? (isPlayer ? overlayData.computerCard : overlayData.playerCard)
      : (isPlayer ? overlayData.playerCard : overlayData.computerCard);

    const flipAnimation = isPlayer ? flipAnimationPlayer : flipAnimationComputer;
    const rotateY = flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '90deg', '180deg'],
    });
    const opacity = flipAnimation.interpolate({
      inputRange: [0, 0.5, 0.5, 1],
      outputRange: [1, 0, 0, 1],
    });

    return (
      <View style={styles.cardSection}>
        <Animated.View style={[
          styles.cardContainer,
          {
            transform: [{ rotateY }],
            opacity,
          }
        ]}>
          {card && (
            <Image
              source={card.img}
              style={styles.cardImage}
            />
          )}
        </Animated.View>
      </View>
    );
  };

  // Modalの表示条件を変更
  const shouldShowModal = isVisible && displayState !== null;

  return (
    <Modal transparent={true} visible={shouldShowModal} animationType="fade">
      <Pressable style={styles.overlay} onPress={handlePress}>
        <View style={styles.container}>
          {/* 背景の円 */}
          <View style={[
            styles.circle,
            styles.topCircle,
            displayState === "done" 
              ? styles.tradeBackground
              : overlayData.result === "win" 
                ? styles.darkCircle 
                : overlayData.result === "lose" 
                  ? styles.redCircle 
                  : styles.darkCircle
          ]} />
          <View style={[
            styles.circle,
            styles.bottomCircle,
            displayState === "done"
              ? styles.tradeBackground
              : overlayData.result === "win" 
                ? styles.redCircle 
                : overlayData.result === "lose" 
                  ? styles.darkCircle 
                  : styles.darkCircle
          ]} />

          {/* コンテンツ */}
          <View style={styles.content}>
            {getCardContent(false)}
            <View style={styles.resultContainer}>
              {getDisplayContent()}
            </View>
            {getCardContent(true)}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    height: "50%",
    aspectRatio: 1,
    borderRadius: 999,
  },
  redCircle: {
    backgroundColor: "#ED3B00",
  },
  darkCircle: {
    backgroundColor: "#434343",
  },
  topCircle: {
    top: "-15%",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  bottomCircle: {
    bottom: "-15%",
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
  content: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  cardSection: {
    alignItems: "center",
  },
  cardContainer: {
    backfaceVisibility: 'hidden',
    perspective: '1000',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultBox: {
    padding: 20,
    borderRadius: 80,
    alignItems: 'center',
  },
  winBackground: {
    backgroundColor: "#ED3B00",
  },
  loseBackground: {
    backgroundColor: "#282828",
  },
  drawBackground: {
    backgroundColor: "#282828", // 引き分けの場合も負けと同じ背景色を使用
  },
  resultText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 30, // fontSize と同じ値で 100% になります
    textAlign: "center",
    marginTop: 10,
  },
  tradeIcon: {
    width: 138,
    height: 138,
  },
  tradeBackground: {
    backgroundColor: "#26C150",
  },
});

export default ResultOverlay;
