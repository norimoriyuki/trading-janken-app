import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../app/stores";

export default function ResultScreen() {
  const winCount = useSelector((state: RootState) => state.game.stages["stage1"]?.winCount);

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <Text style={styles.header}>リザルト</Text>

      {/* スコアセクション */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreText}>あなたのスコア</Text>
        <Text style={styles.score}>{winCount}点</Text>
      </View>

      {/* ランクとメッセージ */}
      <View style={styles.rankSection}>
        <Text style={styles.rank}>あなたは2位です！</Text>
        <Text style={styles.congrats}>おめでとう！</Text>
      </View>

      {/* アバター表示 */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>アバター</Text>
        </View>
      </View>

      {/* ボタンセクション */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>スコアで登録</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>登録しない</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 10,
  },
  score: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ff6347",
  },
  rankSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4682b4",
  },
  congrats: {
    fontSize: 16,
    color: "#2e8b57",
  },
  avatarContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#4682b4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
