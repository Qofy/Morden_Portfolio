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
