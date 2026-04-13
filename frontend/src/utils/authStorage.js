import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

// Keys
const SESSION_KEY = "SESSION_USER";
const USER_KEY = "USER";
// --------------------
// Helpers
// --------------------
async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// --------------------
// Session
// --------------------
export async function getSessionUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setSessionUser(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}



// --------------------
// Auth (Backend)
// --------------------
export async function registerUser({ name, email, password }) {
  // expects backend: POST /api/auth/register
  // backend should return user object (and optionally token)
  const data = await request("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

  // If backend returns { user, token } or similar, normalize:
  const user = data?.user ?? data;
  return user;
}

export async function loginUser({ email, password }) {
  // expects backend: POST /api/auth/login
  const data = await request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const user = data?.user ?? data;

  // store session
  await setSessionUser(user);

  return user;
}

// --------------------
// Profile
// --------------------
// NOTE: This requires a backend endpoint.
// If you don't have it yet, keep this disabled or update backend accordingly.
export async function updateProfile({ name }) {
  const session = await getSessionUser();
  if (!session) throw new Error("Not logged in");

  // If your backend supports profile update, use it like this:
  // const data = await request("/api/auth/profile", { method: "PUT", body: { name } });

  // For now (until backend endpoint exists), just update local session:
  const updatedSession = { ...session, name };
  await setSessionUser(updatedSession);
  return updatedSession;
}

// --------------------
// Logout
// --------------------
export async function logoutUser() {
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem("TOKEN");
}