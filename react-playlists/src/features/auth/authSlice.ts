import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  currentUser: string | null;
  users: { email: string; password: string }[];
  error: string | null;
}

const DEFAULT_USER = {
  email: "user@gmail.com",
  password: "123456",
};

const initialState: AuthState = {
  currentUser: null,
  users: [DEFAULT_USER],
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const { email, password } = action.payload;
      const found = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (found) {
        state.currentUser = email; 
        state.error = null;
      } else {
        state.error = "Credenciais inválidas";
      }
    },

    registerUser(
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) {
      const { email, password } = action.payload;

      const alreadyExists = state.users.some((u) => u.email === email);
      if (alreadyExists) {
        state.error = "Usuário já cadastrado.";
        return;
      }

      state.users.push({ email, password });
      state.currentUser = email;
      state.error = null;
    },

    logoutUser(state) {
      state.currentUser = null;
    },

    clearError(state) {
      state.error = null;
    },
  },
});

export const { loginUser, registerUser, logoutUser, clearError } =
  authSlice.actions;
export default authSlice.reducer;
