import {createSlice} from "@reduxjs/toolkit";
import {User} from "../service";

type InitialStateType = {
  currentUser?: User;
  userLoading: boolean;
};

const initialState: InitialStateType = {
  userLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = undefined;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
  },
});

export const {setCurrentUser, clearUser, setUserLoading} = userSlice.actions;

export default userSlice.reducer;
