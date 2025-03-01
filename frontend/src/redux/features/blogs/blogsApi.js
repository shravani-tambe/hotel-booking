import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { blogApi } from "./features/blogs/blogsApi";

export const blogApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5000/api/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: ({ search = "", category = "", location = "" }) =>
        `/blog?search=${search}&category=${category}&location=${location}`,
    }),
  }),
});

export const { useFetchBlogsQuery } = blogApi;
