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
import ResultOverlay from "@/components/ResultOverlay";
import TradeOverlay from "@/components/TradeOverlay";
import DragCardPlaceholder from "@/components/DragCardPlaceholder";
import GameStatus from "../components/GameStatus";

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
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Pressable 
              style={styles.closeButton} 
              onPress={resetGame}
            >
              <Image 
                source={require("@/assets/closeButton.png")} 
                style={styles.closeIcon} 
              />
            </Pressable>
            <Pressable 
              style={styles.ruleButton} 
              onPress={() => {/* ルールを表示する処理 aaa*/}}
            >
              <Text style={styles.ruleButtonText}>ルール</Text>
            </Pressable>
          </View>

          {/* Enemy Card Area */}
          <View style={styles.cardContainer}>
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
            ) : showDetail && selectedCard ? (
              <CardDetailWindow choice={selectedCard} onClose={closeCardDetail} />
            ) : (
              <View style={styles.vsContainer}>
                <View style={styles.horizontalLine} />
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.horizontalLine} />
              </View>
            )}
          </View>

          {/* Player Card Area */}
          <View style={styles.cardContainer}>
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
        </View>

        {/* Life and Score */}
        <View style={styles.infoContainer}>
          <GameStatus life={life} score={winCount} />
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
    justifyContent: 'space-between',
    backgroundColor: "#F5F5F5",
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    width: "100%",
    height: "100%",
  },
  ruleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  ruleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 16,
    margin: 0,
  },
  cardContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
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
    padding: 16,
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(195, 195, 195, 0.30)',
  },
  vsText: {
    color: 'rgba(195, 195, 195, 0.30)',
    fontFamily: 'Noto Sans',
    fontSize: 52.397,
    fontWeight: '700',
    marginHorizontal: 16,
  },
});
