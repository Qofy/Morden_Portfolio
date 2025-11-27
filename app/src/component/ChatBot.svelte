<script lang="ts">
  import { X, Send, Loader, ChevronDown } from 'lucide-svelte';
  import { chatStore, type Message } from '../lib/stores';
  import { sendMessageToOllama } from '../lib/api';

  let messageInput = '';
  let chatContainer: HTMLDivElement;

  async function sendMessage() {
    if (!messageInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput.trim(),
      timestamp: Date.now()
    };

    chatStore.addMessage(userMessage);
    messageInput = '';
    chatStore.setLoading(true);

    try {
      const response = await sendMessageToOllama(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      chatStore.addMessage(assistantMessage);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure Ollama is running with: ollama run llama2`,
        timestamp: Date.now()
      };

      chatStore.addMessage(errorMessage);
    } finally {
      chatStore.setLoading(false);
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  $: if (chatContainer && $chatStore.messages.length > 0) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }
</script>

{#if $chatStore.isOpen}
  <div class="chat-overlay" on:click={() => chatStore.closeChat()}></div>
  <div class="chat-container">
    <div class="chat-header">
      <div class="header-content">
        <ChevronDown size={20} />
        <h3>Chat with Kofi Support</h3>
      </div>
      <button class="close-btn" on:click={() => chatStore.closeChat()}>
        <X size={20} />
      </button>
    </div>

    <div class="chat-messages" bind:this={chatContainer}>
      {#if $chatStore.messages.length === 0}
        <div class="welcome-message">
          <p>👋 Hi! I'm an AI assistant that knows all about Kofi's experience and skills.</p>
          <p>Ask me anything like:</p>
          <ul>
            <li>"What is Kofi's experience?"</li>
            <li>"What technologies does Kofi know?"</li>
            <li>"Tell me about Kofi's projects"</li>
          </ul>
        </div>
      {/if}

      {#each $chatStore.messages as message}
        <div class="message {message.role}">
          <div class="message-content">
            {message.content}
          </div>
        </div>
      {/each}

      {#if $chatStore.isLoading}
        <div class="message assistant">
          <div class="message-content loading">
            <Loader size={16} class="spinner" />
            Thinking...
          </div>
        </div>
      {/if}
    </div>

    <div class="chat-input">
      <input
        type="text"
        bind:value={messageInput}
        on:keypress={handleKeyPress}
        placeholder="Ask about Kofi's experience..."
        disabled={$chatStore.isLoading}
      />
      <button
        on:click={sendMessage}
        disabled={!messageInput.trim() || $chatStore.isLoading}
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </div>
  </div>
{/if}

<style>
  .chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease;
  }

  .chat-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 400px;
    max-width: calc(100vw - 4rem);
    height: 600px;
    max-height: calc(100vh - 4rem);
    background: var(--bg-secondary);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
    border: 1px solid var(--border-color);
  }

  .chat-header {
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--bg-primary);
  }

  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }

  .welcome-message {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .welcome-message p {
    margin: 0 0 1rem 0;
  }

  .welcome-message ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }

  .welcome-message li {
    padding: 0.5rem 0;
    color: var(--accent-color);
  }

  .message {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 80%;
  }

  .message.user {
    align-self: flex-end;
  }

  .message.assistant {
    align-self: flex-start;
  }

  .message-content {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.9rem;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message.user .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message.assistant .message-content {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-bottom-left-radius: 4px;
  }

  .message-content.loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .chat-input {
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 0.75rem;
    border-radius: 0 0 12px 12px;
  }

  .chat-input input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.9rem;
    outline: none;
  }

  .chat-input input:focus {
    border-color: #667eea;
  }

  .chat-input button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }

  .chat-input button:hover:not(:disabled) {
    opacity: 0.9;
  }

  .chat-input button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.spinner) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .chat-container {
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }

    .chat-header {
      border-radius: 0;
    }

    .chat-input {
      border-radius: 0;
    }
  }
</style>
