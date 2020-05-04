import { takeEvery, put, call } from 'redux-saga/effects';
import { fetchUsers } from '../../http/users';

export const USERS_LOAD = 'users/CLIENTS_LOAD';
const USERS_LOAD_SUCCESS = 'users/USERS_LOAD_SUCCESS';

const initialState = {
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case USERS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data
      };
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getAllUsers = () => ({ type: USERS_LOAD });

//<<<WORKERS>>>
function* getALLData() {
  try {
    const response = yield call(fetchUsers);
    if (response.status === 200) {
      yield put({ type: USERS_LOAD_SUCCESS, data: response.data });
    }
  } catch (error) {
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchUsers() {
  yield takeEvery(USERS_LOAD, getALLData);
}