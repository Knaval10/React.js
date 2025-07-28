import { call, put, takeLatest } from "redux-saga/effects";
import { fetchAlertData } from "./alertAPI";
import {
  fetchAlertFailure,
  fetchAlertRequest,
  fetchAlertSuccess,
} from "./alertSlice";

function* fetchAlertSaga() {
  try {
    const alert = yield call(fetchAlertData);
    yield put(fetchAlertSuccess(alert));
  } catch (error) {
    yield put(fetchAlertFailure(error));
  }
}
export default function* alertSaga() {
  yield takeLatest(fetchAlertRequest.type, fetchAlertSaga);
}
