import { takeEvery, put, call } from 'redux-saga/effects';
import { SET_NOTIFICATION } from '../notification';
import { fetchForCreateOrder, addNewOrder } from '../../http/orders';

const ORDER_LOAD_FAILED = 'order/ORDER_LOAD_FAILED';
const ORDER_MODAL_CLOSE = 'order/ORDER_MODAL_CLOSE'
const ORDER_MODAL_OPEN = 'order/ORDER_MODAL_OPEN';
const ORDER_LOADING = 'order/ORDER_LOADING';
const ADD_PAYMENT_METHOD = 'order/ADD_PAYMENT_METHOD';
const CREATE_NEW_ORDER = 'order/CREATE_NEW_ORDER';
const ADD_PRODUCT_TO_ORDER = 'order/ADD_PRODUCT_TO_ORDER';
const GET_DATA_FOR_ORDER = 'order/GET_DATA_FOR_ORDER';
const SUCCESS_GET_DATA_FOR_ORDER = 'order/SUCCESS_GET_DATA_FOR_ORDER';
const SET_CURRENT_ENTREPRENEUR = 'order/SET_CURRENT_ENTREPRENEUR';
const SET_SERVICE_FOR_CREATE_ORDER = 'order/SET_SERVICE_FOR_CREATE_ORDER';
const SET_MATERIAL_FOR_CREATE_ORDER = 'order/SET_MATERIAL_FOR_CREATE_ORDER';
const SET_INITIAL_SERVICE_VALUES = 'order/SET_INITIAL_SERVICE_VALUES';
const SET_INITIAL_MATERIAL_VALUES = 'order/SET_INITIAL_MATERIAL_VALUES';
const SET_INITIAL_PAYMENT_VALUES = 'order/SET_INITIAL_PAYMENT_VALUES';
const SET_ORDER_PRICE = 'order/SET_ORDER_PRICE';
const DELETE_ITEM_FROM_ORDER = 'order/DELETE_ITEM_FROM_ORDER';
const SET_DATA = 'order/SET_DATA';
const SUCCESS_CREATE_ORDER = 'order/SUCCESS_CREATE_ORDER';
const CHANGE_ORDER_DATA = 'order/CHANGE_ORDER_DATA';
const SET_CURRENT_MATERIAL = 'order/SET_CURRENT_MATERIAL';
const SET_CURRENT_SERVICE = 'order/SET_CURRENT_SERVICE';
const SET_CURRENT_PRODUCT = 'order/SET_CURRENT_PRODUCT';
const SET_DATA_FOR_CREATE_ORDER = 'order/SET_DATA_FOR_CREATE_ORDER';

