import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { ChoiceType } from "@/app/types/models";

interface ResultOverlayProps {
  isVisible: boolean;
  overlayData: {
    result: "win" | "lose" | "draw" | null;
    playerCard: ChoiceType | null;
    computerCard: ChoiceType | null;
  };
  onClose: () => void;
}

const ResultOverlay = ({
  isVisible,
  overlayData,
  onClose,
}: ResultOverlayProps) => {
  if (!isVisible || !overlayData.result) return null;

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

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          {/* 背景の円 */}
          <View style={[
            styles.circle,
            styles.topCircle,
            overlayData.result === "win" 
              ? styles.darkCircle 
              : overlayData.result === "lose" 
                ? styles.redCircle 
                : styles.darkCircle
          ]} />
          <View style={[
            styles.circle,
            styles.bottomCircle,
            overlayData.result === "win" 
              ? styles.redCircle 
              : overlayData.result === "lose" 
                ? styles.darkCircle 
                : styles.darkCircle
          ]} />

          {/* コンテンツ */}
          <View style={styles.content}>
            {/* 相手のカード */}
            <View style={styles.cardSection}>
              <Text style={styles.label}>相手 (CPU)</Text>
              {overlayData.computerCard && (
                <Image
                  source={overlayData.computerCard.img}
                  style={styles.cardImage}
                />
              )}
            </View>

            {/* 結果 */}
            <View style={[
              styles.resultContainer, 
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

            {/* 自分のカード */}
            <View style={styles.cardSection}>
              <Text style={styles.label}>あなた</Text>
              {overlayData.playerCard && (
                <Image
                  source={overlayData.playerCard.img}
                  style={styles.cardImage}
                />
              )}
            </View>
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
  },
});

export default ResultOverlay;
