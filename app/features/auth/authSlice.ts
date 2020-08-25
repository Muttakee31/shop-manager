import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, token: null, username: null },
  reducers: {
    sign_in: (state, action:any) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    sign_out: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.username = null;
    },
  },
});

export const { sign_in, sign_out } = authSlice.actions;

export const setAuthToken = (data:any): AppThunk => {
  return (dispatch) => {
    dispatch(sign_in(data));
    //console.log(data);
  };
};

export const logOutUser = (): AppThunk => {
  return (dispatch) => {
    dispatch(sign_out());
  };
};

export default authSlice.reducer;

export const authToken = (state: RootState) => state.auth.token;
export const userName = (state: RootState) => state.auth.username;
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;
