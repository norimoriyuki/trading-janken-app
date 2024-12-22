import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stages } from "../types/stages";

interface StageState {
  life: number;
  winCount: number;
}

interface GameState {
  stages: Record<string, StageState>;
}

const DEFAULT_LIFE = 5;
const DEFAULT_WIN_COUNT = 0;

const initialState: GameState = {
  stages: {},
};

Object.keys(stages).forEach((stageId) => {
  initialState.stages[stageId] = { life: DEFAULT_LIFE, winCount: DEFAULT_WIN_COUNT };
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setLife(state, action: PayloadAction<{ stageId: string; life: number }>) {
      const { stageId, life } = action.payload;
      if (!state.stages[stageId]) {
        state.stages[stageId] = { life: DEFAULT_LIFE, winCount: DEFAULT_WIN_COUNT };
      }
      state.stages[stageId].life = life;
    },
    incrementWinCount(state, action: PayloadAction<{ stageId: string }>) {
      const { stageId } = action.payload;
      if (!state.stages[stageId]) {
        state.stages[stageId] = { life: DEFAULT_LIFE, winCount: DEFAULT_WIN_COUNT };
      }
      state.stages[stageId].winCount += 1;
    },
    decrementLife(state, action: PayloadAction<{ stageId: string }>) {
      const { stageId } = action.payload;
      if (!state.stages[stageId]) {
        state.stages[stageId] = { life: DEFAULT_LIFE, winCount: DEFAULT_WIN_COUNT };
      }
      state.stages[stageId].life -= 1;
    },
    resetLifeAndWinCount(state, action: PayloadAction<{ stageId: string }>) {
      const { stageId } = action.payload;
      state.stages[stageId] = { life: DEFAULT_LIFE, winCount: DEFAULT_WIN_COUNT };
    },
  },
});

export const {
  setLife,
  incrementWinCount,
  decrementLife,
  resetLifeAndWinCount,
} = gameSlice.actions;
export default gameSlice.reducer;
