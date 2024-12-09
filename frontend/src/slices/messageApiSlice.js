import { MESSAGE_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ chatId }) => ({
        url: `${MESSAGE_URL}/${chatId}`,
      }),
    }),

    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApiSlice;
