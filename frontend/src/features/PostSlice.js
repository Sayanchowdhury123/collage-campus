import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";





export const fetchpost = createAsyncThunk(
  "post/fetchUserPosts",
  async (_, {rejectWithValue}) => {
    try {
   
      const response = await api.get(`/post/user`);
  
      return response.data;
      
    } catch (error) {
  
      return rejectWithValue(
        error.response?.data?.msg || "Failed to load posts",
      );
    }
  },
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ postid, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/post/update/${postid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
           
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post",
      );
    }
  },
);


export const DeletePost = createAsyncThunk(
  "post/deletePost",
  async ( postid,{ rejectWithValue }) => {
    try {
      const response = await api.delete(`/post/del/${postid}`);
      return postid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: null,
    loading: false,
    error: null,
    pagination:null
   
  },
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchpost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchpost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchpost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      
      });


 builder
      .addCase(DeletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(DeletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((p) => p._id !== action.payload)
        
      })
      .addCase(DeletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      
      });
  },
});

export default postSlice.reducer;