// Redux Store 配置
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import menuReducer from './slice/menuSlice';
import appReducer from './slice/appSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
