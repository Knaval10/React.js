import { all } from "redux-saga/effects";
import userSaga from "../features/user/userSaga";
import postSaga from "../features/post/postSaga";

export default function* rootSaga() {
  yield all([userSaga(), postSaga()]);
}
