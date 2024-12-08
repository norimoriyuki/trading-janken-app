import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  life: number;
  winCount: number;
}

const DEFAULT_LIFE = 5;
const DEFAULT_WIN_COUNT = 0;

const initialState: GameState = {
  life: DEFAULT_LIFE,
  winCount: DEFAULT_WIN_COUNT,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setLife(state, action: PayloadAction<number>) {
      state.life = action.payload;
    },
    incrementWinCount(state) {
      console.log("incrementWinCount");
      console.log(state.winCount);
      state.winCount += 1;
    },
    decrementLife(state) {
      console.log("decrementLife");
      console.log(state.life);
      state.life -= 1;
    },
    resetLifeAndWinCount(state) {
      state.life = DEFAULT_LIFE;
      state.winCount = DEFAULT_WIN_COUNT;
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
