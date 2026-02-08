// App Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode } from '../../utils/theme';

const THEME_STORAGE_KEY = 'xunji_theme';
const SIDEBAR_STORAGE_KEY = 'xunji_sidebar_collapsed';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
};

const getInitialSidebarCollapsed = () => localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1';

interface AppState {
  sidebarCollapsed: boolean;
  theme: ThemeMode;
}

const initialState: AppState = {
  sidebarCollapsed: getInitialSidebarCollapsed(),
  theme: getInitialTheme(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, state.sidebarCollapsed ? '1' : '0');
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, action.payload ? '1' : '0');
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme } = appSlice.actions;
export default appSlice.reducer;
