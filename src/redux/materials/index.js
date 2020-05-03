import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { SET_PAGE_COUNT } from '../pagination';
import { fetchMaterials, fetchAllMaterials, editMaterialById, 
         addNewMaterial, deleteMaterial, restoreMaterial
        } from '../../http/materials';

const MATERIALS_LOAD = 'materials/MATERIALS_LOAD';
const MATERIALS_LOADING = 'materials/MATERIALS_LOADING';
const MATERIALS_LOAD_FAILED = 'materials/MATERIALS_LOAD_FAILED';
const MATERIAL_MODAL_CLOSE = 'materials/MATERIAL_MODAL_CLOSE'
const MATERIAL_MODAL_OPEN = 'materials/MATERIAL_MODAL_OPEN';
const MATERIALS_LOAD_SUCCESS = 'materials/MATERIALS_LOAD_SUCCESS';
const CREATE_NEW_MATERIAL = 'materials/CREATE_NEW_MATERIAL';
const CREATE_MATERIAL = 'materials/CREATE_MATERIAL';
const BLOCK_MATERIAL = 'materials/BLOCK_MATERIAL';
const RESTORE_MATERIAL = 'materials/RESTORE_MATERIAL';
const MATERIAL_ADD_SUCCESS = 'materials/MATERIAL_ADD_SUCCESS';
const MATERIALS_ITEMS_LOAD = 'materials/MATERIALS_ITEMS_LOAD';
const MATERIALS_ITEMS_LOAD_SUCCESS = 'materials/MATERIALS_ITEMS_LOAD_SUCCESS';
const MATERIAL_SET_INITIAL = 'materials/MATERIAL_SET_INITIAL';
const MATERIAL_EDIT = 'materials/MATERIAL_EDIT';

const initialState = {
  initialValues: {
    number: '',
    name: '',
    parameter: '',
    inputPrice: '',
    outputPrice: '',
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
    case MATERIALS_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case MATERIALS_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case MATERIAL_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id
      };
    }
    case MATERIAL_MODAL_CLOSE: {
      return {
        ...state,
        currentId: '',
        visible: false,
      };
    }
    case MATERIALS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data.items
      };
    }
    case MATERIALS_ITEMS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        allData: action.data
      };
    }
    case CREATE_NEW_MATERIAL: {
      return {
        ...state,
        loading: false,
        visible: true,
        initialValues: {
          number: '',
          name: '',
          parameter: '',
          inputPrice: '',
          outputPrice: '',
          id: ''
        },
      };
    }
    case MATERIAL_ADD_SUCCESS: {
      return {
        ...state,
        loading: false,
        visible: false,
        currentId: null
      };
    }
    case MATERIAL_SET_INITIAL: {
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
export const getAllMaterials = queries => ({ type: MATERIALS_LOAD, queries });
export const getMaterials = () => ({ type: MATERIALS_ITEMS_LOAD });
export const openModal = id => ({ type: MATERIAL_MODAL_OPEN, id });
export const closeModal = () => ({ type: MATERIAL_MODAL_CLOSE });
export const createNewMaterial = () => ({ type: CREATE_NEW_MATERIAL });
export const createMaterial = (data) => ({ type: CREATE_MATERIAL, data });
export const blockMaterial = (id) => ({ type: BLOCK_MATERIAL, id });
export const unlockMaterial = (id) => ({ type: RESTORE_MATERIAL, id });
export const setInitialData = data => ({ type: MATERIAL_SET_INITIAL, data });
export const editMaterial = (id, data, pageNumber) => ({ type: MATERIAL_EDIT, id, data, pageNumber });

//<<<WORKERS>>>
function* getAllData({queries = {}}) {
  console.log(queries)
  yield put({ type: MATERIALS_LOADING })
  try {
    const response = yield call(fetchMaterials, queries);
    if (response.status === 200) {
      yield put({ type: MATERIALS_LOAD_SUCCESS, data: response.data });
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: MATERIALS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: MATERIALS_LOAD_FAILED })
    console.log(error)
  }
};

function* getAllItemsData() {
  yield put({ type: MATERIALS_LOADING })
  try {
    const response = yield call(fetchAllMaterials);
    if (response.status === 200) {
      yield put({ type: MATERIALS_ITEMS_LOAD_SUCCESS, data: response.data })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: MATERIALS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: MATERIALS_LOAD_FAILED })
    console.log(error)
  }
};


function* addData({ data }) {
  yield put({ type: MATERIALS_LOADING })
  console.log(data)
  try {
    const response = yield call(addNewMaterial, data);
    if (response.status === 200) {
      yield put({ type: MATERIAL_ADD_SUCCESS })
      yield put({ type: MATERIALS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: MATERIALS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: MATERIALS_LOAD_FAILED })
    console.log(error)
  }
};

function* blockData({ id }) {
  yield put({ type: MATERIALS_LOADING })
  try {
    const response = yield call(deleteMaterial, id);
    if (response.status === 200) {
      yield put({ type: MATERIALS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
  } catch (error) {
    yield put({ type: MATERIALS_LOAD_FAILED })
    console.log(error)
  }
};

function* restoreData({ id }) {
  yield put({ type: MATERIALS_LOADING })
  try {
    const response = yield call(restoreMaterial, id);
    if (response.status === 200) {
      yield put({ type: MATERIALS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: MATERIALS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: MATERIALS_LOAD_FAILED })
    console.log(error)
  }
};

function* editData({ id, data, pageNumber }) {
  debugger
  try {
    yield put({ type: MATERIALS_LOADING })
    const response = yield call(editMaterialById, id, data);
    if (response.status === 200) {
      yield put({ type: MATERIAL_ADD_SUCCESS })
      // yield put({ type: SET_NOTIFICATION, notification: { text, error: false } })
      yield put({ type: MATERIALS_LOAD, queries: {pageNumber} })
    }
    if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
      yield put({ type: MATERIALS_LOAD_FAILED })
    }
  } catch (error) {
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchMaterials() {
  yield takeEvery(MATERIALS_LOAD, getAllData);
  yield takeEvery(MATERIALS_ITEMS_LOAD, getAllItemsData);
  yield takeEvery(CREATE_MATERIAL, addData);
  yield takeEvery(BLOCK_MATERIAL, blockData);
  yield takeEvery(RESTORE_MATERIAL, restoreData);
  yield takeEvery(MATERIAL_EDIT, editData);
}