import { useEffect, useRef, useState } from "react";
import { ChoiceType, choices } from "@/app/types/models";
import { RootState } from "../stores";
import {
  resetLifeAndWinCount,
  setComputerChoices,
  setPlayerChoices,
  setPlayerState,
} from "../stores/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import getRandomChoices from "../lib/get_random_choices";
import { handlePlayerMove, handleCardChange } from "../stores/gameSlice";
import { AppDispatch } from "../stores";
import { Platform, View } from "react-native";
import { useStageUnlock } from './useStageUnlock';
import { stages } from '../types/stages';

export const useJankenGame = (onBackClick: () => void, stageId: string) => {
  const { unlockStage } = useStageUnlock();

  // Platform
  const isWeb = Platform.OS === "web";

  // State
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: "win" | "lose" | "draw";
    playerIndex: number;
    computerIndex: number;
  } | null>(null);
  const [enemyImage, setEnemyImage] = useState<string>(
    require("@assets/robot1_blue.png")
  );
  const [selectedCard, setSelectedCard] = useState<ChoiceType | null>(null);
  const [selectedCardOwner, setSelectedCardOwner] = useState<"player" | "computer" | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Overlay State
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [overlayData, setOverlayData] = useState<{
    result: "win" | "lose" | "draw" | null;
    playerCard: ChoiceType | null;
    computerCard: ChoiceType | null;
  }>({
    result: null,
    playerCard: null,
    computerCard: null,
  });

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const life = useSelector(
    (state: RootState) => state.game.stages[stageId]?.life
  );
  const winCount = useSelector(
    (state: RootState) => state.game.stages[stageId]?.winCount
  );
  const computerChoices = useSelector(
    (state: RootState) => state.game.stages[stageId]?.computerChoices
  );
  const playerChoices = useSelector(
    (state: RootState) => state.game.stages[stageId]?.playerChoices
  );
  const drawCount = useSelector(
    (state: RootState) => state.game.stages[stageId]?.drawCount
  );
  const playerState = useSelector(
    (state: RootState) => state.game.stages[stageId]?.playerState
  );

  // Refs
  const cardRefs = useRef<(View | HTMLDivElement | null)[]>([]);

  // Images
  const enemyImages = [
    require("@assets/robot1_blue.png"),
    require("@assets/robot2_green.png"),
    require("@assets/robot3.png"),
    require("@assets/robot4_orange.png"),
    require("@assets/robot5_red.png"),
    require("@assets/robot6_purple.png"),
  ];

  // New Card Indices
  const [newCardIndex, setNewCardIndex] = useState<number | null>(null);

  // Confirm Surrender
  const [showConfirmSurrender, setShowConfirmSurrender] = useState(false);

  // Functions
  const getRandomEnemyImage = () => {
    const randomImage =
      enemyImages[Math.floor(Math.random() * enemyImages.length)];
    setEnemyImage(randomImage);
  };

  const handlePlayerChoice = async (playerIndex: number) => {
    dispatch(setPlayerState({ stageId, playerState: "result" }));

    if (showResult !== null) {
      console.log("Returning early because showResult is not null");
      return;
    }

    try {
      const result = await dispatch(
        handlePlayerMove({ playerIndex, stageId })
      ).unwrap();

      await Promise.all([
        new Promise((resolve) => {
          console.log("Setting showResult with:", result);
          setShowResult({
            playerChoice: result.playerChoice,
            computerChoice: result.computerChoice,
            result: result.result,
            playerIndex: playerIndex,
            computerIndex: result.computerIndex,
          });
          resolve(true);
        }),
      ]);

      // 結果を表示
      setOverlayData({
        result: result.result,
        playerCard: result.playerChoice,
        computerCard: result.computerChoice,
      });
      setIsResultVisible(true);

      setShowResult({
        playerChoice: result.playerChoice,
        computerChoice: result.computerChoice,
        result: result.result,
        playerIndex: playerIndex,
        computerIndex: result.computerIndex,
      });

      return result;
    } catch (error) {
      console.error("Failed to handle player move:", error);
      throw error;
    }
  };

  const resetGame = () => {
    dispatch(setPlayerChoices({ stageId, playerChoices: playerChoices }));
    setComputerChoices({
      stageId,
      computerChoices: getRandomChoices(choices, 3, winCount),
    });
    dispatch(resetLifeAndWinCount({ stageId }));
    getRandomEnemyImage();
    dispatch(setPlayerState({ stageId, playerState: "thinking" }));
  };

  const closeScoreWindow = () => {
    setShowScoreWindow(false);
    onBackClick();
  };

  const closeResult = async () => {
    setIsResultVisible(false);
    setShowResult(null);
    if (life === 0) {
      setShowScoreWindow(true);
      return;
    }

    if (drawCount === 0) {
      getRandomEnemyImage();
    }

    if (life <= 0) {
      setTimeout(() => setShowScoreWindow(true), 100);
    }

    if (showResult?.result) {
      const result = await dispatch(
        handleCardChange({
          stageId,
          result: showResult.result,
          playerChoices,
          playerIndex: showResult.playerIndex,
          computerChoices,
          computerIndex: showResult.computerIndex,
          winCount,
          drawCount,
        })
      ).unwrap();
      
      // カード交換が発生した場合、新しいカードのインデックスを設定
      if (result.newPlayerIndex !== undefined) {
        setNewCardIndex(result.newPlayerIndex);
        // 少し遅延後にリセット
        setTimeout(() => setNewCardIndex(null), 1000);
      }
    }
  };

  const handleCardPress = (choice: ChoiceType) => {
    if (!showResult && playerState !== "shuffling") {
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

  // 降参確認を表示
  const handleSurrenderConfirm = () => {
    setShowConfirmSurrender(true);
  };

  // 降参実行
  const handleSurrender = () => {
    dispatch(resetLifeAndWinCount({ stageId }));
    setShowConfirmSurrender(false);
    onBackClick();
  };

  // 降参キャンセル
  const handleSurrenderCancel = () => {
    setShowConfirmSurrender(false);
  };

  // ゲーム開始時のリセット
  useEffect(() => {
    dispatch(resetLifeAndWinCount({ stageId }));
  }, []);

  // winCountが変更されたときにステージ開放チェック
  useEffect(() => {
    const checkStageUnlock = async () => {
      const currentStageId = parseInt(stageId);
      const currentStage = stages.find(s => s.id === currentStageId);
      const nextStage = stages.find(s => s.id === currentStageId + 1);
      
      // 現在のステージで必要な勝利数を達成したら次のステージを解放
      if (currentStage && nextStage && winCount >= currentStage.requiredWins) {
        console.log(`Unlocking stage ${nextStage.id} (Current wins: ${winCount})`);
        await unlockStage(nextStage.id);
      }
    };
    
    checkStageUnlock();
  }, [winCount, stageId]);

  // スコア表示時のステージ開放チェック
  useEffect(() => {
    if (showScoreWindow && winCount >= 5) {
      const currentStageId = parseInt(stageId);
      const nextStageId = currentStageId + 1;
      
      if (nextStageId <= 6) { // 最大ステージ数を超えない
        unlockStage(nextStageId);
      }
    }
  }, [showScoreWindow]);

  return {
    computerChoices,
    playerChoices,
    showResult,
    showScoreWindow,
    life,
    winCount,
    enemyImage,
    drawCount,
    playerState,
    selectedCard,
    showDetail,
    cardRefs,
    selectedCardOwner,
    handleSwipeUp,
    handleCardPress,
    closeCardDetail,
    resetGame,
    closeScoreWindow,
    closeResult,
    setSelectedCardOwner,
    isResultVisible,
    overlayData,
    newCardIndex,
    showConfirmSurrender,
    handleSurrenderConfirm,
    handleSurrender,
    handleSurrenderCancel,
  };
};
