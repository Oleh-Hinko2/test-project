// <<ACTION CREATORS>>
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

const initialState = {
  error: false,
  text: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_NOTIFICATION:
      const { text, error } = action.notification
      return {
        error,
        text
      }
    case CLEAR_NOTIFICATION:
      return {
        ...initialState
      }
    default:
      return state;
  }
};

// <<<ACTIONS>>>
export const setNotification = notification => ({ type: SET_NOTIFICATION, notification });
export const clearNotification = () => ({ type: CLEAR_NOTIFICATION });