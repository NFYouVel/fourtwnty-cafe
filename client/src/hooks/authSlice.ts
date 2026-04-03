import { createSlice } from "@reduxjs/toolkit";
import type { userAttribute } from "../type/userAttribute";

type authState = {
    user: userAttribute | null;
}

const initialState: authState = {
    user: null
}

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        },
    }
})

export const authAction = authSlice.actions;
export default authSlice.reducer;