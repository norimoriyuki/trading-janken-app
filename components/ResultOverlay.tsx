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
      <View style={styles.overlay}>
        <View style={styles.circleContainer}>
          {/* 相手のカード */}
          <View style={[styles.circle, styles.topCircle]}>
            <Text style={styles.label}>相手 (CPU)</Text>
            {overlayData.computerCard && (
              <Image
                source={overlayData.computerCard.img}
                style={styles.cardImage}
              />
            )}
          </View>

          {/* 結果 */}
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {overlayData.result === "win"
                ? "WIN!"
                : overlayData.result === "lose"
                ? "LOSE..."
                : "あいこ"}
            </Text>
            <Text style={styles.pointText}>{getResultText()}</Text>
          </View>

          {/* 自分のカード */}
          <View style={[styles.circle, styles.bottomCircle]}>
            <Text style={styles.label}>あなた</Text>
            {overlayData.playerCard && (
              <Image
                source={overlayData.playerCard.img}
                style={styles.cardImage}
              />
            )}
          </View>
        </View>

        {/* 閉じるボタン */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>閉じる</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(237, 59, 0, 1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  topCircle: {
    marginBottom: -50, // 円が重なるように調整
  },
  bottomCircle: {
    marginTop: -50,
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
    alignItems: "center",
    marginVertical: 16,
  },
  resultText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  pointText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ResultOverlay;
