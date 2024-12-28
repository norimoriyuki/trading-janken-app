import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { stages } from "../types/stages";
import { ChoiceType, choices } from "@/app/types/models";
import getRandomChoices from "../lib/get_random_choices";
import getResult from "../lib/get_result";
import { RootState } from "./index";

type PlayerState = "thinking" | "result" | "shuffling" | "score";

interface StageState {
  life: number;
  winCount: number;
  computerChoices: ChoiceType[];
  playerChoices: ChoiceType[];
  drawCount: number;
  playerState?: PlayerState;
}

interface GameState {
  stages: Record<string, StageState>;
}

const DEFAULT_LIFE = 5;
const DEFAULT_WIN_COUNT = 0;
const DEFAULT_COMPUTER_CHOICES: ChoiceType[] = getRandomChoices(
  choices,
  3,
  DEFAULT_WIN_COUNT
);
const DEFAULT_PLAYER_CHOICES: ChoiceType[] = getRandomChoices(
  choices,
  3,
  DEFAULT_WIN_COUNT
);
const DEFAULT_PLAYER_STATE: PlayerState = "thinking";

const initialState: GameState = {
  stages: {},
};

// 既存のステージIDに対して初期値を設定
Object.keys(stages).forEach((stageId) => {
  initialState.stages[stageId] = {
    life: DEFAULT_LIFE,
    winCount: DEFAULT_WIN_COUNT,
    computerChoices: DEFAULT_COMPUTER_CHOICES,
    playerChoices: DEFAULT_PLAYER_CHOICES,
    drawCount: 0,
    playerState: DEFAULT_PLAYER_STATE,
  };
});

/**
 * プレイヤーが手を選んだとき: 勝敗判定とスコア更新のみ実施
 *  → カード更新は handleCardChange に分離
 */
export const handlePlayerMove = createAsyncThunk<
  {
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: "win" | "lose" | "draw";
    computerIndex: number;
    playerIndex: number; // どのカードを使ったか
  },
  { playerIndex: number; stageId: string }
>(
  "game/handlePlayerMove",
  async ({ playerIndex, stageId }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const currentStage = state.game.stages[stageId];
    if (!currentStage) {
      throw new Error("Stage not found");
    }

    const { playerChoices, computerChoices, drawCount } = currentStage;
    const randomComputerIndex = Math.floor(
      Math.random() * computerChoices.length
    );

    const playerChoice = playerChoices[playerIndex];
    const computerChoice = computerChoices[randomComputerIndex];
    const result = getResult(playerChoice, computerChoice);

    // ▼ 勝敗判定に応じてスコアだけ更新
    if (result === "win") {
      dispatch(incrementWinCount({ stageId }));
      dispatch(setDrawCount({ stageId, drawCount: 0 }));
    } else if (result === "lose") {
      dispatch(decrementLife({ stageId }));
      dispatch(setDrawCount({ stageId, drawCount: 0 }));
    } else {
      // draw
      if (drawCount >= 2) {
        dispatch(setDrawCount({ stageId, drawCount: 0 }));
        dispatch(incrementWinCount({ stageId }));
      } else {
        dispatch(setDrawCount({ stageId, drawCount: drawCount + 1 }));
      }
    }

    return {
      playerChoice,
      computerChoice,
      result,
      computerIndex: randomComputerIndex,
      playerIndex,
    };
  }
);

/**
 * カードの更新のみ担当:
 *  - 勝ち/負け/引き分け3回目 → プレイヤーがコンピュータのカードを獲得 & コンピュータ手札リセット
 *  - 通常の引き分け         → それぞれカードを交換
 */
export const handleCardChange = createAsyncThunk<
  void,
  {
    stageId: string;
    result: "win" | "lose" | "draw";
    playerChoices: ChoiceType[];
    playerIndex: number;
    computerChoices: ChoiceType[];
    computerIndex: number;
    winCount: number;
    drawCount: number;
  }
