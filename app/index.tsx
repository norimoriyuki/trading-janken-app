import { View } from "react-native";
import Home from "./home";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View>
      <Home />
      <View>
        <Link href="/jankengame">Go to Janken Game</Link>
        <Link href="/result">Go to Result</Link>
      </View>
    </View>
  ); 
}