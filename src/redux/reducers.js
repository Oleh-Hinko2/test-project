import { combineReducers } from 'redux';

import createOrder from './createOrder';
import orders from './orders';
import clients from './clients';
import services from './services';
import materials from './materials';
import comings from './comings';
import pagination from './pagination';
import collections from './collections';
import notification from './notification';

const rootReducer = combineReducers({
  createOrder,
  orders,
  clients,
  services,
  materials,
  comings,
  pagination,
  collections,
  notification
});

export default rootReducer;