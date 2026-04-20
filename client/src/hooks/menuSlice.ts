import { createSlice } from "@reduxjs/toolkit";
import type { Menu } from "../type/menuAttribute";

type menuState = {
    menu: Menu | null;
}

const initialState: menuState = {
    menu: null
}

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenu(state, action) {
            state.menu = action.payload
        },
    }
})

export const menuAction = menuSlice.actions;
export default menuSlice.reducer;