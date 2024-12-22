import { ChoiceType } from "../types/models";

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

export default getResult;
