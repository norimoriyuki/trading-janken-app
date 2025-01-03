import React from "react";
import { View, Text, StyleSheet, Modal, Image, Pressable } from "react-native";
import { ChoiceType } from "@/app/types/models";

interface TradeOverlayProps {
  isVisible: boolean;
  overlayData: {
    playerCard: ChoiceType | null;
    computerCard: ChoiceType | null;
  };
  onClose: () => void;
}

const TradeOverlay = ({ isVisible, overlayData, onClose }: TradeOverlayProps) => {
  if (!isVisible || !overlayData.playerCard || !overlayData.computerCard) return null;

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.tradeLabel}>カードトレード</Text>
          <View style={styles.cardRow}>
            <View style={styles.cardContainer}>
              <Text style={styles.cardOwner}>相手 (CPU)</Text>
              <Image source={overlayData.computerCard.img} style={styles.cardImage} />
            </View>
            <View style={styles.cardContainer}>
              <Text style={styles.cardOwner}>あなた</Text>
              <Image source={overlayData.playerCard.img} style={styles.cardImage} />
            </View>
          </View>
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
  tradeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  cardContainer: {
    alignItems: "center",
  },
  cardOwner: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
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

export default TradeOverlay;
