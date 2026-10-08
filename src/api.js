export function authHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getStoredUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    return stored && typeof stored === "object" ? stored : null;
  } catch {
    return null;
  }
}
