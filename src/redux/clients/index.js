import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { SET_PAGE_COUNT } from '../pagination';
import { fetchClients, editClientById, addNewClient, 
         deleteClient, restoreClient, getMethodsClient,
         replenishBalanceClient, getOrderByClientId, getPaidHistory
        } from '../../http/clients';

const CLIENTS_LOAD = 'clients/CLIENTS_LOAD';
const CLIENTS_LOADING = 'clients/CLIENT_LOADING';
const CLIENTS_LOAD_FAILED = 'clients/CLIENTS_LOAD_FAILED';
const CLIENT_MODAL_CLOSE = 'clients/CLIENT_MODAL_CLOSE'
const CLIENT_MODAL_OPEN = 'clients/CLIENT_MODAL_OPEN';
const CLIENTS_LOAD_SUCCESS = 'clients/CLIENTS_LOAD_SUCCESS';
const CREATE_NEW_CLIENT = 'clients/CREATE_NEW_CLIENT';
const CREATE_CLIENT = 'clients/CREATE_CLIENT';
const BLOCK_CLIENT = 'clients/BLOCK_CLIENT';
const RESTORE_CLIENT = 'clients/RESTORE_CLIENT';
const CLIENT_ADD_SUCCESS = 'clients/CLIENT_ADD_SUCCESS';
const CLIENT_EDIT = 'clients/CLIENT_EDIT';
const CLIENT_SET_INITIAL = 'clients/CLIENT_SET_INITIAL';
const CLIENT_REPLENISH_BALANCE = 'clients/CLIENT_REPLENISH_BALANCE';
const CLIENT_PAYMENT_METHODS = 'clients/CLIENT_PAYMENT_METHODS';
const METHODS_LOAD_SUCCESS = 'clients/METHODS_LOAD_SUCCESS';
const CLIENTS_PAID_HISTORY_LOAD = 'clients/CLIENTS_PAID_HISTORY_LOAD';
const CLIENTS_PAID_HISTORY_SUCCESS = 'clients/CLIENTS_PAID_HISTORY_SUCCESS';
const SET_CURRENT_CLIENT = 'clients/SET_CURRENT_CLIENT';
const CLIENT_ORDERS_LOAD = 'clients/CLIENT_ORDERS_LOAD';
const CLIENT_ORDERS_LOAD_SUCCESS = 'clients/CLIENT_ORDERS_LOAD_SUCCESS';

