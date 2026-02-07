// Menu Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  menus: any[];
  routes: any[];
}

const initialState: MenuState = {
  menus: JSON.parse(localStorage.getItem('xunji_menus') || '[]'),
  routes: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<any[]>) {
      state.menus = action.payload;
      localStorage.setItem('xunji_menus', JSON.stringify(action.payload));
    },
    setRoutes(state, action: PayloadAction<any[]>) {
      state.routes = action.payload;
    },
    clearMenus(state) {
      state.menus = [];
      state.routes = [];
      localStorage.removeItem('xunji_menus');
    },
  },
});

export const { setMenus, setRoutes, clearMenus } = menuSlice.actions;
export default menuSlice.reducer;
