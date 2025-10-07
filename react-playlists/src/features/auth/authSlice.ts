import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  password: string;
}

interface AuthState {
  currentUser: User | null;
  error: string | null;
}

const USERS_KEY = "users";
const SESSION_KEY = "sessionUser";

function getStoredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user: User) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function loadSession(): User | null {
  const data = sessionStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: loadSession(),
    error: null,
  } as AuthState,
  reducers: {
    registerUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      const users = getStoredUsers();

      const exists = users.find((u) => u.email === email);
      if (exists) {
        state.error = "E-mail já cadastrado.";
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password,
      };

      users.push(newUser);
      saveUsers(users);

      state.currentUser = newUser;
      saveSession(newUser);
      state.error = null;
    },

    loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      const users = getStoredUsers();

      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        state.error = "E-mail ou senha inválidos.";
        return;
      }

      state.currentUser = user;
      saveSession(user);
      state.error = null;
    },

    loginDefaultUser: (state) => {
      const defaultUser: User = {
        id: "default-user",
        email: "user@pinkify.com",
        password: "123456",
      };

      const users = getStoredUsers();
      const exists = users.some((u) => u.email === defaultUser.email);
      if (!exists) {
        users.push(defaultUser);
        saveUsers(users);
      }

      state.currentUser = defaultUser;
      saveSession(defaultUser);
      state.error = null;
    },

    logoutUser: (state) => {
      state.currentUser = null;
      clearSession();
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  registerUser,
  loginUser,
  logoutUser,
  clearError,
  loginDefaultUser,
} = authSlice.actions;

export default authSlice.reducer;
