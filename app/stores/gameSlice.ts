import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stages } from "../types/stages";
import { ChoiceType, choices } from "@/app/types/models";
import getRandomChoices from "../lib/get_random_choices";

interface StageState {
  life: number;
  winCount: number;
  computerChoices: ChoiceType[];
  playerChoices: ChoiceType[];
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
  };
});

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
  },
});

export const {
  setLife,
  incrementWinCount,
  decrementLife,
  resetLifeAndWinCount,
  setComputerChoices,
  setPlayerChoices,
} = gameSlice.actions;
export default gameSlice.reducer;
