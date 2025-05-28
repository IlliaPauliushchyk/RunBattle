import {Slices} from '@/constants';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '..';

type AuthenticationStateType = {
  isWaitForVerification: boolean;
  isLoggedIn: boolean;
};

const initialState: AuthenticationStateType = {
  isWaitForVerification: false,
  isLoggedIn: false,
};

const authenticationSlice = createSlice({
  name: Slices.authentication,
  initialState,
  reducers: {
    setLogin: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        isWaitForVerification: action.payload.isWaitForVerification,
      };
    },
    setIsWaitForVerification: (state, action) => {
      return {...state, isWaitForVerification: action.payload};
    },
    removeLogin: state => {
      return {
        ...state,
        loginInfo: null,
        isLoggedIn: false,
        isWaitForVerification: false,
      };
    },
  },
});

export const selectIsWaitForVerification = (state: RootState) =>
  state.authentication.isWaitForVerification;
export const selectIsLoggedIn = (state: RootState) =>
  state.authentication.isLoggedIn;

export const {
  actions: {setLogin, removeLogin, setIsWaitForVerification},
  reducer: authenticationReducer,
} = authenticationSlice;
