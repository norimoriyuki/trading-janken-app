import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

const Life = ({ count }: { count: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>残り</Text>
      <View style={styles.heartsContainer}>
        {Array.from({ length: count }).map((_, index) => (
          <Image
            key={index}
            source={require("../assets/heart-filled.png")}
            style={styles.lifeImage}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 18,
    marginRight: 5,
    width: 50,
  },
  heartsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  lifeImage: {
    width: 25,
    height: 25,
    margin: 5,
  },
});

export default Life;
