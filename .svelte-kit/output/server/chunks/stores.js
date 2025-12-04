import { w as writable } from "./index.js";
function createChatStore() {
  const { subscribe, set, update } = writable({
    messages: [],
    isLoading: false,
    isOpen: false
  });
  return {
    subscribe,
    addMessage: (message) => update((state) => ({
      ...state,
      messages: [...state.messages, message]
    })),
    setLoading: (isLoading) => update((state) => ({
      ...state,
      isLoading
    })),
    toggleChat: () => update((state) => ({
      ...state,
      isOpen: !state.isOpen
    })),
    closeChat: () => update((state) => ({
      ...state,
      isOpen: false
    })),
    reset: () => set({
      messages: [],
      isLoading: false,
      isOpen: false
    })
  };
}
createChatStore();
function createAuthStore() {
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const { subscribe, set, update } = writable({
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isAuthenticated: !!storedToken,
    isLoading: false
  });
  return {
    subscribe,
    login: async (email, password) => {
      update((state) => ({ ...state, isLoading: true }));
      try {
        const response = await fetch("http://localhost:3500/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Login failed");
        }
        const data = await response.json();
        const user = data.user;
        localStorage.setItem("authToken", "authenticated");
        localStorage.setItem("authUser", JSON.stringify(user));
        set({
          user,
          token: "authenticated",
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } catch (error) {
        update((state) => ({ ...state, isLoading: false }));
        return { success: false, error: error.message };
      }
    },
    register: async (username, email, password) => {
      update((state) => ({ ...state, isLoading: true }));
      try {
        const response = await fetch("http://localhost:3500/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Registration failed");
        }
        update((state) => ({ ...state, isLoading: false }));
        return { success: true };
      } catch (error) {
        update((state) => ({ ...state, isLoading: false }));
        return { success: false, error: error.message };
      }
    },
    logout: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    },
    checkAuth: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
        return false;
      }
      return true;
    }
  };
}
const authStore = createAuthStore();
function createPortfolioStore() {
  const { subscribe, set, update } = writable(null);
  return {
    subscribe,
    loadPortfolio: async (username) => {
      try {
        let url = "http://localhost:3500/api/portfolio/";
        if (username) {
          url += username;
        } else {
          set(null);
          return;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          set(data);
          return data;
        } else {
          set(null);
        }
      } catch (error) {
        console.error("Failed to load portfolio:", error);
        set(null);
      }
    },
    clear: () => set(null),
    set
  };
}
const portfolioStore = createPortfolioStore();
export {
  authStore as a,
  portfolioStore as p
};
