export interface ChoiceType {
  name: string;
  img: any;
  description: string;
  type: ChoiceTypeEnum;
  level: number;
}

export type ChoiceTypeEnum = "rock" | "scissors" | "paper" | "other";

export const choices: ChoiceType[] = [
  {
    name: "グー",
    img: require("@assets/rock.png"),
    description: "ふつうのグー",
    type: "rock",
    level: 0,
  },
  {
    name: "チョキ",
    img: require("@assets/scissors.png"),
    description: "ふつうのチョキ",
    type: "scissors",
    level: 0,
  },
  {
    name: "パー",
    img: require("@assets/paper.png"),
    description: "ふつうのパー",
    type: "paper",
    level: 0,
  },
  {
    name: "金の玉",
    img: require("@assets/kintama.png"),
    description: "高位のグー。グーに勝つ",
    type: "rock",
    level: 1,
  },
  {
    name: "ザリガニ",
    img: require("@assets/zari.png"),
    description: "高位のチョキ。チョキに勝つ",
    type: "scissors",
    level: 1,
  },
  {
    name: "札",
    img: require("@assets/money.png"),
    description: "高位のパー。パーに勝つ",
    type: "paper",
    level: 1,
  },
  {
    name: "隕石",
    img: require("@assets/meteor.png"),
    description: "最高位のグー。他のグー系に勝つ",
    type: "rock",
    level: 2,
  },
  {
    name: "村正",
    img: require("@assets/muramasa.png"),
    description: "最高位のチョキ。他のチョキ系に勝つ",
    type: "scissors",
    level: 2,
  },
  {
    name: "愛",
    img: require("@assets/love.png"),
    description: "最高位のパー。他のパー系に勝つ",
    type: "paper",
    level: 2,
  },
  {
    name: "バリアー",
    img: require("@assets/barrier.png"),
    description: "どの手ともあいこになる",
    type: "other",
    level: 0,
  },
];

export type Choice = (typeof choices)[number]["name"];
