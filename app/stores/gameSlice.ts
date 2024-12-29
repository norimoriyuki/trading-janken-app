import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { stages } from "../types/stages";
import { ChoiceType, choices } from "@/app/types/models";
import getRandomChoices from "../lib/get_random_choices";
import getResult from "../lib/get_result";
import { RootState } from "./index";

interface StageState {
  life: number;
  winCount: number;
  computerChoices: ChoiceType[];
  playerChoices: ChoiceType[];
  drawCount: number;
}

interface GameState {
  stages: Record<string, StageState>;
}

const DEFAULT_LIFE = 5;
const DEFAULT_WIN_COUNT = 0;
const DEFAULT_COMPUTER_CHOICES: ChoiceType[] = getRandomChoices(choices, 3, DEFAULT_WIN_COUNT);
const DEFAULT_PLAYER_CHOICES: ChoiceType[] = getRandomChoices(choices, 3, DEFAULT_WIN_COUNT);

const initialState: GameState = {
  stages: {},
};

Object.keys(stages).forEach((stageId) => {
  initialState.stages[stageId] = {
    life: DEFAULT_LIFE,
    winCount: DEFAULT_WIN_COUNT,
    computerChoices: DEFAULT_COMPUTER_CHOICES,
    playerChoices: DEFAULT_PLAYER_CHOICES,
    drawCount: 0,
  };
});

export const handlePlayerMove = createAsyncThunk<
  {
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: "win" | "lose" | "draw";
    computerIndex: number;
  },
  { playerIndex: number; stageId: string }
>(
  'game/handlePlayerMove',
  async ({ playerIndex, stageId }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const currentStage = state.game.stages[stageId];
    
    if (!currentStage) {
      throw new Error("Stage not found");
    }

    const { playerChoices, computerChoices, drawCount } = currentStage;
    const randomComputerIndex = Math.floor(Math.random() * computerChoices.length);
    
    const playerChoice = playerChoices[playerIndex];
    const computerChoice = computerChoices[randomComputerIndex];
    const result = getResult(playerChoice, computerChoice);

    // スコアの更新
    if (result === "win") {
      dispatch(incrementWinCount({ stageId }));
      dispatch(setDrawCount({ stageId, drawCount: 0 }));
    } else if (result === "lose") {
      dispatch(decrementLife({ stageId }));
      dispatch(setDrawCount({ stageId, drawCount: 0 }));
    } else if (result === "draw") {
      if (drawCount >= 2) {
        dispatch(setDrawCount({ stageId, drawCount: 0 }));
        dispatch(incrementWinCount({ stageId }));
      } else {
        dispatch(setDrawCount({ stageId, drawCount: drawCount + 1 }));
      }
    }

    // カードの更新
    if (result === "win" || result === "lose" || (drawCount >= 2 && result === "draw")) {
      // プレイヤーがコンピュータのカードを獲得
      const newPlayerChoices = [...playerChoices];
      newPlayerChoices[playerIndex] = computerChoice;
      dispatch(setPlayerChoices({ stageId, playerChoices: newPlayerChoices }));
      
      // コンピュータの手を新しくシャッフル
      const newComputerChoices = getRandomChoices(choices, 3, currentStage.winCount);
      dispatch(setComputerChoices({ stageId, computerChoices: newComputerChoices }));
    } else {
      // 引き分けの場合はカードを交換
      const newPlayerChoices = [...playerChoices];
      const newComputerChoices = [...computerChoices];
      
      newPlayerChoices[playerIndex] = computerChoice;
      newComputerChoices[randomComputerIndex] = playerChoice;
      
      dispatch(setPlayerChoices({ stageId, playerChoices: newPlayerChoices }));
      dispatch(setComputerChoices({ stageId, computerChoices: newComputerChoices }));
    }

    return {
      playerChoice,
      computerChoice,
      result,
      computerIndex: randomComputerIndex
    };
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
      action: PayloadAction<{ stageId: string; computerChoices: ChoiceType[] }>
    ) {
      const { stageId, computerChoices } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].computerChoices = [...computerChoices];
    },
    setPlayerChoices(
      state,
      action: PayloadAction<{ stageId: string; playerChoices: ChoiceType[] }>
    ) {
      const { stageId, playerChoices } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].playerChoices = playerChoices;
    },
    setDrawCount(state, action: PayloadAction<{ stageId: string; drawCount: number }>) {
      const { stageId, drawCount } = action.payload;
      if (!state.stages[stageId]) {
        throw new Error("Stage not found");
      }
      state.stages[stageId].drawCount = drawCount;
    }
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
} = gameSlice.actions;
export default gameSlice.reducer;
