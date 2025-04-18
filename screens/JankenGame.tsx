import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import JankenCard from "../components/JankenCard";
import ScoreWindow from "../components/ScoreWindow";
import { useJankenGame } from "../app/hooks/useJankenGame";
import CardDetailWindow from "../components/CardDetailWindow";
import ResultOverlay from "@/components/ResultOverlay";
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
    cardRefs,
    selectedCardOwner,
    resetGame,
    closeScoreWindow,
    closeResult,
    closeCardDetail,
    handleCardPress,
    handleSwipeUp,
    setSelectedCardOwner,
    isResultVisible,
    overlayData,
    newCardIndex,
    showConfirmSurrender,
    handleSurrenderConfirm,
    handleSurrender,
    handleSurrenderCancel,
  } = useJankenGame(onBackClick, stageId);

  useEffect(() => {
    if (showConfirmSurrender) {
      Alert.alert(
        "降参確認",
        "本当に降参しますか？",
        [
          {
            text: "いいえ",
            style: "cancel",
            onPress: handleSurrenderCancel
          },
          {
            text: "はい",
            style: "destructive",
            onPress: handleSurrender
          }
        ]
      );
    }
  }, [showConfirmSurrender]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.container} onPress={() => {}}>
        {/* Header */}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Pressable 
              style={styles.closeButton} 
              onPress={handleSurrenderConfirm}
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
          <View style={[
            styles.cardContainer,
            showDetail && selectedCard && selectedCardOwner === 'computer' && styles.hideContainer
          ]}>
            <View style={styles.cardWrapper}>
              {(computerChoices || []).map((choice, index) => (
                <JankenCard
                  key={`computer-card-${index}`}
                  choice={choice}
                  onSwipeUp={() => {}}
                  onCardPress={() => {
                    handleCardPress(choice);
                    setSelectedCardOwner('computer');
                  }}
                  showResult={showResult}
                  selectedCard={showDetail ? selectedCard : null}
                  hide={showDetail && selectedCard && selectedCardOwner === 'computer' || false}
                />
              ))}
            </View>
          </View>

          {/* Play Area */}
          <View style={styles.playAreaContainer}>
            {showDetail && selectedCard ? (
              <CardDetailWindow 
                choice={selectedCard} 
                onClose={closeCardDetail}
                onPlay={() => handleSwipeUp(playerChoices.indexOf(selectedCard))}
                isPlayerCard={selectedCardOwner === 'player'}
                style={selectedCardOwner === 'player' ? styles.playerDetailPosition : styles.enemyDetailPosition}
              />
            ) : (
              <View style={styles.vsContainer}>
                <View style={styles.horizontalLine} />
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.horizontalLine} />
              </View>
            )}
          </View>

          {/* Player Card Area */}
          <View style={[
            styles.cardContainer, 
            showDetail && selectedCard && selectedCardOwner === 'player' && styles.hideContainer
          ]}>
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
                    onCardPress={() => {
                      if (!showResult) {
                        handleCardPress(choice);
                        setSelectedCardOwner('player');
                      }
                    }}
                    isPlayerHand
                    showResult={showResult}
                    hide={showDetail && selectedCard && selectedCardOwner === 'player' || false}
                    isNewCard={newCardIndex === index}
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
    justifyContent: 'center',
    backgroundColor: "#F5F5F5",
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 0,
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
    borderTopWidth: 4,
    borderTopColor: "#000",
    paddingTop: 16,
  },
  cardContainer: {
    height: '35%',  // 固定の高さを設定
    padding: 16,
    borderRadius: 8,
  },
  cardWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.847,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7.39,
    elevation: 5, // Androidの場合に必要
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  playAreaContainer: {
    flex: 1,        // 残りのスペースを使用
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
  playerDetailPosition: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',  // enemy cards以外の部分を使用
  },
  enemyDetailPosition: {
    top: 0,
    left: 0,
    right: 0,
    height: '65%',  // player cards以外の部分を使用
  },
  hideContainer: {
    height: 0,
    padding: 0,
    margin: 0,
  },
});
