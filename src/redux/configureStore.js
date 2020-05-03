import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';
import rootReducer from './reducers';

/*
  Using "Redux DevTools Extension"
  Read more https://github.com/zalmoxisus/redux-devtools-extension#usage
*/
const { __REDUX_DEVTOOLS_EXTENSION__: devTools } = window;

const sagaMiddleware = createSagaMiddleware();
const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(createStore);

export default function configureStore(initialState = {}) {
  const store = createStoreWithMiddleware(
    rootReducer,
    initialState,
    devTools && devTools(),
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
