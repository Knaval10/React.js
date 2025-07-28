import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: [],
  loading: false,
  error: false,
};
const federalSlice = createSlice({
  name: "federal",
  initialState: initialState,
  reducers: {
    fetchFederalRequest: (state) => {
      state.loading = true;
    },
    fetchFederalSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchFederalFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const { fetchFederalRequest, fetchFederalSuccess, fetchFederalFailure } =
  federalSlice.actions;

export const federalReducer = federalSlice.reducer;
export const federalSelector = (state) => state.federalReducer;
