import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";
import { use } from "react";

export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async (
    { page, limit = 3, subject, semester, course },
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (subject) params.append("subject", subject);
      if (semester) params.append("semester", semester);
      if (course) params.append("course", course);

      const response = await api.get(`/resource/get?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to load resources");
    }
  },
);

export const fetchDetails = createAsyncThunk(
  "resource/fetchDetails",
  async (resourceid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resource/details/${resourceid}`);

      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const userResource = createAsyncThunk(
  "resource/userResource",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resource/uploader`);

      return response.data.resources;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch",
      );
    }
  },
);

export const upvotes = createAsyncThunk(
  "resource/upvotes",
  async ({ resourceid, userid }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/resource/vote/${resourceid}`);

      return userid;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const downloadfile = createAsyncThunk(
  "resource/downloadfile",
  async (resourceid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resource/download/${resourceid}`);

      return response.data.downloads;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const deletefile = createAsyncThunk(
  "resource/deletefile",
  async (resourceid, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/resource/delete/${resourceid}`);

      return resourceid
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete resource",
      );
    }
  },
);

const resourceSlice = createSlice({
  name: "resource",
  initialState: {
    items: [],
    loading: false,
    hasMore: true,
    error: null,
    page: 1,
    initialLoading: true,
    r: {},
    userItems:[],
  },
  reducers: {
    resetResources: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    incDownload: (state) => {
      state.r = { ...state.r, downloads: state.r.downloads + 1 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        if (state.page === 1) {
          state.initialLoading = true;
        }
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        const { resources, pagination } = action.payload;

        const allItems =
          pagination.page === 1 ? resources : [...state.items, ...resources];

        const uniqueItems = Array.from(
          new Map(allItems.map((item) => [item._id, item])).values(),
        );
        state.items = uniqueItems;
        state.page = pagination.page;
        state.hasMore = pagination.totalPages > state.page;
        state.loading = false;
        state.initialLoading = false;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.r = action.payload;
        state.loading = false;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(upvotes.pending, (state) => {
        state.error = null;
      })
      .addCase(upvotes.fulfilled, (state, action) => {
        const userId = action.payload;
        const alreadyUpvoted = state.r.upvotes.some((u) => u.user === userId);
        const newUpvotes = alreadyUpvoted
          ? state.r.upvotes.filter((u) => u.user !== userId)
          : [...state.r.upvotes, { user: userId }];

        state.r = {
          ...state.r,
          upvotes: newUpvotes,
        };
        state.loading = false;
      })
      .addCase(upvotes.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(downloadfile.pending, (state) => {
        state.error = null;
      })
      .addCase(downloadfile.fulfilled, (state, action) => {})
      .addCase(downloadfile.rejected, (state, action) => {
        state.loading = false;
      });



       builder
      .addCase(userResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userResource.fulfilled, (state, action) => {
        state.userItems = action.payload;
        state.loading = false;
      })
      .addCase(userResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



    builder
      .addCase(deletefile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletefile.fulfilled, (state, action) => {
        state.userItems = state.userItems.filter((u) => u._id !== action.payload)
        state.loading = false;
      })
      .addCase(deletefile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetResources,incDownload } = resourceSlice.actions;
export default resourceSlice.reducer;
