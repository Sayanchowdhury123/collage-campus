import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { socket } from "../services/socket";
import api from "../axios";

const initialState = {
  socket: null,
  showNotification: false,
  latestNotification: null,
  items: [],
  loading: false,
  hasMore: true,
  error: null,
  page:1,
  initialLoading:false
};

export const fetchNotifications = createAsyncThunk(
  "socket/fetchNotifications",
  async ({ page, limit = 5 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      const response = await api.get(
        `/resource/notifications?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to load resources");
    }
  },
);
const SocketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.showNotification = true;
      state.latestNotification = action.payload;
    },
    hideNotification: (state) => {
      state.showNotification = false;
      state.latestNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        if (state.page === 1) {
          state.initialLoading = true;
        }
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, pagination } = action.payload;

        const allItems =
          pagination.page === 1
            ? notifications
            : [...state.items, ...notifications];

        const uniqueItems = Array.from(
          new Map(allItems.map((item) => [item._id, item])).values(),
        );
        state.items = uniqueItems;
        state.page = pagination.page;
        state.hasMore = pagination.totalPages > state.page;
        state.loading = false;
        state.initialLoading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.error = action.payload;
      });
  },
});

export const { showNotification, hideNotification } = SocketSlice.actions;
export default SocketSlice.reducer;
