import {createSlice} from "@reduxjs/toolkit";
import {LIMIT} from "../util/Constants";
import {ChatDTO, Post, User} from "../service";

type InitalStateType = {
  feed: Post[];
  query: string;
  length: number;
  currentChat?: ChatDTO;
  currentUser?: User;
  userLoading: boolean;
};

const initialState: InitalStateType = {
  feed: [],
  length: LIMIT,
  query: "",
  userLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateFeed: (state, action) => {
      state.feed = action.payload;
    },
    setLength: (state, action) => {
      state.length = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
  },
});

export const {updateFeed, setLength, setQuery, setChat, addMessage, setCurrentUser, setUserLoading} =
    userSlice.actions;

export default userSlice.reducer;
