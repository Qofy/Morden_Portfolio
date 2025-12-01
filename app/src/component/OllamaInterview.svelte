<script lang="ts">
import{BriefcaseBusiness, GraduationCap,Code,MonitorCog,Eye, Pencil,Bot} from "lucide-svelte"

  export let user: any;

  let section: 'work' | 'education' | 'projects' = 'work';
  let messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  let currentMessage = '';
  let loading = false;
  let interviewStarted = false;

  function startInterview() {
    interviewStarted = true;
    messages = [];

    const prompts = {
      work: "Hello! I'll help you document your work experience. Let's start with your most recent position. What was your job title?",
      education: "Hi! I'll help you document your education history. Let's begin with your highest degree. What did you study?",
      projects: "Hello! Let's document your projects. Tell me about a project you're proud of. What was it called?"
    };

    messages = [{
      role: 'assistant',
      content: prompts[section]
    }];
  }

  async function sendMessage() {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    currentMessage = '';
    loading = true;

    // Add user message
    messages = [...messages, { role: 'user', content: userMessage }];

    try {
      const response = await fetch('http://localhost:3500/api/ollama-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          section,
          messages: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Ollama Interview Response:', data);

        // Add AI response
        messages = [...messages, {
          role: 'assistant',
          content: data.message || data.response || 'No response received'
        }];

        // Check if interview is complete
        if (data.completed && data.data) {
          messages = [...messages, {
            role: 'assistant',
            content: `Great! I've gathered all the information. Here's what I have:\n\n${JSON.stringify(data.data, null, 2)}\n\nYou can now save this to your portfolio or start over if you'd like to make changes.`
          }];
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ollama Interview Error:', response.status, errorData);
        messages = [...messages, {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorData.error || 'Please try again.'}`
        }];
      }
    } catch (error) {
      console.error('Ollama Interview Exception:', error);
      messages = [...messages, {
        role: 'assistant',
        content: 'Failed to connect to the AI service. Please make sure Ollama is running and the backend is accessible.'
      }];
    } finally {
      loading = false;
    }
  }

  function resetInterview() {
    interviewStarted = false;
    messages = [];
    currentMessage = '';
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="interview">
  <div class="interview-header">
    <h2>AI Interview Assistant</h2>
    <p class="subtitle">Let our AI help you document your experience through conversation</p>
  </div>

  {#if !interviewStarted}
    <div class="start-screen">
      <h3>What would you like to add?</h3>
      <div class="section-selector">
        <label class="section-option">
          <input type="radio" bind:group={section} value="work" />
          <div class="option-card">
            <span class="option-icon"><BriefcaseBusiness/></span>
            <span class="option-title">Work Experience</span>
            <span class="option-desc">Document your professional roles and achievements</span>
          </div>
        </label>

        <label class="section-option">
          <input type="radio" bind:group={section} value="education" />
          <div class="option-card">
            <span class="option-icon"><GraduationCap/></span>
            <span class="option-title">Education</span>
            <span class="option-desc">Add your academic background and qualifications</span>
          </div>
        </label>

        <label class="section-option">
          <input type="radio" bind:group={section} value="projects" />
          <div class="option-card">
            <span class="option-icon"><MonitorCog/></span>
            <span class="option-title">Projects</span>
            <span class="option-desc">Showcase your personal and professional projects</span>
          </div>
        </label>
      </div>

      <button class="btn-start" on:click={startInterview}>
        Start Interview
      </button>

      <div class="info-box">
        <strong>How it works:</strong>
        <p>Our AI will ask you questions about your {section === 'work' ? 'work experience' : section === 'education' ? 'education' : 'projects'}.
        Answer conversationally, and the AI will help structure your responses into a professional format for your portfolio.</p>
      </div>
    </div>
  {:else}
    <div class="chat-container">
      <div class="chat-messages">
        {#each messages as message}
          <div class="message {message.role}">
            <div class="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-content">
              {message.content}
            </div>
          </div>
        {/each}

        {#if loading}
          <div class="message assistant">
            <div class="message-avatar"><Bot/></div>
            <div class="message-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        {/if}
      </div>

      <div class="chat-input-area">
        <textarea
          bind:value={currentMessage}
          on:keypress={handleKeyPress}
          placeholder="Type your response..."
          rows="2"
          disabled={loading}
        ></textarea>
        <div class="chat-actions">
          <button class="btn-reset" on:click={resetInterview}>
            Start Over
          </button>
          <button class="btn-send" on:click={sendMessage} disabled={loading || !currentMessage.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .interview {
    max-width: 800px;
    margin: 0 auto;
  }

  .interview-header {
    text-align: center;
    margin-bottom: 32px;
  }

  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: var(--text-primary);
  }

  h3 {
    margin: 0 0 24px 0;
    font-size: 20px;
    color: var(--text-primary);
    
    text-align: center;
  }

  .subtitle {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .start-screen {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .section-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .section-option {
    cursor: pointer;
  }

  .section-option input {
    display: none;
  }

  .option-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
    background: var(--bg-secondary);
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.3s;
    text-align: center;
  }

  .section-option input:checked + .option-card {
    background: var(--bg-primary);
    border-color: var(--c-border-secondary);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    color: var(--text-secondary);
  }

  .option-card:hover {
    border-color: var(--c-border-secondary);
    transform: translateY(-4px);
  }

  .option-icon {
    font-size: 40px;
  }

  .option-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 16px;
  }

  .option-desc {
    color: #666;
    font-size: 13px;
  }

  .btn-start {
    padding: 16px 32px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    align-self: center;
  }

  .btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  }

  .info-box {
    background: var(--bg-secondary);
    border-left: 4px solid var(--c-border-secondary);
    padding: 16px 20px;
    border-radius: 4px;
  }

  .info-box strong {
    color: var(--text-secondary);
    display: block;
    margin-bottom: 8px;
  }

  .info-box p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.6;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    background: var(--bg-primary);
    border-radius: 8px;
    overflow: hidden;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .message {
    display: flex;
    gap: 12px;
    animation: slideIn 0.3s ease;
    /* background: var(--text-primary); */
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-avatar {
    font-size: 32px;
    flex-shrink: 0;
  }

  .message-content {
    background: var(--bg-secondary);
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 80%;
    white-space: pre-wrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .message.user {
    flex-direction: row-reverse;
  }

  .message.user .message-content {
    background: var(--bg-primary);
    color: var(--text-secondary);
  }

  .typing {
    display: flex;
    gap: 4px;
    padding: 16px;
  }

  .typing span {
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }

  .typing span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }

  .chat-input-area {
    background: var(--bg-primary);
    padding: 16px;
    border-top: 1px solid #e1e4e8;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    box-sizing: border-box;
  }

  textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .chat-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
  }

  .btn-reset {
    padding: 10px 20px;
    background: var(--bg-primary);
    border: 1px solid #ddd;
    border-radius: 6px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-reset:hover {
    border-color:var(--c-border-secondary);
    color: var(--text-secondary);
  }

  .btn-send {
    padding: 10px 32px;
    background: var(--bg-secondary);
    color: white;
    border: 1px solid var(--c-border-secondary);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

  }

  .btn-send:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-send:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .section-selector {
      grid-template-columns: 1fr;
    }

    .chat-container {
      height: 500px;
    }

    .message-content {
      max-width: 90%;
    }
  }
</style>
