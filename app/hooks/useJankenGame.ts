import { useState } from "react";
import { ChoiceType, choices } from "@/app/types/models";
import { RootState } from "../stores";
import {
  incrementWinCount,
  decrementLife,
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
  // const [computerChoices, setComputerChoices] = useState<ChoiceType[]>([]);
  // const [playerChoices, setPlayerChoices] = useState<ChoiceType[]>([]);
  const [gameSceneState, setGameSceneState] = useState<
    "choosing" | "janken_result" | "game_result"
  >("choosing");
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
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

  // useEffect(() => {
  //   if (computerChoices.length === 0) {
  //     setComputerChoices({stageId, computerChoices: getRandomChoices(choices, 3, winCount)});
  //     setPlayerChoices({stageId, playerChoices: getRandomChoices(choices, 3, winCount)});
  //   }
  // }, []);

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
            result: result.result
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
      // setIsEnemyImageAnimating(true);
      // setIsShuffling(true);
      // setTimeout(() => {
      //   setComputerChoices({
      //     stageId,
      //     computerChoices: getRandomChoices(choices, 3, winCount),
      //   });
      //   setTimeout(() => setIsShuffling(false), 600);
      //   //   setTimeout(() => setIsEnemyImageAnimating(false), 600);
      // }, 100);
    }

    if (life <= 0) {
      setTimeout(() => setShowScoreWindow(true), 100);
    }

    //   if (slidingInIndex !== null) {
    //     setTimeout(() => setSlidingInIndex(null), 600);
    //   }
  };

  const updateGameSceneState = () => {
    console.log("ゲームシーンの状態を更新します。現在の状態:", gameSceneState);
    if (gameSceneState === "choosing") {
      setGameSceneState("janken_result");
    }
    if (gameSceneState === "janken_result") {
      if (life === 0) {
        setGameSceneState("game_result");
      } else {
        setGameSceneState("choosing");
      }
    }
    console.log("更新後のゲームシーンの状態:", gameSceneState);
  };

  const updatePlayerScore = (result: "win" | "lose" | "draw") => {
    //console.log("プレイヤーのスコアを更新します。結果:", result);
    if (result === "win") {
      dispatch(incrementWinCount({ stageId }));
    } else if (result === "lose") {
      dispatch(decrementLife({ stageId }));
    }
  }

  const updatePlayerAndComputerChoices = (
    result: "win" | "lose" | "draw",
    playerIndex: number,
    computerIndex: number
  ) => {
    //console.log("プレイヤーとコンピュータの選択を更新します。結果:", result, "プレイヤーのインデックス:", playerIndex, "コンピュータのインデックス:", computerIndex);
    if (result === "win" || (drawCount >= 2 && result === "draw")) {
      getComputerCard(playerIndex, computerIndex);
      shuffleComputerChoices();
      setDrawCount(0);
      //console.log("更新後のドロー回数win:", 0);
    } else if (result === "lose") {
      getComputerCard(playerIndex, computerIndex);
      shuffleComputerChoices();
      setDrawCount(0);
      //console.log("更新後のドロー回数 lose:", 0);
    } else {
      setDrawCount(prevDrawCount => prevDrawCount + 1);
      exchangePlayerAndComputerCard(playerIndex, computerIndex);
      //console.log("更新後のドロー回数 draw:", drawCount + 1);
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
    //console.log("プレイヤーとコンピュータのカードを交換します。プレイヤーのインデックス:", playerIndex, "コンピュータのインデックス:", computerIndex);
    const playerChoice = playerChoices[playerIndex];
    const computerChoice = computerChoices[computerIndex];

    const updatedPlayerChoices = [...playerChoices];
    const updatedComputerChoices = [...computerChoices];

    updatedPlayerChoices[playerIndex] = computerChoice;
    updatedComputerChoices[computerIndex] = playerChoice;

    dispatch(setPlayerChoices({ stageId, playerChoices: updatedPlayerChoices }));
    dispatch(setComputerChoices({ stageId, computerChoices: updatedComputerChoices }));
    //console.log("更新後のプレイヤーの選択:", updatedPlayerChoices);
    //console.log("更新後のコンピュータの選択:", updatedComputerChoices);
  };

  const shuffleComputerChoices = () => {
    //console.log("コンピュータの選択をシャッフルします。");
    //console.log("シャッフル前のコンピュータの選択:", computerChoices);
    const newComputerChoices = getRandomChoices(choices, 3, winCount);
    //console.log("シャッフル後のコンピュータの選択:", newComputerChoices);
    dispatch(setComputerChoices({
      stageId,
      computerChoices: newComputerChoices,
    }));
    //console.log("シャッフル後のコンピュータの選択:", computerChoices);
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
