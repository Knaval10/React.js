import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../Global/store";

interface PostType {
  data: string[];
  loading: boolean;
  error: boolean;
}

const initialState: PostType = {
  data: [],
  loading: true,
  error: false,
};
const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    fetchPostRequest: (state) => {
      state.loading = true;
    },
    fetchPostSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchPostFailure: (state) => {
      state.error = true;
    },
  },
});
export const { fetchPostRequest, fetchPostSuccess, fetchPostFailure } =
  postSlice.actions;

export const postReducer = postSlice.reducer;
export const postSelector = (state: RootState): PostType => state.postReducer;
