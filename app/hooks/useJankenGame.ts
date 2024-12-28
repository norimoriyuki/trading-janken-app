import { useState } from "react";
import { ChoiceType, choices } from "@/app/types/models";
import { RootState } from "../stores";
import {
  resetLifeAndWinCount,
  setComputerChoices,
  setPlayerChoices,
} from "../stores/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import getRandomChoices from "../lib/get_random_choices";
import { handlePlayerMove } from "../stores/gameSlice";
import { AppDispatch } from "../stores";

export const useJankenGame = (onBackClick: () => void, stageId: string) => {
  const DEFAULT_DRAW_COUNT = 0;
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
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
  const [drawCount, setDrawCount] = useState<number>(DEFAULT_DRAW_COUNT);
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
    console.log("handlePlayerChoice called with showResult:", showResult);
    
    if (showResult !== null) {
      console.log("Returning early because showResult is not null");
      return;
    }

    try {
      console.log("Dispatching handlePlayerMove");
      const result = await dispatch(handlePlayerMove({ playerIndex, stageId })).unwrap();
      
      await Promise.all([
        new Promise(resolve => {
          console.log("Setting showResult with:", result);
          setShowResult({
            playerChoice: result.playerChoice,
            computerChoice: result.computerChoice,
            result: result.result,
            playerIndex: playerIndex,
            computerIndex: result.computerIndex
          });
          resolve(true);
        }),
        new Promise(resolve => {
          if (result.result === "draw") {
            setDrawCount(prev => prev + 1);
          } else {
            setDrawCount(0);
          }
          resolve(true);
        })
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
    resetLifeAndWinCount({ stageId });
    setDrawCount(0);
    getRandomEnemyImage();
  };

  const closeScoreWindow = () => {
    setShowScoreWindow(false);
    onBackClick();
  };

  const closeResult = () => {
    setShowResult(null);
    if (life === 0) {
      setShowScoreWindow(true);
    }

    if (drawCount === 0) {
      getRandomEnemyImage();
    }

    if (life <= 0) {
      setTimeout(() => setShowScoreWindow(true), 100);
    }

  };

  const getComputerCard = (playerIndex: number, computerIndex: number) => {
    const newPlayerChoices = [...playerChoices];
    newPlayerChoices[playerIndex] = computerChoices[computerIndex];
    dispatch(setPlayerChoices({ stageId, playerChoices: newPlayerChoices }));
  }

  const exchangePlayerAndComputerCard = (
    playerIndex: number,
    computerIndex: number
  ) => {
    const playerChoice = playerChoices[playerIndex];
    const computerChoice = computerChoices[computerIndex];

    const updatedPlayerChoices = [...playerChoices];
    const updatedComputerChoices = [...computerChoices];

    updatedPlayerChoices[playerIndex] = computerChoice;
    updatedComputerChoices[computerIndex] = playerChoice;

    dispatch(setPlayerChoices({ stageId, playerChoices: updatedPlayerChoices }));
    dispatch(setComputerChoices({ stageId, computerChoices: updatedComputerChoices }));
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
    handlePlayerChoice,
    resetGame,
    closeScoreWindow,
    closeResult,
  };
};
