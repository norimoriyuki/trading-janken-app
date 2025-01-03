import React from "react";
import { View, Text, StyleSheet, Modal, Image, Pressable } from "react-native";
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

const ResultOverlay = ({ isVisible, overlayData, onClose }: ResultOverlayProps) => {
  if (!isVisible || !overlayData.result) return null;

  const getResultStyle = () => {
    switch (overlayData.result) {
      case "win":
        return styles.win;
      case "lose":
        return styles.lose;
      default:
        return styles.draw;
    }
  };

  const getResultText = () => {
    switch (overlayData.result) {
      case "win":
        return "WIN!";
      case "lose":
        return "LOSE...";
      default:
        return "DRAW";
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.cpuLabel}>相手 (CPU)</Text>
          {overlayData.computerCard && (
            <Image source={overlayData.computerCard.img} style={styles.cardImage} />
          )}
          <Text style={[styles.resultText, getResultStyle()]}>{getResultText()}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
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
  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  cpuLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
    marginBottom: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  win: {
    color: "green",
  },
  lose: {
    color: "red",
  },
  draw: {
    color: "gray",
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#2196F3",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ResultOverlay;
