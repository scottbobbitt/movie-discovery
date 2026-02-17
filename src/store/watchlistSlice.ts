import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMovie } from "@/types";

export interface IWatchlistMovie extends IMovie {
  category: string;
}

const STORAGE_KEY = "watchlist";

const loadFromStorage = (): IWatchlistMovie[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: IWatchlistMovie[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: loadFromStorage(),
  reducers: {
    addToWatchlist: (state, action: PayloadAction<IWatchlistMovie>) => {
      const exists = state.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
        saveToStorage(state);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      const next = state.filter((item) => item.id !== action.payload);
      saveToStorage(next);
      return next;
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
