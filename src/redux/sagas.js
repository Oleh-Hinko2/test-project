import { all, fork } from 'redux-saga/effects';

import { watchUsers } from './users';
import { watchClients } from './auth';

export default function* rootSaga() {
  yield all([
    fork(watchUsers),
    fork(watchClients)
  ]);
}
