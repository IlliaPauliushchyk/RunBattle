import {Slices} from '@/constants';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '..';

export interface ISettings {
  difficulty: string;
  surface: string;
  routeCount: number;
}
export interface IUser {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  settings: ISettings | null;
}

type UserState = {
  user: IUser;
};

const initialState: UserState = {
  user: {
    uid: null,
    displayName: null,
    email: null,
    settings: null,
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
    setUserSettings: (state, action) => {
      return {
        ...state,
        user: {...state.user, settings: action.payload},
      };
    },
  },
});

export const selectUser = (state: RootState) => state.user.user;
export const selectUserSettings = (state: RootState) =>
  state.user.user.settings;

export const {
  actions: {setUser, setUserSettings},
  reducer: userReducer,
} = userSlice;
