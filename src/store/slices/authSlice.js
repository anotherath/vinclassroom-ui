import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getInitialAuth = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("auth_user");
    return saved
      ? { user: JSON.parse(saved), isAuthenticated: true }
      : { user: null, isAuthenticated: false };
  }
  return { user: null, isAuthenticated: false };
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Mock validation
    if (email === "demo@vinclassroom.edu.vn" && password === "123456") {
      const user = {
        id: "you",
        name: "Bạn",
        email: "demo@vinclassroom.edu.vn",
        avatar: "Y",
      };
      localStorage.setItem("auth_user", JSON.stringify(user));
      return user;
    }
    throw new Error("Email hoặc mật khẩu không đúng");
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const user = {
      id: "you",
      name,
      email,
      avatar: name.charAt(0).toUpperCase(),
    };
    localStorage.setItem("auth_user", JSON.stringify(user));
    return user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localStorage.removeItem("auth_user");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...getInitialAuth(),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
