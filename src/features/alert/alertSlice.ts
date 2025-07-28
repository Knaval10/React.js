import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: [],
  loading: false,
  error: false,
};
const alertSlice = createSlice({
  name: "alert",
  initialState: initialState,
  reducers: {
    fetchAlertRequest: (state) => {
      state.loading = true;
    },
    fetchAlertSuccess: (state, action) => {
      (state.loading = false), (state.data = action.payload);
    },
    fetchAlertFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
  },
});
export const { fetchAlertRequest, fetchAlertSuccess, fetchAlertFailure } =
  alertSlice.actions;
export const alertReducer = alertSlice.reducer;
export const alertSelector = (state) => state.alertReducer;
