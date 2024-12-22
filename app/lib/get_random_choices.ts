import { ChoiceType } from "../types/models";

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

export default getRandomChoices;
