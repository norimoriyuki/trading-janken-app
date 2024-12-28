import { useState } from "react";
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

export const useJankenGame = (onBackClick: () => void, stageId: string) => {
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: "win" | "lose" | "draw";
    playerIndex: number;
    computerIndex: number;
  } | null>(null);
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
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [enemyImage, setEnemyImage] = useState<string>(
    require("@assets/robot1_blue.png")
  );
  const enemyImages = [
    require("@assets/robot1_blue.png"),
    require("@assets/robot2_green.png"),
    require("@assets/robot3.png"),
    require("@assets/robot4_orange.png"),
    require("@assets/robot5_red.png"),
    require("@assets/robot6_purple.png"),
  ];
  const dispatch = useDispatch<AppDispatch>();

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
      console.log("Dispatching handlePlayerMove");
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
    }

    dispatch(setPlayerState({ stageId, playerState: "shuffling" }));
    setTimeout(() => {
      dispatch(setPlayerState({ stageId, playerState: "thinking" }));
    }, 1000);
  };

  return {
    computerChoices,
    playerChoices,
    showResult,
    showScoreWindow,
    life,
    winCount,
    isShuffling,
    enemyImage,
    drawCount,
    playerState,
    handlePlayerChoice,
    resetGame,
    closeScoreWindow,
    closeResult,
  };
};
