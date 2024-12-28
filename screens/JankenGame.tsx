import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import JankenCard from "../components/JankenCard";
import ResultWindow from "../components/ResultWindow";
import ScoreWindow from "../components/ScoreWindow";
import { useJankenGame } from "../app/hooks/useJankenGame";
import { ChoiceType } from "../app/types/models";
import CardDetailWindow from "../components/CardDetailWindow";

export default function JankenGame({
  onBackClick,
  stageId,
}: {
  onBackClick: () => void;
  stageId: string;
  playerChoices: ChoiceType[];
}) {
  const {
    computerChoices,
    playerChoices,
    showResult,
    showScoreWindow,
    life,
    winCount,
    enemyImage,
    drawCount,
    playerState,
    handlePlayerChoice,
    resetGame,
    closeScoreWindow,
    closeResult,
  } = useJankenGame(onBackClick, stageId);

  const [selectedCard, setSelectedCard] = useState<ChoiceType | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [cardPositions, setCardPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  const cardRefs = useRef<(View | HTMLDivElement | null)[]>([]);

  const updateCardPosition = (index: number) => {
    if (cardRefs.current[index]) {
      if (isWeb) {
        const rect = (
          cardRefs.current[index] as HTMLDivElement
        )?.getBoundingClientRect();
        if (rect) {
          setCardPositions((prev) => ({
            ...prev,
            [index]: {
              x: rect.x - window.innerWidth / 2,
              y: rect.y - window.innerHeight / 2,
            },
          }));
        }
      } else {
        (cardRefs.current[index] as View)?.measure(
          (x, y, width, height, pageX, pageY) => {
            setCardPositions((prev) => ({
              ...prev,
              [index]: {
                x: pageX - width / 2,
                y: pageY - height / 2,
              },
            }));
          }
        );
      }
    }
  };

  // プラットフォーム判定
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    const updateAllCardPositions = () => {
      playerChoices.forEach((_, index) => {
        updateCardPosition(index);
      });
    };

    updateAllCardPositions();

    // リサイズイベントのリスナーを追加
    if (isWeb) {
      window.addEventListener("resize", updateAllCardPositions);
      return () => window.removeEventListener("resize", updateAllCardPositions);
    }
  }, [playerChoices]);

  const handleCardPress = (choice: ChoiceType) => {
    if (!showResult) {
      // リザルト表示中は詳細を表示しない
      setSelectedCard(choice);
      setShowDetail(true);
    }
  };

  const handleSwipeUp = async (index: number) => {
    await handlePlayerChoice(index);
    setShowDetail(false);
    setSelectedCard(null);
  };

  const closeCardDetail = () => {
    setShowDetail(false);
    setSelectedCard(null);
  };

  return (
    <Pressable style={styles.container} onPress={() => {}}>
      <View>
        <Text>Player State: {playerState}</Text>
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Button title="降参" onPress={resetGame} />
        <Text style={styles.headerText}>Trading Janken</Text>
      </View>

      {/* Enemy Section */}
      <View style={styles.enemyContainer}>
        <Text style={styles.enemyText}>ランダムロボ</Text>
        <Image
          source={
            typeof enemyImage === "string" ? { uri: enemyImage } : enemyImage
          }
          style={styles.enemyImage}
        />
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Computer Cards */}
        <View style={styles.cardContainer}>
          {(computerChoices || []).map((choice, index) => (
            <View
              key={index}
              style={{
                opacity:
                  showResult && showResult.computerIndex === index ? 0 : 1,
              }}
            >
              <JankenCard
                choice={choice}
                onSwipeUp={() => {}}
                onCardPress={() => !showResult && handleCardPress(choice)}
                showResult={showResult}
              />
            </View>
          ))}
        </View>

        {/* Play Area */}
        <View style={styles.playArea}>
          {showResult ? (
            <ResultWindow
              showResult={showResult}
              closeResult={closeResult}
              drawCount={drawCount}
              startPosition={cardPositions[showResult.playerIndex]}
            />
          ) : (
            showDetail &&
            selectedCard && (
              <CardDetailWindow
                choice={selectedCard}
                onClose={closeCardDetail}
              />
            )
          )}
        </View>

        {/* Player Cards */}
        <View style={styles.cardContainer}>
          {(playerChoices || []).map((choice, index) => (
            <View
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{
                opacity: showResult && showResult.playerIndex === index ? 0 : 1,
              }}
            >
              <JankenCard
                choice={choice}
                onSwipeUp={() => handleSwipeUp(index)}
                onCardPress={() => handleCardPress(choice)}
                isPlayerHand
                showResult={showResult}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Player Info */}
      <View style={styles.playerContainer}>
        <Text style={styles.playerText}>ライフ: {life}</Text>
        <Text style={styles.playerText}>勝利数: {winCount}</Text>
        <Text style={styles.playerText}>引き分け: {drawCount}</Text>
      </View>

      {showScoreWindow && (
        <ScoreWindow winCount={winCount} closeScoreWindow={closeScoreWindow} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    width: "100%",
    backgroundColor: "black",
    color: "white",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
  },
  enemyContainer: {
    display: "flex",
    alignItems: "center",
    margin: 10,
  },
  enemyText: {
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 5,
  },
  enemyImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  cardContainer: {
    height: "30%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  playerContainer: {
    marginTop: 20,
    alignItems: "center",
    transform: [{ translateX: -50 }],
  },
  playerImage: {
    width: "20%",
    height: "15%",
    resizeMode: "contain",
  },
  playerInfo: {
    borderLeftWidth: 0,
    paddingLeft: 30,
    marginLeft: -20,
    color: "black",
    width: 100,
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  playerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lifeContainer: {
    margin: -5,
  },
  winContainer: {
    margin: -5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxWidth: "80%",
    textAlign: "center",
  },
  gameArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  playArea: {
    height: "40%", // 固定の高さを確保
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  playAreaPlaceholder: {
    width: "100%",
    height: "100%",
  },
});
