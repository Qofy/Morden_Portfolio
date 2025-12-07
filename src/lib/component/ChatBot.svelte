<script lang="ts">
  import { X, Send, Loader, ChevronDown, Pin, Gift, Rocket } from 'lucide-svelte';
  import { chatStore, portfolioStore, type Message } from '$lib/stores';
  import { sendMessageToOllama } from '$lib/api';

  let messageInput = '';
  let chatContainer: HTMLDivElement;
  let shouldAutoScroll = true;
  let currentPortfolio: any = null;

  portfolioStore.subscribe((data) => {
    currentPortfolio = data;
  });

  function scrollToBottom() {
    if (chatContainer && shouldAutoScroll) {
      requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      });
    }
  }

  function handleScroll() {
    if (!chatContainer) return;

    // Check if user is near the bottom (within 100px)
    const threshold = 100;
    const isNearBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < threshold;

    shouldAutoScroll = isNearBottom;
  }

  async function sendMessage() {
    if (!messageInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput.trim(),
      timestamp: Date.now()
    };

    chatStore.addMessage(userMessage);
    const userInput = messageInput.trim();
    messageInput = '';
    chatStore.setLoading(true);

    // Always scroll to bottom when sending a message
    shouldAutoScroll = true;
    setTimeout(scrollToBottom, 50);

    try {
      // Check for keyword-based quick response first
      const keywordResponse = detectKeywordResponse(userInput);

      let response: string;
      if (keywordResponse) {
        // Use instant keyword response
        response = keywordResponse;
        // Small delay to feel natural
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        // Use Ollama for complex queries
        response = await sendMessageToOllama(userInput, currentPortfolio);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      chatStore.addMessage(assistantMessage);
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure Ollama is running with: ollama run qwen2.5:0.5b`,
        timestamp: Date.now()
      };

      chatStore.addMessage(errorMessage);
      setTimeout(scrollToBottom, 50);
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

  /**
   * Detect keywords in user message and provide quick focused responses
   */
  function detectKeywordResponse(message: string): string | null {
    if (!currentPortfolio) return null;

    const lowerMessage = message.toLowerCase().trim();
    const words = lowerMessage.split(/\s+/);

    // If message is too long (>5 words), don't treat as keyword query
    if (words.length > 5) return null;

    // Extract all skills/technologies from portfolio with extended metadata
    const allSkills: {
      skill: string;
      proficiency: number;
      years: number | null;
      notes: string | null;
      category: string;
    }[] = [];

    Object.entries(currentPortfolio.skills || {}).forEach(([category, skills]: [string, any]) => {
      if (Array.isArray(skills)) {
        skills.forEach((skill: string) => {
          // Parse "Python: 90% | 5yrs | Built scalable APIs" format
          const fullMatch = skill.match(/^(.+?)(?::\s*(\d+)%?)?(?:\s*\|\s*(\d+)yrs?)?(?:\s*\|\s*(.+))?$/);

          if (fullMatch) {
            allSkills.push({
              skill: fullMatch[1].trim().toLowerCase(),
              proficiency: fullMatch[2] ? parseInt(fullMatch[2], 10) : 0,
              years: fullMatch[3] ? parseInt(fullMatch[3], 10) : null,
              notes: fullMatch[4] ? fullMatch[4].trim() : null,
              category
            });
          } else {
            allSkills.push({
              skill: skill.toLowerCase(),
              proficiency: 0,
              years: null,
              notes: null,
              category
            });
          }
        });
      }
    });

    // Check if message contains a skill keyword
    for (const { skill, proficiency, years, notes, category } of allSkills) {
      if (lowerMessage.includes(skill)) {
        // Find where this skill was used
        const workUses: string[] = [];
        const projectUses: string[] = [];

        // Check work experience
        currentPortfolio.workExperience?.forEach((exp: any) => {
          const tags = exp.tags || [];
          const hasSkill = tags.some((tag: string) =>
            tag.toLowerCase().includes(skill)
          );
          if (hasSkill) {
            workUses.push(`${exp.position || exp.title} at ${exp.company} (${exp.period})`);
          }
        });

        // Check projects
        currentPortfolio.projects?.forEach((proj: any) => {
          const techs = proj.technologies || [];
          const hasSkill = techs.some((tech: string) =>
            tech.toLowerCase().includes(skill)
          );
          if (hasSkill) {
            projectUses.push(proj.title);
          }
        });

        // Build professional response
        let response = `# ${skill.charAt(0).toUpperCase() + skill.slice(1)}\n\n`;

        // Expertise section
        response += `## 📊 Expertise Level\n`;
        if (proficiency > 0) {
          const level = proficiency >= 80 ? 'Expert' : proficiency >= 60 ? 'Advanced' : proficiency >= 40 ? 'Intermediate' : 'Beginner';
          response += `**Proficiency:** ${proficiency}% (${level})\n`;
        }

        if (years !== null) {
          response += `**Experience:** ${years} year${years !== 1 ? 's' : ''}\n`;
        }

        response += `**Category:** ${category}\n\n`;

        // Notes section
        if (notes) {
          response += `## 💡 Key Highlights\n${notes}\n\n`;
        }

        // Practical application section
        if (workUses.length > 0 || projectUses.length > 0) {
          response += `## 🚀 Practical Application\n`;

          if (workUses.length > 0) {
            response += `**Professional Experience:**\n`;
            workUses.forEach(use => {
              response += `• ${use}\n`;
            });
            response += `\n`;
          }

          if (projectUses.length > 0) {
            response += `**Projects:**\n`;
            projectUses.forEach(proj => {
              response += `• ${proj}\n`;
            });
          }
        }

        if (workUses.length === 0 && projectUses.length === 0) {
          response += `## 🎯 Background\nI have experience with ${skill} as part of my ${category} skill set.`;
        }

        return response;
      }
    }

    return null;
  }
