import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  chatId: "",
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const flattendMessages = action.payload.flat();
      state.messages = [...state.messages, ...flattendMessages];
    },

    updateConversation: (state, action) => {
      state.chatId = action.payload;
      state.messages = [];
    },

    clearMessages: (state, action) => {
      state.messages = [];
      state.chatId = "";
    },

    appendMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, updateConversation, clearMessages, appendMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
