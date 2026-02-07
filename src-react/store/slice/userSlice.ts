// User Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  userInfo: {
    id: number;
    userName: string;
    userNickname: string;
    avatar: string;
    roles: string[];
  } | null;
  permissions: string[];
}

const initialState: UserState = {
  token: localStorage.getItem('xunji_token') || localStorage.getItem('token') || sessionStorage.getItem('token'),
  userInfo: JSON.parse(localStorage.getItem('xunji_user_info') || 'null'),
  permissions: JSON.parse(localStorage.getItem('xunji_permissions') || '[]'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('xunji_token', action.payload);
      localStorage.setItem('token', action.payload);
      sessionStorage.setItem('token', action.payload);
    },
    setUserInfo(state, action: PayloadAction<UserState['userInfo']>) {
      state.userInfo = action.payload;
      if (action.payload) {
        localStorage.setItem('xunji_user_info', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('xunji_user_info');
      }
    },
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload;
      localStorage.setItem('xunji_permissions', JSON.stringify(action.payload));
    },
    logout(state) {
      state.token = null;
      state.userInfo = null;
      state.permissions = [];
      localStorage.removeItem('xunji_token');
      localStorage.removeItem('token');
      localStorage.removeItem('xunji_user_info');
      localStorage.removeItem('xunji_permissions');
      localStorage.removeItem('userId');
      sessionStorage.removeItem('token');
    },
  },
});

export const { setToken, setUserInfo, setPermissions, logout } = userSlice.actions;
export default userSlice.reducer;
