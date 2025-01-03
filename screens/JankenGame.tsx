import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import JankenCard from "../components/JankenCard";
import ResultWindow from "../components/ResultWindow";
import ScoreWindow from "../components/ScoreWindow";
import { useJankenGame } from "../app/hooks/useJankenGame";
import CardDetailWindow from "../components/CardDetailWindow";
import Life from "@/components/Life";
import Score from "@/components/Score";
import ResultOverlay from "@/components/ResultOverlay";
import TradeOverlay from "@/components/TradeOverlay";

export default function JankenGame({
  onBackClick,
  stageId,
}: {
  onBackClick: () => void;
  stageId: string;
}) {
  const {
    computerChoices,
    playerChoices,
    showResult,
    showScoreWindow,
    life,
    winCount,
    drawCount,
    selectedCard,
    showDetail,
    cardPositions,
    cardRefs,
    resetGame,
    closeScoreWindow,
    closeResult,
    closeCardDetail,
    handleCardPress,
    handleSwipeUp,
    showTradeOverlay,
    closeTradeOverlay,
    isResultVisible,
    isTradeVisible,
    overlayData,
  } = useJankenGame(onBackClick, stageId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.container} onPress={() => {}}>
        {/* Header */}
        <View style={styles.header}>
          <Button title="降参" onPress={resetGame} />
          <Text style={styles.headerText}>Trading Janken</Text>
        </View>

        {/* Life and Score */}
        <View style={styles.infoContainer}>
          <Life count={life} />
          <Score score={winCount} />
        </View>

        {/* Enemy Card Area */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>相手 (CPU)</Text>
          <View style={styles.cardWrapper}>
            {(computerChoices || []).map((choice, index) => (
              <JankenCard
                key={`computer-card-${index}`}
                choice={choice}
                onSwipeUp={() => {}}
                onCardPress={() => handleCardPress(choice)}
                showResult={showResult}
                selectedCard={showDetail ? selectedCard : null}
              />
            ))}
          </View>
        </View>

        {/* Play Area */}
        <View style={styles.playAreaContainer}>
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

        {/* Player Card Area */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>あなた</Text>
          <View style={styles.cardWrapper}>
            {(playerChoices || []).map((choice, index) => (
              <View
                key={`player-card-${index}-${choice.id}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
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

        {/* Score Window */}
        {showScoreWindow && (
          <ScoreWindow
            winCount={winCount}
            closeScoreWindow={closeScoreWindow}
          />
        )}

        <ResultOverlay
          isVisible={isResultVisible}
          overlayData={overlayData}
          onClose={closeResult}
        />

        <TradeOverlay
          isVisible={isTradeVisible}
          overlayData={overlayData}
          onClose={closeTradeOverlay}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  cardWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  playAreaContainer: {
    flex: 1,
    marginVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
});
