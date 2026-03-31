import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const readStorage = () => {
  try {
    const token = localStorage.getItem("userToken");
    const user = JSON.parse(localStorage.getItem("userData") || "null");
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStorage().token);
  const [user, setUser] = useState(() => readStorage().user);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("userToken", newToken);
    localStorage.setItem("userData", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("userData", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn: !!token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