const initialState = {
  initialValues: {
    service: {
      serviceId: '',
      total: '',
      price: '',
      amount: '',
      employeeId: '',
    },
    material: {
      materialId: '',
      total: '',
      price: '',
      amount: '',
      employeeId: '',
    },
    payment: {
      paymentMethodId: '',
      paid: '',
      rest: '',
      onBalance: false
    }
  },
  data: [],
  currentMaterial: {},
  currentService: {},
  currentProduct: {},
  orderData: {
    clients: [],
    entrepreneurs: [],
    services: [],
    paymentMethods: [],
    materials: []
  },
  dataForCreateOrder: {
    services: [],
    materials: [],
    orderPrice: ''
  },
  paymentData: {},
  payment: {},
  loading: false,
  visible: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ORDER_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case ORDER_LOAD_FAILED: {
      return {
        ...state,
        loading: false,
        openModal: true
      };
    }
    case ADD_PRODUCT_TO_ORDER: {
      return {
        ...state,
        loading: false,
        data: [
          ...state.data,
          action.data
        ],
      };
    }
    case SET_DATA: {
      return {
        ...state,
        loading: false,
        data: action.data
      };
    }
    case ADD_PAYMENT_METHOD: {
      return {
        ...state,
        loading: false,
        payment: action.data
      };
    }
    case SUCCESS_GET_DATA_FOR_ORDER: {
      return {
        ...state,
        loading: false,
        orderData: action.data
      };
    }
    case ORDER_MODAL_OPEN: {
      return {
        ...state,
        visible: true,
      };
    }
    case ORDER_MODAL_CLOSE: {
      return {
        ...state,
        loading: false,
        visible: false,
      };
    }
    case SET_CURRENT_ENTREPRENEUR: {
      return {
        ...state,
        dataForCreateOrder: {
          ...state.dataForCreateOrder,
          entrepreneurId: action.data
        },
      };
    }
    case SET_INITIAL_SERVICE_VALUES: {
      return {
        ...state,
        initialValues: {
          ...state.initialValues,
          service: {
            ...state.initialValues.service,
            ...action.data
          }
        }
      };
    }
    case SET_INITIAL_PAYMENT_VALUES: {
      return {
        ...state,
        initialValues: {
          ...state.initialValues,
          payment: {
            ...state.initialValues.payment,
            ...action.data
          }
        }
      };
    }
    case SET_SERVICE_FOR_CREATE_ORDER: {
      return {
        ...state,
        initialValues: {
          ...state.initialValues,
          service: {
            serviceId: '',
            total: '',
            price: '',
            amount: '',
            employeeId: '',
          },
        },
        dataForCreateOrder: {
          ...state.dataForCreateOrder,
          services: [
            ...state.dataForCreateOrder.services,
            action.data,
          ]
        },
      };
    }
    case SET_INITIAL_MATERIAL_VALUES: {
      return {
        ...state,
        initialValues: {
          ...state.initialValues,
          material: {
            ...state.initialValues.material,
            ...action.data
          }
        }
      };
    }
    case SET_MATERIAL_FOR_CREATE_ORDER: {
      return {
        ...state,
        initialValues: {
          ...state.initialValues,
          material: {
            materialId: '',
            total: '',
            price: '',
            amount: '',
            employeeId: '',
          },
        },
        dataForCreateOrder: {
          ...state.dataForCreateOrder,
          materials: [
            ...state.dataForCreateOrder.materials,
            action.data,
          ]
        },
      };
    }
    case SET_ORDER_PRICE: {
      return {
        ...state,
        dataForCreateOrder: {
          ...state.dataForCreateOrder,
          orderPrice: action.data
        },
      };
    }
    case SET_CURRENT_SERVICE: {
      return {
        ...state,
        currentService: action.data
      };
    }
    case SET_CURRENT_PRODUCT: {
      return {
        ...state,
        currentProduct: action.data
      };
    }
    case SET_CURRENT_MATERIAL: {
      return {
        ...state,
        currentMaterial: action.data
      };
    }
    case SUCCESS_CREATE_ORDER: {
      return {
        ...state,
        data: [],
        initialValues: {
          service: {
            serviceId: '',
            total: '',
            price: '',
            amount: '',
            employeeId: '',
          },
          material: {
            materialId: '',
            total: '',
            price: '',
            amount: '',
            employeeId: '',
          },
          payment: {
            paymentMethodId: '',
            paid: '',
            rest: null,
            onBalance: ''
          }
        },
        paymentData: {},
        dataForCreateOrder: {
          services: [],
          materials: [],
          orderPrice: ''
        }
      };
    }
    case SET_DATA_FOR_CREATE_ORDER: {
      return {
        ...state,
        dataForCreateOrder: action.data
      }
    }
    default:
      return state;
  }
}

// <<<ACTIONS>>>
export const getDataForCreateOrder = () => ({ type: GET_DATA_FOR_ORDER });
export const openModal = id => ({ type: ORDER_MODAL_OPEN, id });
export const closeModal = () => ({ type: ORDER_MODAL_CLOSE });
export const addProductToOrder = data => ({ type: ADD_PRODUCT_TO_ORDER, data });
export const addPaymentMethod = data => ({ type: ADD_PAYMENT_METHOD, data });
export const createOrder = data => ({ type: CREATE_NEW_ORDER, data });
export const setCurrentEntrepreneur = data => ({ type: SET_CURRENT_ENTREPRENEUR, data });
export const setServiceForCreateOrder = data => ({ type: SET_SERVICE_FOR_CREATE_ORDER, data });
export const setMaterialForCreateOrder = data => ({ type: SET_MATERIAL_FOR_CREATE_ORDER, data });
export const initialServiceValues = data => ({ type: SET_INITIAL_SERVICE_VALUES, data });
export const initialMaterialValues = data => ({ type: SET_INITIAL_MATERIAL_VALUES, data });
export const initialPaymentValues = data => ({ type: SET_INITIAL_PAYMENT_VALUES, data });
export const setOrderPrice = data => ({ type: SET_ORDER_PRICE, data });
export const setCurrentService = data => ({ type: SET_CURRENT_SERVICE, data });
export const setCurrentProduct = data => ({ type: SET_CURRENT_PRODUCT, data });
export const setCurrentMaterial = data => ({ type: SET_CURRENT_MATERIAL, data });
export const deleteProductFromOrder = (id, data) => ({ type: DELETE_ITEM_FROM_ORDER, id, data });
export const changeOrderData = ({id, name, value, data, currentProductPrice, dataForCreateOrder, currentProduct}) => ({ type: CHANGE_ORDER_DATA, id, name, value, data, currentProductPrice, dataForCreateOrder, currentProduct });

