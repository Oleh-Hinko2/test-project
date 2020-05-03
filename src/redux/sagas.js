import { all, fork } from 'redux-saga/effects';

import { watchOrders } from './orders';
import { watchCreateOrder } from './createOrder';
import { watchServices } from './services';
import { watchMaterials } from './materials';
import { watchClients } from './clients';
import { watchComings } from './comings';
import { watchCollections } from './collections';

export default function* rootSaga() {
  yield all([
    fork(watchOrders),
    fork(watchCreateOrder),
    fork(watchServices),
    fork(watchMaterials),
    fork(watchClients),
    fork(watchComings),
    fork(watchCollections)
  ]);
}
