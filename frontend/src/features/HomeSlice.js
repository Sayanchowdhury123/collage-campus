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
  pageLoading:false,
};

export const fetchall = createAsyncThunk(
  "home/fetchall",
  async (_, { rejectWithValue }) => {
    try {
      const { home } = store.getState();
      const { s, l } = home;
      const response = await api.get(`/home/posts?s=${s}&l=${l}`);

      return {
        posts: response.data.posts,
        h: response.data.h,
        s: s + l,
        l: l,
      };
    } catch (error) {
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const fetchdetail = createAsyncThunk(
  "home/fetchdetail",
  async (postid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/home/detailed/${postid}`);
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const fetchcom = createAsyncThunk(
  "home/fetchcom",
  async (postid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/home/comments/${postid}`);
      return response.data.comments;
    } catch (error) {
      return rejectWithValue(error || "Failed to load posts");
    }
  },
);

export const liking = createAsyncThunk(
  "home/liking",
  async (postid, {dispatch,rejectWithValue }) => {
    try {
      const response = await api.patch(`/post/like/${postid}`);
      await dispatch(fetchdetail(postid))

      return {suceess:true}
    } catch (error) {
      return rejectWithValue(error || "Failed to like post");
    }
  },
);

export const addcomment = createAsyncThunk(
  "home/addcomment",
  async ({ postid, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/home/add/${postid}`,{message});
      return response.data.comment;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post",
      );
    }
  },
);

export const editcomment = createAsyncThunk(
  "home/editcomment",
  async ({ comid, message }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/home/update/${comid}`,{message});
      return response.data.comment;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post",
      );
    }
  },
);

export const deletecom  = createAsyncThunk(
  "home/deletecom",
  async (commentid, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/home/del/${commentid}`);
      return {commentid}
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

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

        const merged = [...state.allposts, ...posts];
        const unique = merged.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p._id === post._id),
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

    builder
      .addCase(fetchdetail.pending, (state) => {
        state.loading = true;
        state.error = null;

      })

      .addCase(fetchdetail.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      })

      .addCase(fetchdetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchcom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchcom.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })

      .addCase(fetchcom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addcomment.pending, (state) => {
       state.error = null;
      })

      .addCase(addcomment.fulfilled, (state, action) => {
        console.log(action.payload)
        state.comments = [...state.comments,action.payload]
      })

      .addCase(addcomment.rejected, (state, action) => {
        state.error = action.payload;
      });


       builder
      .addCase(deletecom.pending, (state) => {
       state.error = null;
      })

      .addCase(deletecom.fulfilled, (state, action) => {
        console.log(action.payload)
        const {commentid} = action.payload;
        state.comments = state.comments.filter((c) => c._id !== commentid)
      })

      .addCase(deletecom.rejected, (state, action) => {
        state.error = action.payload;
      });


    builder
      .addCase(editcomment.pending, (state) => {
       state.error = null;
      })

      .addCase(editcomment.fulfilled, (state, action) => {
        console.log(action.payload)
        
        state.comments = state.comments.map((c) => c._id === action.payload._id ? action.payload : c)
      })

      .addCase(editcomment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// export const { authStart, authSuccess, logout, authFailure, hydrateAuth } = authSlice.actions;
export default homeSlice.reducer;
