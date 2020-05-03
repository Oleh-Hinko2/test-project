import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { SET_PAGE_COUNT } from '../pagination';

import { fetchComings, editComingById, addNewComing, 
         deleteComing, restoreComing
        } from '../../http/comings';

const COMINGS_LOAD = 'comings/COMINGS_LOAD';
const COMINGS_LOADING = 'comings/COMINGS_LOADING';
const COMINGS_LOAD_FAILED = 'comings/COMINGS_LOAD_FAILED';
const COMING_MODAL_CLOSE = 'comings/COMING_MODAL_CLOSE'
const COMING_MODAL_OPEN = 'comings/COMING_MODAL_OPEN';
const COMING_LOAD_SUCCESS = 'comings/COMING_LOAD_SUCCESS';
const CREATE_NEW_COMING = 'comings/CREATE_NEW_COMING';
const CREATE_COMING = 'comings/CREATE_COMING';
const BLOCK_COMING = 'comings/BLOCK_COMING';
const RESTORE_COMING = 'comings/RESTORE_COMING';
const COMING_ADD_SUCCESS = 'comings/COMING_ADD_SUCCESS';
const COMING_SET_INITIAL = 'comings/COMING_SET_INITIAL';
const COMING_EDIT = 'comings/COMING_EDIT';

const initialState = {
   initialValues: {
    materials: [{
      name: '',
      amount: '',
      inputPrice: '',
      outputPrice: ''
    }],
    number: '',
    provider: '',
  },
  data: [],
  loading: false,
  visible: false,
  currentId: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case COMINGS_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case COMINGS_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case COMING_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id
      };
    }
    case COMING_MODAL_CLOSE: {
      return {
        ...state,
        currentId: '',
        visible: false,
      };
    }
    case COMING_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data.items
      };
    }
    case CREATE_NEW_COMING: {
      return {
        ...state,
        loading: false,
        visible: true,
        initialValues: {
          materials: [{
            name: '',
            amount: '',
            inputPrice: '',
            outputPrice: ''
          }],
          number: '',
          provider: '',
        }
      };
    }
    case COMING_ADD_SUCCESS: {
      return {
        ...state,
        loading: false,
        visible: false,
        currentId: null
      };
    }
    case COMING_SET_INITIAL: {
      return {
        ...state,
        visible: true,
        loading: false,
        initialValues: action.data
      };
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getAllComings = queries => ({ type: COMINGS_LOAD, queries});
export const openModal = id => ({ type: COMING_MODAL_OPEN, id });
export const closeModal = () => ({ type: COMING_MODAL_CLOSE });
export const createNewComing = () => ({ type: CREATE_NEW_COMING });
export const createComing = (data) => ({ type: CREATE_COMING, data });
export const blockComing = (id) => ({ type: BLOCK_COMING, id });
export const unlockComing = (id) => ({ type: RESTORE_COMING, id });
export const editComing = (id, data) => ({ type: COMING_EDIT, id, data });
export const setInitialData = data => ({ type: COMING_SET_INITIAL, data });

//<<<WORKERS>>>
function* getAllData({queries={}}) {
  console.log(queries)
  yield put({ type: COMINGS_LOADING })
  try {
    const response = yield call(fetchComings, queries);
    if (response.status === 200) {
      yield put({ type: COMING_LOAD_SUCCESS, data: response.data });
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } });
    }
  } catch (error) {
    yield put({ type: COMINGS_LOAD_FAILED })
    console.log(error)
  }
};

function* addData({ data }) {
  yield put({ type: COMINGS_LOADING })
  console.log(data)
  try {
    const response = yield call(addNewComing, data);
    if (response.status === 200) {
      yield put({ type: COMING_ADD_SUCCESS });
      yield put({ type: COMINGS_LOAD });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } });
    }
  } catch (error) {
    yield put({ type: COMINGS_LOAD_FAILED })
    console.log(error)
  }
};

function* blockData({ id }) {
  yield put({ type: COMINGS_LOADING })
  try {
    const response = yield call(deleteComing, id);
    if (response.status === 200) {
      yield put({ type: COMINGS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
  } catch (error) {
    yield put({ type: COMINGS_LOAD_FAILED })
    console.log(error)
  }
};

function* restoreData({ id }) {
  yield put({ type: COMINGS_LOADING })
  try {
    const response = yield call(restoreComing, id);
    if (response.status === 200) {
      yield put({ type: COMINGS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
  } catch (error) {
    yield put({ type: COMINGS_LOAD_FAILED })
    console.log(error)
  }
};

function* editData({ id, data }) {
  try {
    yield put({ type: COMINGS_LOADING })
    const response = yield call(editComingById, id, data);
    if (response.status === 200) {
      yield put({ type: COMING_ADD_SUCCESS });
      // yield put({ type: SET_NOTIFICATION, notification: { text, error: false } })
      yield put({ type: COMINGS_LOAD });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } });
    }
  } catch (error) {
    yield put({ type: COMINGS_LOAD_FAILED });
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchComings() {
  yield takeEvery(COMINGS_LOAD, getAllData);
  yield takeEvery(CREATE_COMING, addData);
  yield takeEvery(BLOCK_COMING, blockData);
  yield takeEvery(RESTORE_COMING, restoreData);
  yield takeEvery(COMING_EDIT, editData);
}