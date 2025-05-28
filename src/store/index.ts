import {Slices} from '@/constants';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {authenticationReducer, userReducer} from './slices';

const reducers = combineReducers({
  [Slices.user]: userReducer,
  [Slices.authentication]: authenticationReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './slices';
