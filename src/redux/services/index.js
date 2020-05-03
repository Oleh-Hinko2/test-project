import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { SET_PAGE_COUNT } from '../pagination';
import { fetchServices, editServiceById, addNewService, 
         deleteService, restoreService, fetchAllServices 
        } from '../../http/services';

const SERVICES_LOAD = 'services/SERVICES_LOAD';
const SERVICES_LOADING = 'services/SERVICES_LOADING';
const SERVICES_LOAD_FAILED = 'services/SERVICES_LOAD_FAILED';
const SERVICE_MODAL_CLOSE = 'services/SERVICE_MODAL_CLOSE'
const SERVICE_MODAL_OPEN = 'services/SERVICE_MODAL_OPEN';
const SERVICES_LOAD_SUCCESS = 'services/SERVICES_LOAD_SUCCESS';
const CREATE_NEW_SERVICE = 'services/CREATE_NEW_SERVICE';
const CREATE_SERVICE = 'services/CREATE_SERVICE';
const RESTORE_SERVICE = 'services/RESTORE_SERVICE';
const BLOCK_SERVICE = 'services/BLOCK_SERVICE';
const SERVICE_ADD_SUCCESS = 'services/SERVICE_ADD_SUCCESS';
const SERVICE_SET_INITIAL = 'services/SERVICE_SET_INITIAL';
const SERVICE_EDIT = 'services/SERVICE_EDIT';
const SERVICES_ITEMS_LOAD = 'services/SERVICES_ITEMS_LOAD';
const SERVICES_ACTIVE_LOAD_SUCCESS = 'services/SERVICES_ACTIVE_LOAD_SUCCESS';

const initialState = {
  initialValues: {
    name: '',
    parameter: '',
    price: '',
    id: ''
  },
  data: [],
  allData: [],
  loading: false,
  visible: false,
  currentId: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SERVICES_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SERVICES_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case SERVICE_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id
      };
    }
    case SERVICE_MODAL_CLOSE: {
      return {
        ...state,
        currentId: '',
        visible: false,
      };
    }
    case SERVICES_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data.items,
        pageCount: Math.ceil(action.data.count/state.pageSize)
      };
    }
    case CREATE_NEW_SERVICE: {
      return {
        ...state,
        loading: false,
        visible: true,
        initialValues: {
          name: '',
          parameter: '',
          price: '',
          id: ''
        },
      };
    }
    case SERVICE_ADD_SUCCESS: {
      return {
        ...state,
        loading: false,
        visible: false,
        currentId: null
      };
    }
    case SERVICE_SET_INITIAL: {
      return {
        ...state,
        visible: true,
        loading: false,
        initialValues: action.data
      };
    }
    case SERVICES_ACTIVE_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        allData: action.data
      };
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getAllServices = queries => ({ type: SERVICES_LOAD, queries});
export const getServices = () => ({ type: SERVICES_ITEMS_LOAD });
export const openModal = id => ({ type: SERVICE_MODAL_OPEN, id })
export const closeModal = () => ({ type: SERVICE_MODAL_CLOSE })
export const createNewService = () => ({ type: CREATE_NEW_SERVICE })
export const createService = (data) => ({ type: CREATE_SERVICE, data })
export const blockService = (id) => ({ type: BLOCK_SERVICE, id });
export const unlockService = (id) => ({ type: RESTORE_SERVICE, id });
export const setInitialData = data => ({ type: SERVICE_SET_INITIAL, data });
export const editService = (id, data) => ({ type: SERVICE_EDIT, id, data });

//<<<WORKERS>>>
function* getAllData({queries = {}}) {
  console.log(queries)
  yield put({ type: SERVICES_LOADING })
  try {
    const response = yield call(fetchServices, queries);
    if (response.status === 200) {
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
      yield put({ type: SERVICES_LOAD_SUCCESS, data: response.data });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: SERVICES_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: SERVICES_LOAD_FAILED })
    console.log(error)
  }
};

function* getAllActiveData() {
  yield put({ type: SERVICES_LOADING })
  try {
    const response = yield call(fetchAllServices);
    if (response.status === 200) {
      yield put({ type: SERVICES_ACTIVE_LOAD_SUCCESS, data: response.data });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: SERVICES_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: SERVICES_LOAD_FAILED })
    console.log(error)
  }
};


function* addData({ data }) {
  yield put({ type: SERVICES_LOADING })
  console.log(data)
  try {
    const response = yield call(addNewService, data);
    if (response.status === 200) {
      yield put({ type: SERVICE_ADD_SUCCESS })
      yield put({ type: SERVICES_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: SERVICES_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: SERVICES_LOAD_FAILED })
    console.log(error)
  }
};

function* blockData({ id }) {
  yield put({ type: SERVICES_LOADING })
  try {
    const response = yield call(deleteService, id);
    if (response.status === 200) {
      yield put({ type: SERVICES_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: SERVICES_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: SERVICES_LOAD_FAILED })
    console.log(error)
  }
};

function* restoreData({ id }) {
  yield put({ type: SERVICES_LOADING })
  try {
    const response = yield call(restoreService, id);
    if (response.status === 200) {
      yield put({ type: SERVICES_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: SERVICES_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: SERVICES_LOAD_FAILED })
    console.log(error)
  }
};

function* editData({ id, data }) {
  try {
    yield put({ type: SERVICES_LOADING })
    const response = yield call(editServiceById, id, data);
    if (response.status === 200) {
      yield put({ type: SERVICE_ADD_SUCCESS })
      // yield put({ type: SET_NOTIFICATION, notification: { text, error: false } })
      yield put({ type: SERVICES_LOAD })
    }
    if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
      yield put({ type: SERVICES_LOAD_FAILED })
    }
  } catch (error) {
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchServices() {
  yield takeEvery(SERVICES_LOAD, getAllData);
  yield takeEvery(SERVICES_ITEMS_LOAD, getAllActiveData);
  yield takeEvery(CREATE_SERVICE, addData);
  yield takeEvery(BLOCK_SERVICE, blockData);
  yield takeEvery(RESTORE_SERVICE, restoreData);
  yield takeEvery(SERVICE_EDIT, editData);
}