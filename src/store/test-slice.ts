import { createSlice } from "@reduxjs/toolkit";

interface TestState {
  test: boolean;
}

const initialState = {
  test: false,
} as TestState;

const { actions, reducer } = createSlice({
  name: "test",
  initialState,
  reducers: {
    toggleTest: (state: TestState) => {
      state.test = !state.test;
    },
  },
});

export const testActions = actions;
export default reducer;
