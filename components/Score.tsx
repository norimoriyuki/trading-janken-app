import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Score = ({ score }: { score: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SCORE</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 20,
    marginRight: 5,
  },
  score: {
    fontSize: 18,
  },
});

export default Score;
