import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { SET_PAGE_COUNT } from '../pagination';
import { fetchOrders, getOrderById, addPayment, editOrderSingleEmployee } from '../../http/orders';

const ORDER_LOADING = 'order/ORDER_LOADING';
const REPLENISH_BALANCE_MODAL_OPEN = 'order/REPLENISH_BALANCE_MODAL_OPEN';
const REPLENISH_BALANCE_MODAL_CLOSE = 'order/REPLENISH_BALANCE_MODAL_CLOSE';
const REPLENISH_BALANCE = 'order/REPLENISH_BALANCE';
const ORDERS_LOAD = 'order/ORDER_LOAD';
const ORDER_GET = 'order/ORDER_GET';
const ORDERS_LOAD_SUCCESS = 'order/ORDERS_LOAD_SUCCESS';
const ORDERS_LOAD_FAILED = 'order/ORDERS_LOAD_FAILED';
const ORDER_LOAD_SUCCESS = 'order/ORDER_LOAD_SUCCESS';
const SINGLE_ORDER_MODAL_CLOSE = 'order/SINGLE_ORDER_MODAL_CLOSE';
const SINGLE_ORDER_MODAL_OPEN = 'order/SINGLE_ORDER_MODAL_OPEN';
const ORDER_EDIT = 'order/ORDER_EDIT';
const SET_ORDER_ID = 'order/SET_ORDER_ID';
const SET_DATA_FOR_ORDER_EDIT = 'order/SET_DATA_FOR_ORDER_EDIT';

const initialState = {
  data: [],
  details: [],
  dataForEditSingle: {},
  loading: false,
  visible: false,
  currentId: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ORDER_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case ORDERS_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case ORDERS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data.items,
      };
    }
    case ORDER_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        details: action.data
      };
    }
    case REPLENISH_BALANCE_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id,
      };
    }
    case REPLENISH_BALANCE_MODAL_CLOSE: {
      return {
        ...state,
        visible: false,
        currentId: ''
      };
    }
    case SINGLE_ORDER_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
        currentId: action.id,
        loading: false
      };
    }
    case SINGLE_ORDER_MODAL_CLOSE: {
      return {
        ...state,
        visible: false,
        currentId: '',
        loading: false
      };
    }
    case SET_DATA_FOR_ORDER_EDIT: {
      return {
        ...state,
        dataForEditSingle: {
          ...state.dataForEditSingle,
          ...action.data
        },
        currentId: {
          ...state.currentId,
          ...action.data
        }
      };
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getAllOrders = queries => ({ type: ORDERS_LOAD, queries });
export const getOrder = id => ({ type: ORDER_GET, id });
export const openModal = id => ({ type: SINGLE_ORDER_MODAL_OPEN, id })
export const closeModal = () => ({ type: SINGLE_ORDER_MODAL_CLOSE })
export const openModalReplenishBalance = id => ({ type: REPLENISH_BALANCE_MODAL_OPEN, id });
export const closeModalReplenishBalance = () => ({ type: REPLENISH_BALANCE_MODAL_CLOSE });
export const replenishBalance = data => ({ type: REPLENISH_BALANCE, data });
export const editSingleOrder = data => ({ type: ORDER_EDIT, data });
export const setDataForEditSingleOrder = data => ({ type: SET_DATA_FOR_ORDER_EDIT, data });

//<<<WORKERS>>>
function* getOrdersData({queries = {}}) {
  yield put({ type: ORDER_LOADING })
  try {
    const response = yield call(fetchOrders, queries);
    if (response.status === 200) {
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
      yield put({ type: ORDERS_LOAD_SUCCESS, data: response.data })
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
    }
    if (response.status >= 400) {
      yield put({ type: ORDERS_LOAD_FAILED })
    }
  } catch (error) {
    yield put({ type: ORDERS_LOAD_FAILED })
    console.log(error)
  }
};

function* getOrderData({ id }) {
  try {
    yield put({ type: ORDER_LOADING });
    const response = yield call(getOrderById, id);
    if (response.status === 200) {
      yield put({ type: SET_PAGE_COUNT, count: response.data.count });
      yield put({ type: ORDER_LOAD_SUCCESS, data: [...response.data.materials, ...response.data.services] })
      yield put({ type: SET_DATA_FOR_ORDER_EDIT, data: {orderId: response.data.orderId}});
    }
    if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
      yield put({ type: ORDERS_LOAD_FAILED })
    }
  } catch (error) {
    console.log(error)
  }
};

function* replenishAmount({data}) {
	try {
		yield put({ type: ORDER_LOADING })
		const response = yield call(addPayment, data);
		if (response.status === 200) {
      yield put({ type: ORDERS_LOAD });
      yield put({ type: REPLENISH_BALANCE_MODAL_CLOSE });
		}
		if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
      yield put({ type: ORDERS_LOAD_FAILED })
		}
	} catch (error) {
		console.log(error)
	}
};

function* editData({ data }) {
  try {
    yield put({ type: ORDER_LOADING })
    const response = yield call(editOrderSingleEmployee, data);
    if (response.status === 200) {
      // yield put({ type: SET_NOTIFICATION, notification: { text, error: false } })
      yield put({ type: SINGLE_ORDER_MODAL_CLOSE})
      yield put({ type: ORDER_GET, id: data.id})
    }
    if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } })
      yield put({ type: ORDERS_LOAD_FAILED })
    }
  } catch (error) {
    console.log(error)
  }
};

//<<<WATCHERS>>>
export function* watchOrders() {
  yield takeEvery(ORDERS_LOAD, getOrdersData);
  yield takeEvery(ORDER_GET, getOrderData);
  yield takeEvery(REPLENISH_BALANCE, replenishAmount);
  yield takeEvery(ORDER_EDIT, editData);
}