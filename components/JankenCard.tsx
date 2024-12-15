// import "./JankenCard.css";
import { Image, View, Text } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

interface JankenCardProps {
  choice: {
    name: string;
    img: string;
    description: string;
    type: string;
    level: number;
  };
  onClick: () => void;
  onRightClick: () => void;
  isPlayerHand?: boolean;
  className?: string; // classNameを追加
}

// レベルに応じて明度を調整する関数
const adjustColorBrightness = (color: string): string => {
  const brightnessAdjustment = 1; //- level * 0.9; // レベルが高いほど色を暗くする
  const [r, g, b] = color.match(/\d+/g)!.map(Number);
  return `rgb(${Math.floor(r * brightnessAdjustment)}, ${Math.floor(
    g * brightnessAdjustment
  )}, ${Math.floor(b * brightnessAdjustment)})`;
};

export default function JankenCard({
  choice,
  onClick,
  onRightClick,
  isPlayerHand = false,
  className = "", // デフォルト値を設定
}: JankenCardProps) {
  // タイプに基づいた基本色
  const baseColor =
    {
      rock: "rgb(153, 51, 51)",
      scissors: "rgb(204, 153, 51)", // 赤系
      paper: "rgb(51, 102, 153)", // 青系
      other: "rgb(211, 211, 211)", // グレー系
    }[choice.type] || "rgb(255, 255, 255)";

  // レベルに応じて色を調整
  const borderColor = adjustColorBrightness(baseColor);
  const imageSource = choice.img ? choice.img : require("@assets/zari.png");

  const onGestureEvent = ({ nativeEvent }: { nativeEvent: PanGestureHandlerEventPayload }) => {
    if (nativeEvent.translationY < -50 && isPlayerHand) {
      onClick(); // スワイプアップで選択
    }
  };

  const handlePress = () => {
    if (isPlayerHand) {
      onRightClick();
    }
  };

  const cardContent = (
    <View
      style={{
        margin: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: borderColor,
        borderRadius: 16,
        backgroundColor: "#f9f9f9",
        width: 80,
        height: 128,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        position: "relative",
        overflow: "hidden",
      }}
      onTouchStart={handlePress}
    >
      <View
        style={{
          position: "relative",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={imageSource}
          style={{
            width: 80,
            height: 80,
            resizeMode: "contain",
          }}
        />
      </View>
      <Text style={{ marginTop: 8, fontWeight: "bold" }}>{choice.name}</Text>
    </View>
  );

  // プレイヤーの手札の場合のみスワイプ機能を追加
  return isPlayerHand ? (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        {cardContent}
      </PanGestureHandler>
    </GestureHandlerRootView>
  ) : (
    cardContent
  );
}