//<<<WORKERS>>>
function* getData() {
  try {
    yield put({ type: ORDER_LOADING })
    const response = yield call(fetchForCreateOrder);
    if (response.status === 200) {
      yield put({ type: SUCCESS_GET_DATA_FOR_ORDER, data: response.data });
    }
    if (response.status >= 400) {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } });
      yield put({ type: ORDER_LOAD_FAILED });
    }
  } catch (error) {
    console.log(error)
  }
};

function* addData({ data }) {
  try {
    yield put({ type: ORDER_LOADING })
    const response = yield call(addNewOrder, data);
    if (response.status === 200) {
      yield put({ type: ORDER_MODAL_OPEN });
      yield put({ type: SUCCESS_CREATE_ORDER });
      yield put({ type: GET_DATA_FOR_ORDER });
    } else {
      yield put({ type: SET_NOTIFICATION, notification: { text: response.data, error: true } });
      yield put({ type: ORDER_LOAD_FAILED });
    }
  } catch (error) {
    console.log(error)
  }
};

function* deleteData({ id, data }) {
  try {
    yield put({ type: ORDER_LOADING })
    const finalData = data.filter(item => item.id !== id);
    let initialValue = 0;
    let finalOrderPrice = finalData.reduce((total, currentValue) => {
      return total + currentValue.amount;
    }, initialValue);
    yield put({ type: SET_ORDER_PRICE, data: finalOrderPrice });
    yield put({ type: SET_DATA, data: finalData });
  } catch (error) {
    console.log(error)
  }
};

function* changeData({ id, name, value, data, currentProductPrice, dataForCreateOrder, currentProduct }) {
  let updateDataForCreteOrder = {};
  try {
    const finalData = data.map(item => {
      if (item.id === id) {
        if (name === "total") {
          const { price } = item;
          const changeItem = { ...item };
          const updateAmount = value * price;
          const currentAmount = value * currentProductPrice;
          const updateDiscount = updateAmount - currentAmount;
          changeItem[name] = value;
          changeItem["amount"] = updateAmount;
          changeItem["discount"] = updateDiscount;
          updateDataForCreteOrder = handleUpdateDataForCreateOrder(currentProduct, id, dataForCreateOrder, changeItem )
          return changeItem
        } else if (name === "price") {
          const { total, discount, amount } = item;
          let changeItem = { ...item };
          const updateAmount = value * total;
          const differenceAmount = amount - updateAmount;
          const updateDiscount = discount - differenceAmount;
          changeItem[name] = value;
          changeItem["amount"] = updateAmount;
          changeItem["discount"] = updateDiscount;
          updateDataForCreteOrder = handleUpdateDataForCreateOrder(currentProduct, id, dataForCreateOrder, changeItem )
          return changeItem
        } else if (name === "amount") {
          const { total } = item;
          let changeItem = { ...item };
          const currentAmount = total * currentProductPrice;
          changeItem[name] = value;
          changeItem["discount"] = value - currentAmount;
          updateDataForCreteOrder = handleUpdateDataForCreateOrder(currentProduct, id, dataForCreateOrder, changeItem )
          return changeItem
        }  else if (name === "employeeId") {
          let changeItem = { ...item };
          changeItem[name] = value;
          updateDataForCreteOrder = handleUpdateDataForCreateOrder(currentProduct, id, dataForCreateOrder, changeItem )
          return changeItem
        }
        return item;
      } else {
        return item
      }
    })
    let initialValue = 0;
    let finalOrderPrice = finalData.reduce((total, currentValue) => {
      return total + currentValue.amount;
    }, initialValue);
    yield put({ type: SET_DATA_FOR_CREATE_ORDER, data: updateDataForCreteOrder });
    yield put({ type: SET_ORDER_PRICE, data: finalOrderPrice });
    yield put({ type: SET_DATA, data: finalData });
  } catch (error) {
    console.log(error)
  }
};

const handleUpdateDataForCreateOrder = (type, id, currentData, updateItem) => {
  if (type === 'service') {
    const updateServices = currentData.services.map(item => {
      if (item.id === id) {
        return updateItem
      } else {
        return item
      }
    })
    return {
      materials: currentData.materials,
      services: updateServices
    }
  } else if (type === 'material') {
    const updateMaterials = currentData.materials.map(item => {
      if (item.id === id) {
        return updateItem
      } else {
        return item
      }
    })
    return {
      services: currentData.services,
      materials: updateMaterials
    }
  }
} 

//<<<WATCHERS>>>
export function* watchCreateOrder() {
  yield takeEvery(GET_DATA_FOR_ORDER, getData);
  yield takeEvery(CREATE_NEW_ORDER, addData);
  yield takeEvery(DELETE_ITEM_FROM_ORDER, deleteData);
  yield takeEvery(CHANGE_ORDER_DATA, changeData);
}