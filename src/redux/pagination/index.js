// <<ACTION CREATORS>>
export const SET_PAGE_NUMBER = 'SET_PAGE_NUMBER';
export const SET_PAGE_COUNT = 'SET_PAGE_COUNT';
export const CLEAR_PAGE_NUMBER = 'CLEAR_PAGE_NUMBER';

const initialState = {
  pageCount: 1,
  pageSize: 10,
  pageNumber: 1
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.page
      }
    case SET_PAGE_COUNT:
      return {
        ...state,
        pageCount: Math.ceil(action.count / state.pageSize)
      }
    case CLEAR_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: 1
      }
    default:
      return state;
  }
};

// <<<ACTIONS>>>
export const setPageNumber = page => ({ type: SET_PAGE_NUMBER, page });