>(
  "game/handleCardChange",
  async (
    {
      stageId,
      result,
      playerChoices,
      playerIndex,
      computerChoices,
      computerIndex,
      winCount,
      drawCount,
    },
    { dispatch }
  ) => {
    // ▼ カードの更新だけ行う
    if (
      result === "win" ||
      result === "lose" ||
      (drawCount == 0 && result === "draw")
    ) {
      // プレイヤーがコンピュータのカードを獲得
      const newPlayerChoices = [...playerChoices];
      newPlayerChoices[playerIndex] = computerChoices[computerIndex];
      dispatch(setPlayerChoices({ stageId, playerChoices: newPlayerChoices }));
      console.log("Player got computer's card");
      console.log("Player's new hand:", newPlayerChoices);

      // コンピュータの手札を新しくシャッフル
      const newComputerChoices = getRandomChoices(choices, 3, winCount);
      dispatch(
        setComputerChoices({ stageId, computerChoices: newComputerChoices })
      );
      console.log("Computer's new hand:", newComputerChoices);
    } else {
      // 通常の引き分け → カード交換
      const newPlayerChoices = [...playerChoices];
      const newComputerChoices = [...computerChoices];
      newPlayerChoices[playerIndex] = computerChoices[computerIndex];
      newComputerChoices[computerIndex] = playerChoices[playerIndex];

      dispatch(setPlayerChoices({ stageId, playerChoices: newPlayerChoices }));
      dispatch(
        setComputerChoices({ stageId, computerChoices: newComputerChoices })
      );
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setLife(state, action: PayloadAction<{ stageId: string; life: number }>) {
      const { stageId, life } = action.payload;
      if (!state.stages[stageId]) {
        state.stages[stageId] = {
          life: DEFAULT_LIFE,
          winCount: DEFAULT_WIN_COUNT,
          computerChoices: DEFAULT_COMPUTER_CHOICES,
          playerChoices: DEFAULT_PLAYER_CHOICES,
          drawCount: 0,
        };
      }
      state.stages[stageId].life = life;
    },
    incrementWinCount(state, action: PayloadAction<{ stageId: string }>) {
      const { stageId } = action.payload;
      if (!state.stages[stageId]) {
        state.stages[stageId] = {
          life: DEFAULT_LIFE,
          winCount: DEFAULT_WIN_COUNT,
          computerChoices: DEFAULT_COMPUTER_CHOICES,
          playerChoices: DEFAULT_PLAYER_CHOICES,
          drawCount: 0,
        };
      }
      state.stages[stageId].winCount += 1;
    },
    decrementLife(state, action: PayloadAction<{ stageId: string }>) {
      const { stageId } = action.payload;
      if (!state.stages[stageId]) {
        state.stages[stageId] = {
          life: DEFAULT_LIFE,
          winCount: DEFAULT_WIN_COUNT,
          computerChoices: DEFAULT_COMPUTER_CHOICES,
          playerChoices: DEFAULT_PLAYER_CHOICES,
          drawCount: 0,
        };
      }
      state.stages[stageId].life -= 1;
    },
    resetLifeAndWinCount(state, action: PayloadAction<{ stageId: string }>) {
      const { stageId } = action.payload;
      state.stages[stageId] = {
        life: DEFAULT_LIFE,
        winCount: DEFAULT_WIN_COUNT,
        computerChoices: DEFAULT_COMPUTER_CHOICES,
        playerChoices: DEFAULT_PLAYER_CHOICES,
        drawCount: 0,
      };
    },
    setComputerChoices(
      state,
      action: PayloadAction<{
        stageId: string;
        computerChoices: ChoiceType[];
      }>
    ) {
      const { stageId, computerChoices } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].computerChoices = [...computerChoices];
    },
    setPlayerChoices(
      state,
      action: PayloadAction<{
        stageId: string;
        playerChoices: ChoiceType[];
      }>
    ) {
      const { stageId, playerChoices } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].playerChoices = [...playerChoices];
    },
    setDrawCount(
      state,
      action: PayloadAction<{ stageId: string; drawCount: number }>
    ) {
      const { stageId, drawCount } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].drawCount = drawCount;
    },
    setPlayerState(
      state,
      action: PayloadAction<{ stageId: string; playerState: PlayerState }>
    ) {
      const { stageId, playerState } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].playerState = playerState;
    },
  },
  extraReducers: (builder) => {
    // ここで handlePlayerMove, handleCardChange の完了後にさらに処理が必要なら追加
  },
});

export const {
  setLife,
  incrementWinCount,
  decrementLife,
  resetLifeAndWinCount,
  setComputerChoices,
  setPlayerChoices,
  setDrawCount,
  setPlayerState,
} = gameSlice.actions;

export default gameSlice.reducer;
