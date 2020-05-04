import { takeEvery, put, call } from 'redux-saga/effects';
import { fetchAuth } from '../../http/auth';
import { setItem, getItem, deleteItem } from '../../helpers/storage';
import { USERS_LOAD } from '../users'

const CLIENT_LOG_IN = 'auth/CLIENT_LOG_IN';
const CLIENT_LOAD_SUCCESS = 'auth/CLIENT_LOAD_SUCCESS';
const REFRESH_TOKENS = 'auth/REFRESH_TOKENS';
const CLIENT_LOAD_UNSUCCESS = 'auth/refresh_token';
const CLIENT_LOADING = 'auth/CLIENT_LOADING'

const initialState = {
  data: [],
  logIn: false,
  loading: false
};

const defaultData = {
  grant_type: "refresh_token",
  client_id: 2,
  client_secret: "A70gUEybx2na3RqMIvpbasaWJCLIKEF6Q1FpIpo3"
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLIENT_LOAD_SUCCESS: {
      return {
        ...state,
        logIn: true,
        loading: false
      };
    }
    case CLIENT_LOAD_UNSUCCESS: {
      return {
        ...state,
        logIn: false,
        loading: false
      };
    }
    case  CLIENT_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const logInUser = data => ({ type: CLIENT_LOG_IN, data });
export const refreshTokens = () => ({ type: REFRESH_TOKENS });

//<<<WORKERS>>>
function* LogIn({data}) {
  yield put({ type: CLIENT_LOADING });
  try {
    const response = yield call(fetchAuth, data);
    if (response.status === 200) {
      yield put({ type: CLIENT_LOAD_SUCCESS });
      setItem('token', response.data.access_token)
      setItem('refresh_token', response.data.refresh_token)
    }
  } catch (error) {
    console.log(error)
  }
};


function* Refresh() {
  try {
    const response = yield call(fetchAuth, {
        refresh_token: getItem('refresh_token'),
        ...defaultData
      });
    if (response.status === 200) {
      yield put({ type: CLIENT_LOAD_SUCCESS });
      setItem('token', response.data.access_token);
      setItem('refresh_token', response.data.refresh_token);
      yield put({ type: USERS_LOAD });
    } else if (response.status === 401) {
      yield put({ type: CLIENT_LOAD_UNSUCCESS });
      deleteItem('token');
      deleteItem('refresh_token');
    }
  } catch (error) {
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchClients() {
  yield takeEvery(CLIENT_LOG_IN, LogIn);
  yield takeEvery(REFRESH_TOKENS, Refresh);
}