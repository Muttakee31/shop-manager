import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, token: null },
  reducers: {
    sign_in: (state, token:any) => {
      state.isAuthenticated = true;
      state.token = token;
    },
    sign_out: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { sign_in, sign_out } = authSlice.actions;

export const setAuthToken = (token:string): AppThunk => {
  return (dispatch) => {
    dispatch(sign_in(token));
  };
};

export const logOutUser = (): AppThunk => {
  return (dispatch) => {
    dispatch(sign_out());
  };
};

export default authSlice.reducer;

export const authToken = (state: RootState) => state.auth.token;
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;
