import { apiSlice } from "./apiSlice";
import { USER_URL } from "@/constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterMutation } = userApiSlice;
