import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DragCardPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.text}>カードを</Text>
        <Text style={styles.text}>ドラッグ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // 背景色を薄いグレーに
  },
  card: {
    width: 80,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#e0e0e0", // カードの背景を薄いグレーに
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // Android用の影
  },
  text: {
    color: "#9e9e9e", // テキスト色を薄いグレーに
    fontSize: 14,
    fontWeight: "bold",
  },
});
