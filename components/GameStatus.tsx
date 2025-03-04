import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

type GameStatusProps = {
  life: number;
  score: number;
};

const GameStatus = ({ life, score }: GameStatusProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>LIFE</Text>
        <Text style={styles.label}>SCORE</Text>
      </View>
      <View style={styles.valueContainer}>
        <View style={styles.heartsContainer}>
          {Array.from({ length: life }).map((_, index) => (
            <Image
              key={index}
              source={require("../assets/heart-filled.png")}
              style={styles.lifeImage}
            />
          ))}
        </View>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
  },
  labelContainer: {
    width: 60,
  },
  valueContainer: {
    flex: 1,
    marginLeft: 20,
  },
  label: {
    fontSize: 18,
    height: 35,
    textAlign: "left",
  },
  heartsContainer: {
    flexDirection: "row",
    height: 35,
    alignItems: "center",
  },
  lifeImage: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  score: {
    fontSize: 18,
    height: 35,
    textAlignVertical: "center",
  },
});

export default GameStatus; 