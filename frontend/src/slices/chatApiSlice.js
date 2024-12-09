import { CONVERSATION_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => ({
        url: `${CONVERSATION_URL}`,
      }),
    }),
  }),
});

export const { useGetChatsQuery } = chatApiSlice;
