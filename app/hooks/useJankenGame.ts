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

export const useJankenGame = (onBackClick: () => void, stageId: string) => {
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
  const [showDetail, setShowDetail] = useState(false);
  const [cardPositions, setCardPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  // Overlay State
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isTradeVisible, setIsTradeVisible] = useState(false);
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
      await dispatch(
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
    }
  };

  const showTradeOverlay = (
    playerCard: ChoiceType,
    computerCard: ChoiceType
  ) => {
    setOverlayData({ result: null, playerCard, computerCard });
    setIsTradeVisible(true);
  };

  const closeTradeOverlay = () => {
    setIsTradeVisible(false);
  };

  const handleCardPress = (choice: ChoiceType) => {
    if (!showResult && playerState !== "shuffling") {
      setSelectedCard(choice);
      setShowDetail(true);
    }
  };

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

  const handleSwipeUp = async (index: number) => {
    await handlePlayerChoice(index);
    setShowDetail(false);
    setSelectedCard(null);
  };

  const closeCardDetail = () => {
    setShowDetail(false);
    setSelectedCard(null);
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
    cardPositions,
    cardRefs,
    handleSwipeUp,
    handleCardPress,
    closeCardDetail,
    resetGame,
    closeScoreWindow,
    closeResult,
    showTradeOverlay,
    closeTradeOverlay,
    isResultVisible,
    isTradeVisible,
    overlayData,
  };
};
