import { BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutReducer } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

async function fetchBaseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  if (result.error && result.status == 401) {
    api.dispatch(logoutReducer());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: fetchBaseQueryWithAuth,
  endpoints: (builder) => ({}),
});
