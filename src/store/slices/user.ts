import {Slices} from '@/constants';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '..';

export interface IUser {
  displayName: string | null;
  email: string | null;
}

type UserState = {
  user: IUser;
};

const initialState: UserState = {
  user: {
    displayName: null,
    email: null,
  },
};

const userSlice = createSlice({
  name: Slices.user,
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

export const selectUser = (state: RootState) => state.user;

export const {
  actions: {setUser},
  reducer: userReducer,
} = userSlice;