</script>

{#if $chatStore.isOpen}
  <div
    class="chat-overlay"
    role="button"
    tabindex="-1"
    on:click={() => chatStore.closeChat()}
    on:keydown={(e) => e.key === 'Escape' && chatStore.closeChat()}
  ></div>
  <div class="chat-container">
    <div class="chat-header">
      <div class="header-content">
        <ChevronDown size={20} />
        {#if currentPortfolio?.personal?.photo}
          <img src={currentPortfolio.personal.photo} alt="Profile" class="profile-picture" />
        {:else}
          <div class="profile-placeholder">
            {currentPortfolio?.personal?.name?.charAt(0) || 'P'}
          </div>
        {/if}
        <div class="profile-info">
          <h3>{currentPortfolio?.personal?.name || 'Portfolio Assistant'}</h3>
          {#if currentPortfolio?.personal?.title}
            <span class="professional-title">{currentPortfolio.personal.title}</span>
          {/if}
        </div>
      </div>
      <button class="close-btn" on:click={() => chatStore.closeChat()}>
        <X size={20} />
      </button>
    </div>

    <div class="chat-messages" bind:this={chatContainer} on:scroll={handleScroll}>
      {#if $chatStore.messages.length === 0}
        <div class="welcome-message">
          <p>👋 Hi! I'm here to answer questions about my professional background.</p>

          {#if currentPortfolio}
            <div class="timeline-section">
              <h4><Pin/> Past</h4>
              <p>
                {#if currentPortfolio.workExperience && currentPortfolio.workExperience.length > 1}
                  Previously worked as {currentPortfolio.workExperience[currentPortfolio.workExperience.length - 1]?.position || 'a professional'}
                  at {currentPortfolio.workExperience[currentPortfolio.workExperience.length - 1]?.company || 'various companies'}
                {:else if currentPortfolio.education && currentPortfolio.education.length > 0}
                  Studied {currentPortfolio.education[0]?.degree || 'at university'}
                  at {currentPortfolio.education[0]?.institution || 'an institution'}
                {:else}
                  Building experience in the field
                {/if}
              </p>
            </div>

            <div class="timeline-section">
              <h4><Gift/> Present</h4>
              <p>
                {#if currentPortfolio.workExperience && currentPortfolio.workExperience.length > 0}
                  Currently working as {currentPortfolio.workExperience[0]?.position || currentPortfolio.workExperience[0]?.title || 'a professional'}
                  at {currentPortfolio.workExperience[0]?.company || 'a company'}
                {:else if currentPortfolio.personal?.title}
                  {currentPortfolio.personal.title}
                {:else}
                  Exploring opportunities
                {/if}
              </p>
            </div>

            <div class="timeline-section">
              <h4><Rocket/> Future</h4>
              <p>
                {#if Object.keys(currentPortfolio.skills || {}).length > 0}
                  Looking to leverage my skills in {Object.keys(currentPortfolio.skills).slice(0, 2).join(' and ')}
                  to create impactful solutions
                {:else}
                  Excited to take on new challenges and opportunities
                {/if}
              </p>
            </div>
          {:else}
            <p>Loading professional background...</p>
          {/if}

          <p style="font-size: 0.85rem; opacity: 0.8; margin-top: 1rem;">
            Feel free to ask me about my work experience, skills, projects, or educational background.
          </p>
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
        placeholder="Ask me about my experience, skills, or projects..."
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
    background: var(--bg-secondary);
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .profile-picture {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .profile-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    font-size: 1.1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .professional-title {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
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

  .timeline-section {
    background: rgba(255, 255, 255, 0.03);
    border-left: 3px solid var(--text-secondary);
    padding: 12px 16px;
    margin: 12px 0;
    border-radius: 4px;
  }

  .timeline-section h4 {
    margin: 0 0 8px 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  .timeline-section p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
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
    background: #fff;
    color: var(--bg-hover);
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
    
    background: var(--text-secondary);
    border: none;
    color: rgb(21, 21, 21);
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
