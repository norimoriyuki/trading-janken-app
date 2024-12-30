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

  const isWeb = Platform.OS === "web";

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
        (cardRefs.current[index] as View)?.measureInWindow(
          (x, y, width, height) => {
            setCardPositions((prev) => ({
              ...prev,
              [index]: {
                x: x - width / 2,
                y: y - height / 2,
              },
            }));
          }
        );
      }
    }
  };



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
    if (!showResult && playerState !== 'shuffling') {
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
          {playerState === "shuffling" ? (
            <Image
              source={require("../assets/miserarenaiyo.jpg")}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            (computerChoices || []).map((choice, index) => (
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
                  onCardPress={() => handleCardPress(choice)}
                  showResult={showResult}
                  selectedCard={showDetail ? selectedCard : null}
                />
              </View>
            ))
          )}
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
              key={`player-card-${index}-${choice.id}`}
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
                onCardPress={() => !showResult && handleCardPress(choice)}
                isPlayerHand
                showResult={showResult}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Player Info */}
      <View style={styles.playerContainer}>
        <Text style={styles.playerText}>
          {Array(life).fill('❤️').join('')}
        </Text>
        <Text style={styles.playerText}>⭐️ {winCount}</Text>
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
    marginTop: 40,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  playerInfo: {
    borderLeftWidth: 0,
    paddingLeft: 30,
    color: "black",
    width: 100,
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  playerText: {
    fontSize: 16,
    fontWeight: "bold",
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
