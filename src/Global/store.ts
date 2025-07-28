import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import userSaga from "../features/user/userSaga";
import { userReducer } from "../features/user/userSlice";
import { postReducer } from "../features/post/postSlice";
import { alertReducer } from "../features/alert/alertSlice";
import postSaga from "../features/post/postSaga";
import alertSaga from "../features/alert/alertSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    userReducer,
    postReducer,
    alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(userSaga);
sagaMiddleware.run(postSaga);
sagaMiddleware.run(alertSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
