import { Text, View } from "react-native";
import Counter from "../components/Counter";
import ShowDog from "../components/ShowDog";
import { Link, Stack } from 'expo-router';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>💩</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/jankengame">Go to Janken Game</Link>
      <Link href="/result">Go to Result</Link>
      
      <Counter />
      <ShowDog />
    </View>
  );
}
