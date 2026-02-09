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
  pageloading:false
};

export const fetchall = createAsyncThunk(
  "home/fetchall",
  async (_, { rejectWithValue }) => {
    try {
        const {home} = store.getState();
      const { s, l } = home;
      const response = await api.get(`/home/posts?s=${s}&l=${l}`);

       return {
        posts: response.data.posts,
        h: response.data.h, 
        s: s + l,
        l: l
      };
    } catch (error) {
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

// export const updateComment = createAsyncThunk(
//   "home/updatePost",
//   async ({ postid, formData }, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/post/update/${postid}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update post",
//       );
//     }
//   },
// );

// export const DeleteComment = createAsyncThunk(
//   "home/deletePost",
//   async (postid, { rejectWithValue }) => {
//     try {
//       const response = await api.delete(`/post/del/${postid}`);
//       return postid;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to delete post",
//       );
//     }
//   },
// );

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchall.pending, (state) => {
        state.loading = true;
        state.error = null;
      
      })
      .addCase(fetchall.fulfilled, (state, action) => {
         const { posts, h, s, l } = action.payload;

        
        const merged = [...state.allposts,...posts];
        const unique = merged.filter(
          (post, index, self) => index === self.findIndex(p => p._id === post._id)
        );

        state.allposts = unique;
        state.s = s;
        state.l = l;
        state.h = h;
        state.loading = false;
        
        
      })
      .addCase(fetchall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      });
  },
});

// export const { authStart, authSuccess, logout, authFailure, hydrateAuth } = authSlice.actions;
export default homeSlice.reducer;
