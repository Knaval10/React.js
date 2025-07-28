## Introduction

- A library and a middleware to be used with redux or redux toolkit for handling effects such as asynchronous operations and impure taks such as accessing browser cache.

## Working mechanism

- Uses generator function to handle the asynchronous operation. # Identify the generator function with \* after function and it always uses normal function method avoiding the use of arrow function
- Handling asynchronous function (api integration):
  - Make three reducers in a slice:
    - Request function # Handles the start of the operation and pending state # dispatch the action from a particular file to notify the function to start the operation
    - Success function # Handles the success of the operation # dispatch from the saga using put effect through success block
    - Failure function # Handles the rejection state of the operation # dispatch from the saga using put effect through rejected block
- Watch generator function:
  - yield the take effect with Request action type and the generator function handling the success and failure as arguments

## Working Summary

- dispatches the operation starting action from the file and success+failure actions from the saga using put effect to the store

## Basic Effects of Redux-Saga

| Effect        | Syntax Example                                              | Notes                                             | Blocking | Purpose                                                                |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `take`        | `yield take("ACTION_TYPE")`                                 | Waits for specific action and resumes saga        | Yes      | Pauses saga until an action is dispatched                              |
| `takeEvery`   | `yield takeEvery("ACTION_TYPE", workerSaga)`                | Non-blocking; good for concurrent handling        | No       | Spawns a new saga for every matching action                            |
| `takeLatest`  | `yield takeLatest("ACTION_TYPE", workerSaga)`               | Cancels previous tasks; only latest runs          | No       | Starts the latest task and cancels any running one for the same action |
| `takeLeading` | `yield takeLeading("ACTION_TYPE", workerSaga)`              | Ignores subsequent actions until current finishes | No       | Starts the first task and ignores others until it finishes             |
| `call`        | `yield call(apiFunction, arg1, arg2)`                       | Waits for function resolution or error            | Yes      | Calls a function (usually async like API call)                         |
| `put`         | `yield put({ type: "ACTION_TYPE", payload })`               | Dispatches an action to the Redux store           | No       | Dispatches an action                                                   |
| `fork`        | `yield fork(workerSaga, args)`                              | Executes a non-blocking background task           | No       | Starts a non-blocking task (like launching a background process)       |
| `spawn`       | `yield spawn(workerSaga)`                                   | Like `fork`, but detached                         | No       | Similar to `fork` but detached; errors won’t affect parent saga        |
| `join`        | `const result = yield join(task)`                           | Waits for a forked task to finish                 | Yes      | Waits for a task started with `fork` to finish                         |
| `cancel`      | `yield cancel(task)`                                        | Stops a running task                              | No       | Cancels a running task (created with `fork`)                           |
| `cancelled`   | `if (yield cancelled()) { ... }`                            | Used in cleanup logic                             | No       | Checks if the current saga was cancelled                               |
| `all`         | `yield all([call(saga1), call(saga2)])`                     | Runs multiple effects in parallel                 | Yes      | Runs multiple effects in parallel                                      |
| `race`        | `yield race({ response: call(api), timeout: delay(5000) })` | Continues with the fastest resolving effect       | Yes      | Runs effects in parallel and proceeds with the first to complete       |
| `select`      | `const data = yield select(state => state.user.data)`       | Access Redux state                                | No       | Accesses Redux store state                                             |
| `delay`       | `yield delay(1000)`                                         | Delays saga execution                             | Yes      | Pauses the saga for a specified time                                   |
| `debounce`    | `yield debounce(500, "ACTION_TYPE", workerSaga)`            | Ignores quick repeats                             | No       | Debounces actions before calling saga                                  |
| `throttle`    | `yield throttle(2000, "ACTION_TYPE", workerSaga)`           | Limits saga execution rate                        | No       | Throttles actions to only trigger saga once in given time frame        |
