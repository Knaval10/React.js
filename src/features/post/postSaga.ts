import { call, put, takeLatest } from "redux-saga/effects";
import { fetchPostData } from "./postAPI";
import {
  fetchPostFailure,
  fetchPostRequest,
  fetchPostSuccess,
} from "./postSlice";

function* fetchPostSaga() {
  try {
    const post = yield call(fetchPostData);
    yield put(fetchPostSuccess(post));
  } catch (error: any) {
    yield put(fetchPostFailure(error.message));
  }
}

export default function* postSaga() {
  yield takeLatest(fetchPostRequest.type, fetchPostSaga);
}
