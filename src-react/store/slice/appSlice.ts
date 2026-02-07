// App Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
}

const initialState: AppState = {
  sidebarCollapsed: false,
  theme: (localStorage.getItem('xunji_theme') as 'light' | 'dark') || 'light',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      localStorage.setItem('xunji_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme } = appSlice.actions;
export default appSlice.reducer;