const initialState = {
  initialValues: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    id: ''
  },
  currentClient: {},
  data: [],
  ordersData: [],
  activeData: [],
  orders: [
    {
      id: 1,
      numberOrder: "2545",
      dateOrder: "18.02.2020",
      datePayment: "18.02.2020",
      paymentMethod: "Готівка",
      amount: "150",
      debt: "0",
      FOP: "1",
      cashier: "Ольга"
    },
  ],
  ordersDetails: [],
  methodsData: {
    paymentMethod: [],
    entrepreneur: []
  },
  loading: false,
  visible: false,
  currentId: null,
  create: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLIENTS_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case CLIENTS_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case CLIENT_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id
      };
    }
    case CLIENT_MODAL_CLOSE: {
      return {
        ...state,
        currentId: '',
        visible: false,
        create: false
      };
    }
    case CLIENTS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data.items
      };
    }
    case CLIENT_ORDERS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        ordersData: action.data.items,
      };
    }
    
    case METHODS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        methodsData: action.data
      };
    }
    case CREATE_NEW_CLIENT: {
      return {
        ...state,
        loading: false,
        visible: true,
        create: true,
        initialValues: {
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          id: ''
        },
      };
    }
    case CLIENT_ADD_SUCCESS: {
      return {
        ...state,
        loading: false,
        visible: false,
        currentId: null
      };
    }
    case CLIENT_SET_INITIAL: {
      return {
        ...state,
        visible: true,
        loading: false,
        initialValues: action.data
      };
    }
    case CLIENTS_PAID_HISTORY_SUCCESS: {
      return {
        ...state,
        loading: false,
        ordersDetails: action.data
      };
    }
    case SET_CURRENT_CLIENT: {
      return {
        ...state,
        currentClient: action.data
      };
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getAllClients = queries => ({ type: CLIENTS_LOAD, queries });
export const getAllOrdersByClientId = queries => ({ type: CLIENT_ORDERS_LOAD, queries });
export const getAllPaidHistory = id => ({ type: CLIENTS_PAID_HISTORY_LOAD, id });
export const openModal = id => ({ type: CLIENT_MODAL_OPEN, id });
export const closeModal = () => ({ type: CLIENT_MODAL_CLOSE });
export const createNewClient = () => ({ type: CREATE_NEW_CLIENT });
export const createClient = data => ({ type: CREATE_CLIENT, data });
export const blockUser = id => ({ type: BLOCK_CLIENT, id });
export const unlockUser = id => ({ type: RESTORE_CLIENT, id });
export const editClient = (id,data) => ({ type: CLIENT_EDIT, id, data });
export const setInitialData = data => ({ type: CLIENT_SET_INITIAL, data });
export const getPaymentMethods = () => ({ type: CLIENT_PAYMENT_METHODS });
export const replenishBalance = data => ({ type: CLIENT_REPLENISH_BALANCE, data });
export const setCurrentClient = data => ({ type: SET_CURRENT_CLIENT, data });

//<<<WORKERS>>>
function* getALLData({queries={}}) {
  yield put({ type: CLIENTS_LOADING })
  try {
    const response = yield call(fetchClients, queries);
    if (response.status === 200) {
      yield put({ type: CLIENTS_LOAD_SUCCESS, data: response.data });
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* getDataByID({queries={}}) {
  yield put({ type: CLIENTS_LOADING })
  try {
    const response = yield call(getOrderByClientId, queries);
    if (response.status === 200) {
      yield put({ type: CLIENT_ORDERS_LOAD_SUCCESS, data: response.data });
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }

  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* getHistory({id}) {
  yield put({ type: CLIENTS_LOADING })
  try {
    const response = yield call(getPaidHistory, id);
    if (response.status === 200) {
      yield put({ type: CLIENTS_PAID_HISTORY_SUCCESS, data: response.data })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* getPaymentMethodsData() {
  yield put({ type: CLIENTS_LOADING })
  try {
    const response = yield call(getMethodsClient);
    if (response.status === 200) {
      yield put({ type: METHODS_LOAD_SUCCESS, data: response.data })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* addData({ data }) {
  yield put({ type: CLIENTS_LOADING })
  console.log(data)
  try {
    const response = yield call(addNewClient, data);
    console.log(response)
    if (response.status === 200) {
      yield put({ type: CLIENT_ADD_SUCCESS })
      yield put({ type: CLIENTS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* addBalance({ data }) {
  yield put({ type: CLIENTS_LOADING })
  console.log(data)
  try {
    const response = yield call(replenishBalanceClient, data);
    if (response.status === 200) {
      yield put({ type: CLIENT_ADD_SUCCESS })
      yield put({ type: CLIENTS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* blockData({ id }) {
  yield put({ type: CLIENTS_LOADING })
  try {
    const response = yield call(deleteClient, id);
    if (response.status === 200) {
      yield put({ type: CLIENTS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* restoreData({ id }) {
  yield put({ type: CLIENTS_LOADING })
  try {
    const response = yield call(restoreClient, id);
    if (response.status === 200) {
      yield put({ type: CLIENTS_LOAD })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: CLIENTS_LOAD_FAILED })
    console.log(error)
  }
};

function* editData({ id, data }) {
  console.log(id, data)
  try {
    yield put({ type: CLIENTS_LOADING })
    const response = yield call(editClientById, id, data);
    if (response.status === 200) {
      yield put({ type: CLIENT_ADD_SUCCESS })
      // yield put({ type: SET_NOTIFICATION, notification: { text, error: false } })
      yield put({ type: CLIENTS_LOAD })
    }
    if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
      yield put({ type: CLIENTS_LOAD_FAILED })
    }
  } catch (error) {
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchClients() {
  yield takeEvery(CLIENTS_LOAD, getALLData);
  yield takeEvery(CLIENT_ORDERS_LOAD, getDataByID);
  yield takeEvery(CREATE_CLIENT, addData);
  yield takeEvery(BLOCK_CLIENT, blockData);
  yield takeEvery(RESTORE_CLIENT, restoreData);
  yield takeEvery(CLIENT_EDIT, editData);
  yield takeEvery(CLIENT_PAYMENT_METHODS, getPaymentMethodsData);
  yield takeEvery(CLIENT_REPLENISH_BALANCE, addBalance);
  yield takeEvery(CLIENTS_PAID_HISTORY_LOAD, getHistory);
}