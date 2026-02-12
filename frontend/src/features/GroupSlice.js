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
};

export const fetchgroups = createAsyncThunk(
  "group/fetchgroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/group/get`);

      return {
        groups: response.data.groups,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

// export const fetchdetail = createAsyncThunk(
//   "home/fetchdetail",
//   async (postid, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/home/detailed/${postid}`);
//       return response.data.post;
//     } catch (error) {
//       return rejectWithValue(error || "Failed to load posts");
//     }
//   },
// );

// export const fetchcom = createAsyncThunk(
//   "home/fetchcom",
//   async (postid, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/home/comments/${postid}`);
//       return response.data.comments;
//     } catch (error) {
//       return rejectWithValue(error || "Failed to load posts");
//     }
//   },
// );

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
  async (gid, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/group/toggle/${gid}`);
      return {
        groups: response.data.group,
        userid: response.data.userid,
      };
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

    // builder
    //   .addCase(fetchdetail.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;

    //   })

    //   .addCase(fetchdetail.fulfilled, (state, action) => {
    //     state.post = action.payload;
    //     state.loading = false;
    //   })

    //   .addCase(fetchdetail.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });

    // builder
    //   .addCase(fetchcom.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })

    //   .addCase(fetchcom.fulfilled, (state, action) => {
    //     state.comments = action.payload;
    //     state.loading = false;
    //   })

    //   .addCase(fetchcom.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });

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
        state.loading=false;
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
        const {groups,userid} = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === action.payload._id ? action.payload : g,
        );
      })

      .addCase(togglegrp.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { openDeleteModal, closeDeleteGrpModal } = GroupSlice.actions;
export default GroupSlice.reducer;
