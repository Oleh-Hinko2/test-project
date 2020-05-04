import { combineReducers } from 'redux';

import clients from './users';
import login from './auth';

const rootReducer = combineReducers({
  clients,
  login
});

export default rootReducer;