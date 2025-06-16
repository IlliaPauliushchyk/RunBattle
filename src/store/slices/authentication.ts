import {Slices} from '@/constants';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '..';

type AuthenticationStateType = {
  isLoggedIn: boolean;
};

const initialState: AuthenticationStateType = {
  isLoggedIn: false,
};

const authenticationSlice = createSlice({
  name: Slices.authentication,
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    },
  },
});

export const selectIsLoggedIn = (state: RootState) =>
  state.authentication.isLoggedIn;

export const {
  actions: {setIsLoggedIn},
  reducer: authenticationReducer,
} = authenticationSlice;
