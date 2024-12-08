import { useState, useEffect } from "react";
import { ChoiceType, choices } from "@/app/types/models";
import { RootState } from "../stores";
import { incrementWinCount, decrementLife, resetLifeAndWinCount } from "../stores/gameSlice";
import { useDispatch, useSelector } from "react-redux";

export const useJankenGame = (onBackClick: () => void) => {
  const DEFAULT_DRAW_COUNT = 0;
  const [computerChoices, setComputerChoices] = useState<ChoiceType[]>([]);
  const [playerChoices, setPlayerChoices] = useState<ChoiceType[]>([]);
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
  } | null>(null);
  const life = useSelector((state: RootState) => state.game.life);
  const winCount = useSelector((state: RootState) => state.game.winCount);
  const [drawCount, setDrawCount] = useState<number>(DEFAULT_DRAW_COUNT);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [enemyImage, setEnemyImage] = useState<string>(
    "../../assets/robot1_blue.png"
  );
  const enemyImages = [
    require("@assets/robot1_blue.png"),
    require("@assets/robot2_green.png"),
    require("@assets/robot3.png"),
    require("@assets/robot4_orange.png"),
    require("@assets/robot5_red.png"),
    require("@assets/robot6_purple.png"),
  ];
  const dispatch = useDispatch();

  // ゲーム結果の判定
  const getResult = (
    player: ChoiceType,
    computer: ChoiceType
  ): "win" | "lose" | "draw" => {
    if (
      player.name === computer.name ||
      player.name === "バリアー" ||
      computer.name === "バリアー"
    )
      return "draw";
    if (
      (player.type === "rock" && computer.type === "scissors") ||
      (player.type === "scissors" && computer.type === "paper") ||
      (player.type === "paper" && computer.type === "rock")
    ) {
      return "win";
    }
    if (player.level > computer.level && player.type === computer.type) {
      return "win";
    }
    return "lose";
  };

  const getRandomChoices = (
    array: ChoiceType[],
    count: number,
    winCount: number
  ): ChoiceType[] => {
    const otherWeight = 100;
    const midWeight = Math.min(150, Math.max(30 * (winCount - 2), 0));
    const bigWeight = Math.min(200, Math.max(0, 60 * (winCount - 10)));
    const barrierWeight = Math.max(
      15,
      Math.min(otherWeight, midWeight, bigWeight)
    );

    const weightedArray = [
      ...Array(otherWeight).fill(
        array.find((choice) => choice.name === "グー")
      ),
      ...Array(otherWeight).fill(
        array.find((choice) => choice.name === "チョキ")
      ),
      ...Array(otherWeight).fill(
        array.find((choice) => choice.name === "パー")
      ),
      ...Array(barrierWeight).fill(
        array.find((choice) => choice.name === "バリアー")
      ),
      ...Array(bigWeight).fill(array.find((choice) => choice.name === "村正")),
      ...Array(bigWeight).fill(array.find((choice) => choice.name === "隕石")),
      ...Array(bigWeight).fill(array.find((choice) => choice.name === "愛")),
      ...Array(midWeight).fill(
        array.find((choice) => choice.name === "ザリガニ")
      ),
      ...Array(midWeight).fill(
        array.find((choice) => choice.name === "金の玉")
      ),
      ...Array(midWeight).fill(array.find((choice) => choice.name === "札")),
    ].filter(Boolean) as ChoiceType[];

    const shuffled = weightedArray.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getRandomEnemyImage = () => {
    const randomImage =
      enemyImages[Math.floor(Math.random() * enemyImages.length)];
    setEnemyImage(randomImage);
  };

  useEffect(() => {
    if (computerChoices.length === 0) {
      setComputerChoices(getRandomChoices(choices, 3, winCount));
      setPlayerChoices(getRandomChoices(choices, 3, winCount));
    }
  }, []);

  const handlePlayerChoice = (playerIndex: number) => {
    const randomComputerIndex = Math.floor(
      Math.random() * computerChoices.length
    );
    const playerChoice = playerChoices[playerIndex];
    const computerChoice = computerChoices[randomComputerIndex];
    const result = getResult(playerChoice, computerChoice);

    const updatedPlayerChoices = [...playerChoices];
    const updatedComputerChoices = [...computerChoices];

    updatedPlayerChoices[playerIndex] = computerChoice;
    updatedComputerChoices[randomComputerIndex] = playerChoice;

    setPlayerChoices(updatedPlayerChoices);
    setComputerChoices(updatedComputerChoices);

    if (result === "win") {
      console.log("incrementWinCount");
      dispatch(incrementWinCount());
      setDrawCount(0);
    } else if (result === "lose") {
      console.log("decrementLife");
      dispatch(decrementLife());
      setDrawCount(0);
    } else {
      setDrawCount(drawCount + 1);
    }

    setShowResult({ playerChoice, computerChoice, result });
  };

  const resetGame = () => {
    setPlayerChoices(playerChoices);
    setComputerChoices(getRandomChoices(choices, 3, winCount));
    resetLifeAndWinCount();
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
      setIsShuffling(true);
      setTimeout(() => {
        setComputerChoices(getRandomChoices(choices, 3, winCount));
        setTimeout(() => setIsShuffling(false), 600);
        //   setTimeout(() => setIsEnemyImageAnimating(false), 600);
      }, 100);
    }

    if (life <= 0) {
      setTimeout(() => setShowScoreWindow(true), 100);
    }

    //   if (slidingInIndex !== null) {
    //     setTimeout(() => setSlidingInIndex(null), 600);
    //   }
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
    handlePlayerChoice,
    resetGame,
    closeScoreWindow,
    closeResult
  };
};
