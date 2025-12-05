<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let user: any;

  const dispatch = createEventDispatcher();

  let loading = true;
  let saving = false;
  let message = '';
  let messageType: 'success' | 'error' | '' = '';

  // Portfolio data
  let personal = { name: '', title: '', location: '', bio: '', photo: '', resumeUrl: '', email: '' };
  let workExperience: any[] = [];
  let education: any[] = [];
  let projects: any[] = [];
  let skills: { [category: string]: string[] } = {};
  let socialLinks: any[] = [];
  let blogPosts: any[] = [];

  onMount(async () => {
    await fetchPortfolioData();
  });

  async function fetchPortfolioData() {
    try {
      const response = await fetch(`http://localhost:3500/api/portfolio/${user.username}`);
      if (response.ok) {
        const data = await response.json();
        // Merge personal data to preserve all fields including email
        personal = { ...personal, ...(data.personal || {}) };
        workExperience = data.workExperience || [];
        education = data.education || [];
        projects = data.projects || [];
        skills = data.skills || skills;
        socialLinks = data.socialLinks || [];
        blogPosts = data.blogPosts || [];
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
          userId: user.id,
          personal,
          workExperience,
          education,
          projects,
          skills,
          socialLinks,
          blogPosts,
        }),
      });

      if (response.ok) {
        showMessage('Portfolio saved successfully!', 'success');
        dispatch('saveComplete');
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

  function addBlogPost() {
    blogPosts = [...blogPosts, {
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: [],
      publishedDate: new Date().toISOString().split('T')[0],
      readingTime: 5
    }];
  }

  function removeBlogPost(index: number) {
    blogPosts = blogPosts.filter((_, i) => i !== index);
  }

  function addBlogTag(postIndex: number) {
    const tag = prompt('Enter tag name:');
    if (tag && tag.trim()) {
      if (!blogPosts[postIndex].tags) {
        blogPosts[postIndex].tags = [];
      }
      blogPosts[postIndex].tags = [...blogPosts[postIndex].tags, tag.trim()];
      blogPosts = [...blogPosts]; // Trigger reactivity
    }
  }

  function removeBlogTag(postIndex: number, tagIndex: number) {
    blogPosts[postIndex].tags = blogPosts[postIndex].tags.filter((_, i) => i !== tagIndex);
    blogPosts = [...blogPosts]; // Trigger reactivity
  }

  function addSkillCategory() {
    const categoryName = prompt('Enter skill category name (e.g., Frontend, Backend, DevOps, Mobile):');
    if (categoryName && categoryName.trim()) {
      const key = categoryName.trim();
      if (!skills[key]) {
        skills[key] = [];
        skills = { ...skills }; // Trigger reactivity
      } else {
        alert('This category already exists!');
      }
    }
  }

  function removeSkillCategory(category: string) {
    if (confirm(`Are you sure you want to remove the "${category}" category?`)) {
      delete skills[category];
      skills = { ...skills }; // Trigger reactivity
    }
  }


  function getSkillName(skill: string): string {
    return skill.match(/^(.+?):\s*\d+%?$/)?.[1]?.trim() || skill;
  }

  function getSkillProficiency(skill: string): number {
    const match = skill.match(/^.+?:\s*(\d+)%?$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function arrayToString(arr: string[]): string {
    return arr?.join(', ') || '';
  }

  function stringToArray(str: string): string[] {
    return str.split(',').map(s => s.trim()).filter(s => s);
  }

  function handleProjectImageUpload(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        projects[index].image = evt.target?.result as string;
        projects = projects; // Trigger reactivity
      };
      reader.readAsDataURL(file);
    }
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
          <div class="form-group">
            <label>Email</label>
            <input type="email" bind:value={personal.email} placeholder="your.email@example.com" />
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

      <!-- Blog Posts -->
      <section class="editor-section">
        <div class="section-header">
          <h3>Blog Posts</h3>
          <button class="btn-add" on:click={addBlogPost}>+ Add Blog Post</button>
        </div>
        {#each blogPosts as post, i}
          <div class="item-card">
            <div class="form-grid">
              <div class="form-group">
                <label>Title</label>
                <input type="text" bind:value={post.title} placeholder="Blog post title" />
              </div>
              <div class="form-group">
                <label>Published Date</label>
                <input type="date" bind:value={post.publishedDate} />
              </div>
              <div class="form-group">
                <label>Reading Time (minutes)</label>
                <input type="number" bind:value={post.readingTime} min="1" placeholder="5" />
              </div>
              <div class="form-group full-width">
                <label>Cover Image URL</label>
                <input type="text" bind:value={post.coverImage} placeholder="https://..." />
              </div>
              <div class="form-group full-width">
                <label>Excerpt</label>
                <textarea bind:value={post.excerpt} placeholder="Short description of your blog post..." rows="2"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Content</label>
                <textarea bind:value={post.content} placeholder="Full blog post content..." rows="8"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Tags</label>
                <div class="tags-container">
                  {#each post.tags || [] as tag, tagIndex}
                    <span class="tag">
                      {tag}
                      <button type="button" class="tag-remove" on:click={() => removeBlogTag(i, tagIndex)}>×</button>
                    </span>
                  {/each}
                  <button type="button" class="btn-add-tag" on:click={() => addBlogTag(i)}>+ Add Tag</button>
                </div>
              </div>
            </div>
            <button class="btn-remove" on:click={() => removeBlogPost(i)}>Remove</button>
          </div>
        {/each}
      </section>

      <!-- Work Experience -->
      <section class="editor-section">
        <div class="section-header">
          <h3>Work Experience</h3>
          <button class="btn-add" on:click={addWorkExperience}>+ Add Experience</button>
        </div>
        {#each workExperience as work, i}
          <div class="item-card">
            <div class="form-grid">
              <div class="form-group">
                <label>Period</label>
                <input type="text" bind:value={work.period} placeholder="e.g., 2020-2023" />
              </div>
              <div class="form-group">
                <label>Position</label>
                <input type="text" bind:value={work.position} placeholder="e.g., Senior Developer" />
              </div>
              <div class="form-group">
                <label>Company</label>
                <input type="text" bind:value={work.company} placeholder="e.g., Tech Corp" />
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" bind:value={work.location} placeholder="e.g., Berlin, Germany" />
              </div>
              <div class="form-group full-width">
                <label>Description (comma-separated)</label>
                <textarea
                  on:input={(e) => {
                    work.description = stringToArray(e.currentTarget.value);
                  }}
                  placeholder="Led team of 5, Built microservices, Improved performance by 40%"
                  rows="3"
                >{Array.isArray(work.description) ? arrayToString(work.description) : work.description}</textarea>
              </div>
              <div class="form-group full-width">
                <label>Technologies/Tags (comma-separated, optionally with proficiency)</label>
                <input
                  type="text"
                  value={Array.isArray(work.tags) ? arrayToString(work.tags) : work.tags || ''}
                  on:input={(e) => (work.tags = stringToArray(e.currentTarget.value))}
                  placeholder="React: 90%, Node.js: 85%, AWS, Docker: 75%"
                />
                <small style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; display: block;">
                  Format: "Tech: percentage%" or just "Tech". Example: "React: 90%, Node.js, AWS: 80%"
                </small>

                {#if work.tags && work.tags.length > 0}
                  <div class="proficiency-trackers">
                    {#each work.tags as tag, tagIndex}
                      <div class="tracker-item">
                        <div class="tracker-header">
                          <span class="tracker-name">{getSkillName(tag)}</span>
                          <span class="tracker-percentage">{getSkillProficiency(tag) || 0}%</span>
                        </div>
                        <div class="proficiency-bar">
                          <div class="proficiency-fill" style="width: {getSkillProficiency(tag) || 0}%"></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
            <button class="btn-remove" on:click={() => removeWorkExperience(i)}>Remove</button>
          </div>
        {/each}
      </section>

      <!-- Education -->
      <section class="editor-section">
        <div class="section-header">
          <h3>Education</h3>
          <button class="btn-add" on:click={addEducation}>+ Add Education</button>
        </div>
        {#each education as edu, i}
          <div class="item-card">
            <div class="form-grid">
              <div class="form-group">
                <label>Period</label>
                <input type="text" bind:value={edu.period} placeholder="e.g., 2016-2020" />
              </div>
              <div class="form-group">
                <label>Degree</label>
                <input type="text" bind:value={edu.degree} placeholder="e.g., Bachelor of Computer Science" />
              </div>
              <div class="form-group">
                <label>Institution</label>
                <input type="text" bind:value={edu.institution} placeholder="e.g., University of Berlin" />
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" bind:value={edu.location} placeholder="e.g., Berlin, Germany" />
              </div>
              <div class="form-group full-width">
                <label>Description (comma-separated)</label>
                <textarea
                  on:input={(e) => {
                    if (typeof edu.description === 'string') {
                      edu.description = stringToArray(edu.description);
                    }
                  }}
                  placeholder="Graduated with honors, Thesis on AI, Active in coding club"
                  rows="3"
                >{Array.isArray(edu.description) ? arrayToString(edu.description) : edu.description}</textarea>
              </div>
            </div>
            <button class="btn-remove" on:click={() => removeEducation(i)}>Remove</button>
          </div>
        {/each}
      </section>

      <!-- Projects -->
      <section class="editor-section">
        <div class="section-header">
          <h3>Projects</h3>
          <button class="btn-add" on:click={addProject}>+ Add Project</button>
        </div>
        {#each projects as project, i}
          <div class="item-card">
            <div class="form-grid">
              <div class="form-group">
                <label>Title</label>
                <input type="text" bind:value={project.title} placeholder="e.g., E-commerce Platform" />
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea bind:value={project.description} placeholder="Describe your project" rows="3"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Technologies (comma-separated, optionally with proficiency)</label>
                <input
                  type="text"
                  value={Array.isArray(project.technologies) ? arrayToString(project.technologies) : project.technologies || ''}
                  on:input={(e) => (project.technologies = stringToArray(e.currentTarget.value))}
                  placeholder="React: 90%, Node.js: 85%, MongoDB"
                />
                <small style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; display: block;">
                  Format: "Tech: percentage%" or just "Tech". Example: "React: 90%, Node.js, MongoDB: 80%"
                </small>

                {#if project.technologies && project.technologies.length > 0}
                  <div class="proficiency-trackers">
                    {#each project.technologies as tech, techIndex}
                      <div class="tracker-item">
                        <div class="tracker-header">
                          <span class="tracker-name">{getSkillName(tech)}</span>
                          <span class="tracker-percentage">{getSkillProficiency(tech) || 0}%</span>
                        </div>
                        <div class="proficiency-bar">
                          <div class="proficiency-fill" style="width: {getSkillProficiency(tech) || 0}%"></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
              <div class="form-group">
                <label>Project Image (Upload or Base64)</label>
                <input type="file" accept="image/*" on:change={(e) => handleProjectImageUpload(e, i)} />
                {#if project.image}
                  <img src={project.image} alt="Project" class="preview-image" />
                {/if}
              </div>
              <div class="form-group">
                <label>Live URL</label>
                <input type="text" bind:value={project.liveUrl} placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>GitHub URL</label>
                <input type="text" bind:value={project.githubUrl} placeholder="https://github.com/..." />
              </div>
            </div>
            <button class="btn-remove" on:click={() => removeProject(i)}>Remove</button>
          </div>
        {/each}
      </section>

      <!-- Skills -->
      <section class="editor-section">
        <div class="section-header">
          <h3>Skills</h3>
          <button class="btn-add" on:click={addSkillCategory}>+ Add Category</button>
        </div>
        {#if Object.keys(skills).length === 0}
          <p class="empty-message">No skill categories yet. Click "+ Add Category" to create one!</p>
        {:else}
          {#each Object.keys(skills) as category}
            <div class="item-card">
              <div class="category-header">
                <h4>{category}</h4>
                <button class="btn-remove-small" on:click={() => removeSkillCategory(category)}>Remove Category</button>
              </div>
              <div class="form-group full-width">
                <label>Skills (comma-separated, optionally with proficiency)</label>
                <input
                  type="text"
                  value={arrayToString(skills[category])}
                  on:input={(e) => {
                    skills[category] = stringToArray(e.currentTarget.value);
                    skills = { ...skills };
                  }}
                  placeholder="Python: 90%, JavaScript: 85%, React, Docker: 75%"
                />
                <small style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; display: block;">
                  Format: "Skill: percentage%" or just "Skill". Example: "Python: 90%, JavaScript, React: 85%"
                </small>
              </div>

              {#if skills[category].length > 0}
                <div class="proficiency-trackers">
                  {#each skills[category] as skill, skillIndex}
                    <div class="tracker-item">
                      <div class="tracker-header">
                        <span class="tracker-name">{getSkillName(skill)}</span>
                        <span class="tracker-percentage">{getSkillProficiency(skill) || 0}%</span>
                      </div>
                      <div class="proficiency-bar">
                        <div class="proficiency-fill" style="width: {getSkillProficiency(skill) || 0}%"></div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        {/if}
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
    color: var(--text-primary);
  }

  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
       color: var(--text-primary);
  }

  .btn-save {
    padding: 12px 24px;
    background: var(--bg-secondary);
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
    background: var(--text-secondary);
    /* border: 1px solid #667eea; */
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-add:hover {
    background: var(--bg-secondary);
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
    color: var(--text-secondary);
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
    background: var(--bg-secondary);
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
    background: var(--text-secondary);
    color: var(--text-primary);
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-remove:hover {
    background: var(--bg-secondary);
    border: 1px solid var(--c-border-secondary);
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 12px;
    color: var(--text-primary);
  }

  .tag-remove {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0 4px;
    font-size: 16px;
    line-height: 1;
  }

  .tag-remove:hover {
    color: #ff3b30;
  }

  .btn-add-tag {
    padding: 4px 12px;
    background: transparent;
    border: 1px dashed var(--border-color);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-add-tag:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .category-header h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 600;
  }

  .btn-remove-small {
    padding: 6px 12px;
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    border: 1px solid rgba(255, 59, 48, 0.3);
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-remove-small:hover {
    background: rgba(255, 59, 48, 0.2);
    border-color: #ff3b30;
  }

  .empty-message {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    font-style: italic;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 2px dashed rgba(255, 255, 255, 0.1);
  }

  .empty-message-small {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
    font-style: italic;
    font-size: 14px;
  }

  .proficiency-trackers {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
    padding: 16px;
    background: rgba(255, 155, 255, 0.02);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .tracker-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tracker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tracker-name {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 14px;
  }

  .tracker-percentage {
    font-weight: 600;
    color: #fff;
    font-size: 13px;
  }

  .proficiency-bar {
    width: 100%;
    height: 8px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .proficiency-fill {
    height: 100%;
    background: var(--text-secondary);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
  }

  .proficiency-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
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
