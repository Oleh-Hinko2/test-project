import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { SET_PAGE_COUNT } from '../pagination';

import { fetchDataForCollection, addNewCollection, fetchCollections } from '../../http/collections';

const COLLECTIONS_LOAD = 'collections/COLLECTIONS_LOAD';
const COLLECTIONS_LOADING = 'collections/COLLECTIONS_LOADING';
const COLLECTIONS_LOAD_FAILED = 'collections/COLLECTIONS_LOAD_FAILED';
const COLLECTION_MODAL_OPEN = 'collections/COLLECTION_MODAL_OPEN'
const COLLECTION_MODAL_CLOSE = 'collections/COLLECTION_MODAL_CLOSE';
const COLLECTIONS_LOAD_SUCCESS = 'collections/COLLECTIONS_LOAD_SUCCESS';
const CREATE_NEW_COLLECTION = 'collections/CREATE_NEW_COLLECTION';
const DATA_FOR_COLLECTION = 'collections/DATA_FOR_COLLECTION';
const COLLECTION_ADD_SUCCESS = 'collections/COLLECTION_ADD_SUCCESS';
const SUCCESS_DATA_FOR_COLLECTION = 'collections/SUCCESS_DATA_FOR_COLLECTION';
const COLLECTION_SET_INITIAL = 'collections/COLLECTION_SET_INITIAL';

const initialState = {
  initialValues: {
    name: '',
    balance: '',
  },
  data: [],
  activeData: [],
  loading: false,
  visible: false,
  currentId: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case COLLECTIONS_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case COLLECTIONS_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case COLLECTION_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id
      };
    }
    case COLLECTION_MODAL_CLOSE: {
      return {
        ...state,
        currentId: '',
        visible: false,
      };
    }
    case COLLECTIONS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data.items
      };
    }
    case SUCCESS_DATA_FOR_COLLECTION: {
      return {
        ...state,
        loading: false,
        activeData: action.data
      };
    }
    case CREATE_NEW_COLLECTION: {
      return {
        ...state,
        loading: false,
        visible: true,
        initialValues: {
          name: '',
          balance: '',
        },
      };
    }
    case COLLECTION_ADD_SUCCESS: {
      return {
        ...state,
        loading: false,
        visible: false,
        currentId: null
      };
    }
    case COLLECTION_SET_INITIAL: {
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
export const getAllCollections = queries => ({ type: COLLECTIONS_LOAD, queries });
export const getDataForCollection = () => ({ type: DATA_FOR_COLLECTION });
export const openModal = id => ({ type: COLLECTION_MODAL_OPEN, id });
export const closeModal = () => ({ type: COLLECTION_MODAL_CLOSE });
export const createNewCollection = data => ({ type: CREATE_NEW_COLLECTION });
export const setInitialData = data => ({ type: COLLECTION_SET_INITIAL, data });

//<<<WORKERS>>>
function* getAllData({queries = {}}) {
  yield put({ type: COLLECTIONS_LOADING })
  try {
    const response = yield call(fetchCollections, queries);
    if (response.status === 200) {
      yield put({ type: COLLECTIONS_LOAD_SUCCESS, data: response.data });
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
  } catch (error) {
    yield put({ type: COLLECTIONS_LOAD_FAILED })
    console.log(error)
  }
};

function* getDataCollections() {
  yield put({ type: COLLECTIONS_LOADING })
  try {
    const response = yield call(fetchDataForCollection);
    if (response.status === 200) {
      yield put({ type: SUCCESS_DATA_FOR_COLLECTION, data: response.data })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
  } catch (error) {
    yield put({ type: COLLECTIONS_LOAD_FAILED })
    console.log(error)
  }
};

function* addData({ data }) {
  yield put({ type: COLLECTIONS_LOADING })
  try {
    const response = yield call(addNewCollection, data);
    if (response.status === 200) {
      yield put({ type: COLLECTION_ADD_SUCCESS })
      yield put({ type: COLLECTIONS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
  } catch (error) {
    yield put({ type: COLLECTIONS_LOAD_FAILED })
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchCollections() {
  yield takeEvery(COLLECTIONS_LOAD, getAllData);
  yield takeEvery(DATA_FOR_COLLECTION, getDataCollections);
  yield takeEvery(CREATE_NEW_COLLECTION, addData);
}