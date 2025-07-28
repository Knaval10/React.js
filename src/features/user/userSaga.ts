import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchUsersFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
} from "./userSlice";
import { fetchUserApi } from "./userAPI";

function* fetchUserSaga() {
  try {
    const user = yield call(fetchUserApi);
    yield put(fetchUsersSuccess(user));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUserSaga);
}
