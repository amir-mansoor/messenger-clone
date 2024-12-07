import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import messagesSlice from "./slices/messageSlice";
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    messages: messagesSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
