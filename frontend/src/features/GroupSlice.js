import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";
import { store } from "../app/store";

const initialState = {
  data: null,
  loading: false,
  error: null,
  h: true,
  s: 0,
  l: 2,
  allposts: [],
  post: null,
  comments: [],
  pageLoading: false,
  groups: [],
  showDeleteModal: false,
  deleteGrpId: null,
  allGroups: [],
  members: [],
  grp: {},
  postloading: false,
  groupPosts: [],
  pageloading: false,
  userGroups: [],
};

export const fetchgroups = createAsyncThunk(
  "group/fetchgroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/group/admin`);

      return {
        groups: response.data.groups,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const fetchUsergroups = createAsyncThunk(
  "group/fetchUsergroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/group/user`);

      return {
        groups: response.data.groups,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const fetchAllgroups = createAsyncThunk(
  "group/fetchAllgroups",
  async ({ sort, searchValue }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (sort) params.append("sort", sort);
      if (searchValue) params.append("searchValue", searchValue);
      const response = await api.get(`/group/all?${params.toString()}`);

      return {
        groups: response.data.groups,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const fetchGrpDetails = createAsyncThunk(
  "group/fetchGrpDetails",
  async (gid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/group/details/${gid}`);
      return response.data.grp;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const fetchGrpPosts = createAsyncThunk(
  "group/fetchGrpPosts",
  async (gid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/group/posts/${gid}`);

      return {
        posts: response.data.posts,
      };
    } catch (error) {
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

// export const liking = createAsyncThunk(
//   "home/liking",
//   async (postid, {dispatch,rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/post/like/${postid}`);
//       await dispatch(fetchdetail(postid))

//       return {suceess:true}
//     } catch (error) {
//       return rejectWithValue(error || "Failed to like post");
//     }
//   },
// );

export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await api.post(`/group/create`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.group;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add group",
      );
    }
  },
);

export const editgrp = createAsyncThunk(
  "group/editgrp",
  async ({ gid, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/group/update/${gid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.group;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post",
      );
    }
  },
);

export const togglegrp = createAsyncThunk(
  "group/togglegrp",
  async ({ gid, userid }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/group/toggle/${gid}`);
      return response.data.updated;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post",
      );
    }
  },
);

export const deletegrp = createAsyncThunk(
  "group/deletegrp",
  async (gid, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/group/del/${gid}`);
      return { gid };
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

const GroupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    openDeleteModal: (state, action) => {
      state.showDeleteModal = true;
      state.deleteGrpId = action.payload;
    },
    closeDeleteGrpModal: (state) => {
      state.showDeleteModal = false;
      state.deleteGrpId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsergroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsergroups.fulfilled, (state, action) => {
        const { groups } = action.payload;

        state.userGroups = groups;

        state.loading = false;
      })
      .addCase(fetchUsergroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchGrpPosts.pending, (state) => {
        state.pageloading = true;
        state.error = null;
      })
      .addCase(fetchGrpPosts.fulfilled, (state, action) => {
        const { posts } = action.payload;
        console.log(posts);
        state.groupPosts = posts;
        state.pageloading = false;
      })
      .addCase(fetchGrpPosts.rejected, (state, action) => {
        state.pageloading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchgroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchgroups.fulfilled, (state, action) => {
        const { groups } = action.payload;

        state.groups = groups;

        state.loading = false;
      })
      .addCase(fetchgroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchAllgroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllgroups.fulfilled, (state, action) => {
        const { groups } = action.payload;
        state.allGroups = groups;
        state.loading = false;
      })

      .addCase(fetchAllgroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchGrpDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchGrpDetails.fulfilled, (state, action) => {
        state.grp = action.payload;
        state.loading = false;
      })

      .addCase(fetchGrpDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createGroup.pending, (state) => {
        state.error = null;
      })

      .addCase(createGroup.fulfilled, (state, action) => {
        console.log(action.payload);
      })

      .addCase(createGroup.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(deletegrp.pending, (state) => {
        state.error = null;
        state.loading = true;
      })

      .addCase(deletegrp.fulfilled, (state, action) => {
        const { gid } = action.payload;
        state.groups = state.groups.filter((g) => g._id !== gid);
        state.deleteGrpId = null;
        state.showDeleteModal = false;
        state.loading = false;
      })

      .addCase(deletegrp.rejected, (state, action) => {
        state.error = action.payload;
        state.deleteGrpId = null;
        state.showDeleteModal = false;
        state.loading = false;
      });

    builder
      .addCase(editgrp.pending, (state) => {
        state.error = null;
      })

      .addCase(editgrp.fulfilled, (state, action) => {
        state.groups = state.groups.map((g) =>
          g._id === action.payload._id ? action.payload : g,
        );
      })

      .addCase(editgrp.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(togglegrp.pending, (state) => {
        state.error = null;
      })

      .addCase(togglegrp.fulfilled, (state, action) => {
        state.grp = action.payload;
      })

      .addCase(togglegrp.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { openDeleteModal, closeDeleteGrpModal } = GroupSlice.actions;
export default GroupSlice.reducer;
