import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './reducer';

// Configure the store
export const store = configureStore({
  reducer: {
    steps: stepReducer,
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

export default store; 