import { writable } from 'svelte/store';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
}

function createChatStore() {
  const { subscribe, set, update } = writable<ChatState>({
    messages: [],
    isLoading: false,
    isOpen: false
  });

  return {
    subscribe,
    addMessage: (message: Message) => update(state => ({
      ...state,
      messages: [...state.messages, message]
    })),
    setLoading: (isLoading: boolean) => update(state => ({
      ...state,
      isLoading
    })),
    toggleChat: () => update(state => ({
      ...state,
      isOpen: !state.isOpen
    })),
    closeChat: () => update(state => ({
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

export const chatStore = createChatStore();

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function createAuthStore() {
  // Check for existing session in localStorage
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;

  const { subscribe, set, update } = writable<AuthState>({
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isAuthenticated: !!storedToken,
    isLoading: false
  });

  return {
    subscribe,
    login: async (email: string, password: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const response = await fetch('http://localhost:3500/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        const user = data.user;

        // Store in localStorage
        localStorage.setItem('authToken', 'authenticated');
        localStorage.setItem('authUser', JSON.stringify(user));

        set({
          user,
          token: 'authenticated',
          isAuthenticated: true,
          isLoading: false
        });

        return { success: true };
      } catch (error) {
        update(state => ({ ...state, isLoading: false }));
        return { success: false, error: (error as Error).message };
      }
    },
    register: async (username: string, email: string, password: string) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const response = await fetch('http://localhost:3500/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        update(state => ({ ...state, isLoading: false }));
        return { success: true };
      } catch (error) {
        update(state => ({ ...state, isLoading: false }));
        return { success: false, error: (error as Error).message };
      }
    },
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });

      // Redirect to home
      window.location.hash = '';
    },
    checkAuth: async () => {
      const token = localStorage.getItem('authToken');
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

export const authStore = createAuthStore();
