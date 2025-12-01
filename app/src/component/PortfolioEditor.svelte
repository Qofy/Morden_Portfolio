<script lang="ts">
  import { onMount } from 'svelte';

  export let user: any;

  let loading = true;
  let saving = false;
  let message = '';
  let messageType: 'success' | 'error' | '' = '';

  // Portfolio data
  let personal = { name: '', title: '', location: '', bio: '', photo: '', resumeUrl: '' };
  let workExperience: any[] = [];
  let education: any[] = [];
  let projects: any[] = [];
  let skills = { frontend: [], backend: [], tools: [], other: [] };
  let socialLinks: any[] = [];

  onMount(async () => {
    await fetchPortfolioData();
  });

  async function fetchPortfolioData() {
    try {
      const response = await fetch(`http://localhost:3500/api/portfolio/${user.username}`);
      if (response.ok) {
        const data = await response.json();
        personal = data.personal || personal;
        workExperience = data.workExperience || [];
        education = data.education || [];
        projects = data.projects || [];
        skills = data.skills || skills;
        socialLinks = data.socialLinks || [];
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      showMessage('Failed to load portfolio data', 'error');
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    saving = true;
    messageType = '';
    message = '';

    try {
      const response = await fetch('http://localhost:3500/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          personal,
          workExperience,
          education,
          projects,
          skills,
          socialLinks,
        }),
      });

      if (response.ok) {
        showMessage('Portfolio saved successfully!', 'success');
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to save portfolio', 'error');
      }
    } catch (error) {
      showMessage('Failed to save portfolio', 'error');
    } finally {
      saving = false;
    }
  }

  function showMessage(text: string, type: 'success' | 'error') {
    message = text;
    messageType = type;
    setTimeout(() => {
      message = '';
      messageType = '';
    }, 5000);
  }

  function handleImageUpload(event: Event, field: 'photo' | 'resume') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (field === 'photo') {
          personal.photo = base64;
        } else {
          personal.resumeUrl = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function addWorkExperience() {
    workExperience = [...workExperience, {
      period: '',
      position: '',
      company: '',
      location: '',
      description: [],
      tags: []
    }];
  }

  function removeWorkExperience(index: number) {
    workExperience = workExperience.filter((_, i) => i !== index);
  }

  function addEducation() {
    education = [...education, {
      period: '',
      degree: '',
      institution: '',
      location: '',
      description: []
    }];
  }

  function removeEducation(index: number) {
    education = education.filter((_, i) => i !== index);
  }

  function addProject() {
    projects = [...projects, {
      title: '',
      description: '',
      technologies: [],
      image: '',
      liveUrl: '',
      githubUrl: ''
    }];
  }

  function removeProject(index: number) {
    projects = projects.filter((_, i) => i !== index);
  }

  function addSocialLink() {
    socialLinks = [...socialLinks, { name: '', icon: '', url: '' }];
  }

  function removeSocialLink(index: number) {
    socialLinks = socialLinks.filter((_, i) => i !== index);
  }

  function arrayToString(arr: string[]): string {
    return arr.join(', ');
  }

  function stringToArray(str: string): string[] {
    return str.split(',').map(s => s.trim()).filter(s => s);
  }
</script>

<div class="editor">
  {#if message}
    <div class="message {messageType}">{message}</div>
  {/if}

  {#if loading}
    <div class="loading">Loading portfolio data...</div>
  {:else}
    <div class="editor-header">
      <h2>Edit Your Portfolio</h2>
      <button class="btn-save" on:click={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>

    <div class="editor-content">
      <!-- Personal Information -->
      <section class="editor-section">
        <h3>Personal Information</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" bind:value={personal.name} placeholder="Your Name" />
          </div>
          <div class="form-group">
            <label>Professional Title</label>
            <input type="text" bind:value={personal.title} placeholder="e.g., Full Stack Developer" />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" bind:value={personal.location} placeholder="e.g., Berlin, Germany" />
          </div>
          <div class="form-group full-width">
            <label>Bio</label>
            <textarea bind:value={personal.bio} placeholder="Tell us about yourself" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Profile Photo (Upload or Base64)</label>
            <input type="file" accept="image/*" on:change={(e) => handleImageUpload(e, 'photo')} />
            {#if personal.photo}
              <img src={personal.photo} alt="Profile" class="preview-image" />
            {/if}
          </div>
          <div class="form-group">
            <label>Resume URL</label>
            <input type="text" bind:value={personal.resumeUrl} placeholder="https://..." />
          </div>
        </div>
      </section>

      <!-- Social Links -->
      <section class="editor-section">
        <div class="section-header">
          <h3>Social Links</h3>
          <button class="btn-add" on:click={addSocialLink}>+ Add Link</button>
        </div>
        {#each socialLinks as link, i}
          <div class="item-card">
            <div class="form-grid">
              <div class="form-group">
                <label>Name</label>
                <input type="text" bind:value={link.name} placeholder="e.g., LinkedIn" />
              </div>
              <div class="form-group">
                <label>Icon</label>
                <input type="text" bind:value={link.icon} placeholder="e.g., linkedin" />
              </div>
              <div class="form-group">
                <label>URL</label>
                <input type="text" bind:value={link.url} placeholder="https://..." />
              </div>
            </div>
            <button class="btn-remove" on:click={() => removeSocialLink(i)}>Remove</button>
          </div>
        {/each}
      </section>

      <!-- Skills -->
      <section class="editor-section">
        <h3>Skills</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Frontend (comma-separated)</label>
            <input
              type="text"
              value={arrayToString(skills.frontend)}
              on:input={(e) => (skills.frontend = stringToArray(e.currentTarget.value))}
              placeholder="React, Vue, Svelte"
            />
          </div>
          <div class="form-group">
            <label>Backend (comma-separated)</label>
            <input
              type="text"
              value={arrayToString(skills.backend)}
              on:input={(e) => (skills.backend = stringToArray(e.currentTarget.value))}
              placeholder="Node.js, Python, Go"
            />
          </div>
          <div class="form-group">
            <label>Tools (comma-separated)</label>
            <input
              type="text"
              value={arrayToString(skills.tools)}
              on:input={(e) => (skills.tools = stringToArray(e.currentTarget.value))}
              placeholder="Git, Docker, AWS"
            />
          </div>
          <div class="form-group">
            <label>Other (comma-separated)</label>
            <input
              type="text"
              value={arrayToString(skills.other)}
              on:input={(e) => (skills.other = stringToArray(e.currentTarget.value))}
              placeholder="Figma, Photoshop"
            />
          </div>
        </div>
      </section>

      <!-- Save Button at Bottom -->
      <div class="editor-footer">
        <button class="btn-save" on:click={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .editor {
    max-width: 900px;
  }

  .message {
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 24px;
    font-size: 14px;
  }

  .message.success {
    background: #efe;
    border: 1px solid #cfc;
    color: #3c3;
  }

  .message.error {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
  }

  .loading {
    padding: 40px;
    text-align: center;
    color: #666;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  h2 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }

  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #333;
  }

  .btn-save {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .editor-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .editor-section {
    padding-bottom: 32px;
    border-bottom: 1px solid #e1e4e8;
  }

  .editor-section:last-child {
    border-bottom: none;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .btn-add {
    padding: 8px 16px;
    background: white;
    border: 1px solid #667eea;
    border-radius: 6px;
    color: #667eea;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-add:hover {
    background: #667eea;
    color: white;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  label {
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    font-size: 14px;
  }

  input, textarea {
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.3s;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .preview-image {
    margin-top: 12px;
    max-width: 150px;
    max-height: 150px;
    border-radius: 8px;
    object-fit: cover;
  }

  .item-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    position: relative;
  }

  .btn-remove {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 12px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-remove:hover {
    background: #ee3d4d;
  }

  .editor-footer {
    display: flex;
    justify-content: center;
    padding-top: 24px;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .editor-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .btn-remove {
      position: static;
      margin-top: 12px;
      width: 100%;
    }
  }
</style>
