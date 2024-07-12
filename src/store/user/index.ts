import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo } from "@/types";
import type { RootState } from "..";

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    userinfo: null as UserInfo | null,
  },
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.userinfo = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserInfo = (state: RootState) => state?.user?.userinfo;

export default userSlice.reducer;
