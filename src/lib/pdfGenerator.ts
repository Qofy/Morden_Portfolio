import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  margin?: number;
}

/**
 * Generates a PDF from a given HTML element
 * @param element - The HTML element to convert to PDF
 * @param options - PDF generation options
 */
export async function generatePDF(
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> {
  const {
    filename = 'portfolio.pdf',
    quality = 1.0,
    scale = 3,
    margin = 10
  } = options;

  try {
    // Get computed background color
    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor || '#ffffff';

    // Capture the element as a canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: bgColor,
      windowWidth: 1920, // Fixed width for consistent rendering
      windowHeight: element.scrollHeight,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      imageTimeout: 0,
      removeContainer: true,
    });

    // Get canvas dimensions
    const imgWidth = 210 - (margin * 2); // A4 width in mm minus margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/jpeg', quality);

    // Calculate number of pages needed
    const pageHeight = pdf.internal.pageSize.getHeight() - (margin * 2);
    let heightLeft = imgHeight;
    let position = margin;
    let page = 1;

    // Add first page
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      page++;
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Opens the current page in a new window for printing to PDF
 * This is a fallback method if generatePDF fails
 */
export function printToPDF(): void {
  window.print();
}

/**
 * Generates a professional resume-style PDF with clean white background
 * @param username - The username for the filename
 */
export async function generatePortfolioPDF(username: string): Promise<void> {
  // Get portfolio data from store
  const portfolioElement = document.querySelector('.portfolio-view') as HTMLElement;
  if (!portfolioElement) {
    throw new Error('Portfolio container not found');
  }

  // Create a temporary resume-style container
  const resumeContainer = document.createElement('div');
  resumeContainer.id = 'pdf-resume-container';
  resumeContainer.style.cssText = `
    position: fixed;
    top: -10000px;
    left: -10000px;
    width: 210mm;
    background: white;
    padding: 20mm;
    font-family: 'Arial', 'Helvetica', sans-serif;
    color: #000;
    line-height: 1.6;
  `;

  // Extract data from DOM
  const personalName = document.querySelector('.hero h1')?.textContent || '';
  const personalTitle = document.querySelector('.hero .subtitle')?.textContent || '';
  const personalBio = document.querySelector('.hero .description')?.textContent || '';
  const personalEmail = document.querySelector('a[href^="mailto:"]')?.textContent || '';
  const personalLocation = document.querySelector('.hero')?.textContent?.match(/📍\s*([^•]+)/)?.[1]?.trim() || '';

  // Build resume HTML
  resumeContainer.innerHTML = `
    <div style="margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 15px;">
      <h1 style="margin: 0 0 5px 0; font-size: 32px; color: #000;">${personalName}</h1>
      <p style="margin: 0 0 8px 0; font-size: 16px; color: #555;">${personalTitle}</p>
      <p style="margin: 0; font-size: 12px; color: #666;">
        ${personalEmail ? `✉ ${personalEmail}` : ''}
        ${personalLocation && personalEmail ? ' | ' : ''}
        ${personalLocation ? `📍 ${personalLocation}` : ''}
      </p>
    </div>

    ${personalBio ? `
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; margin: 0 0 10px 0; color: #000; border-bottom: 2px solid #666; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h2>
      <p style="margin: 0; font-size: 11px; color: #333; text-align: justify;">${personalBio}</p>
    </div>
    ` : ''}

    ${getWorkExperienceHTML()}
    ${getSkillsHTML()}
    ${getEducationHTML()}
    ${getProjectsHTML()}
  `;

  document.body.appendChild(resumeContainer);

  try {
    // Generate PDF with professional settings
    await generatePDF(resumeContainer, {
      filename: `${username}-resume.pdf`,
      quality: 1.0,
      scale: 2,
      margin: 0
    });
  } finally {
    // Clean up
    document.body.removeChild(resumeContainer);
  }
}

/**
 * Extract and format work experience section
 */
function getWorkExperienceHTML(): string {
  const workSection = document.querySelector('#work-experience, #experience');
  if (!workSection) return '';

  const experiences = Array.from(workSection.querySelectorAll('.timeline-item, .experience-item, .work-item'));
  if (experiences.length === 0) return '';

  let html = `
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #000; border-bottom: 2px solid #666; padding-bottom: 5px;">WORK EXPERIENCE</h2>
  `;

  experiences.forEach(exp => {
    const position = exp.querySelector('h3, .position, .title')?.textContent?.trim() || '';
    const company = exp.querySelector('h4, .company')?.textContent?.trim() || '';
    const period = exp.querySelector('.period, .date, time')?.textContent?.trim() || '';
    const location = exp.querySelector('.location')?.textContent?.trim() || '';
    const description = exp.querySelector('p, .description')?.textContent?.trim() || '';
    const tags = Array.from(exp.querySelectorAll('.tag, .tech-tag, .skill-tag')).map(t => t.textContent?.trim()).filter(Boolean);

    html += `
      <div style="margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <h3 style="margin: 0; font-size: 13px; color: #000; font-weight: bold;">${position}</h3>
          <span style="font-size: 11px; color: #666;">${period}</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 12px; color: #333; font-weight: 600;">${company}</span>
          ${location ? `<span style="font-size: 11px; color: #666;"> | ${location}</span>` : ''}
        </div>
        ${description ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #333; line-height: 1.5;">${description}</p>` : ''}
        ${tags.length > 0 ? `
          <div style="margin-top: 5px;">
            <span style="font-size: 10px; color: #666; font-style: italic;">Technologies: ${tags.join(', ')}</span>
          </div>
        ` : ''}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

/**
 * Extract and format skills section
 */
function getSkillsHTML(): string {
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return '';

  const skillCategories = Array.from(skillsSection.querySelectorAll('.skill-category, .skills-grid > div'));
  if (skillCategories.length === 0) return '';

  let html = `
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #000; border-bottom: 2px solid #666; padding-bottom: 5px;">TECHNICAL SKILLS</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
  `;

  skillCategories.forEach(category => {
    const categoryName = category.querySelector('h3, h4, .category-name')?.textContent?.trim() || '';
    const skills = Array.from(category.querySelectorAll('.skill-item, li, .tag')).map(s => {
      const text = s.textContent?.trim() || '';
      // Remove proficiency percentages for cleaner resume look
      return text.replace(/:\s*\d+%/, '');
    }).filter(Boolean);

    if (categoryName && skills.length > 0) {
      html += `
        <div style="margin-bottom: 8px;">
          <strong style="font-size: 11px; color: #000;">${categoryName}:</strong>
          <span style="font-size: 11px; color: #333;"> ${skills.join(', ')}</span>
        </div>
      `;
    }
  });

  html += `
      </div>
    </div>
  `;
  return html;
}

/**
 * Extract and format education section
 */
function getEducationHTML(): string {
  const eduSection = document.querySelector('#education');
  if (!eduSection) return '';

  const educations = Array.from(eduSection.querySelectorAll('.timeline-item, .education-item, .edu-item'));
  if (educations.length === 0) return '';

  let html = `
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #000; border-bottom: 2px solid #666; padding-bottom: 5px;">EDUCATION</h2>
  `;

  educations.forEach(edu => {
    const degree = edu.querySelector('h3, .degree')?.textContent?.trim() || '';
    const institution = edu.querySelector('h4, .institution, .school')?.textContent?.trim() || '';
    const period = edu.querySelector('.period, .date, time')?.textContent?.trim() || '';
    const location = edu.querySelector('.location')?.textContent?.trim() || '';

    html += `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <h3 style="margin: 0; font-size: 12px; color: #000; font-weight: bold;">${degree}</h3>
          <span style="font-size: 11px; color: #666;">${period}</span>
        </div>
        <div>
          <span style="font-size: 11px; color: #333;">${institution}</span>
          ${location ? `<span style="font-size: 10px; color: #666;"> | ${location}</span>` : ''}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

/**
 * Extract and format projects section
 */
function getProjectsHTML(): string {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return '';

  const projects = Array.from(projectsSection.querySelectorAll('.project-card, .project-item'));
  if (projects.length === 0) return '';

  let html = `
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #000; border-bottom: 2px solid #666; padding-bottom: 5px;">NOTABLE PROJECTS</h2>
  `;

  // Only show first 3-4 projects for resume
  projects.slice(0, 4).forEach(proj => {
    const title = proj.querySelector('h3, .title')?.textContent?.trim() || '';
    const description = proj.querySelector('p, .description')?.textContent?.trim() || '';
    const techs = Array.from(proj.querySelectorAll('.tag, .tech-tag')).map(t => t.textContent?.trim()).filter(Boolean);

    html += `
      <div style="margin-bottom: 12px;">
        <h3 style="margin: 0 0 4px 0; font-size: 12px; color: #000; font-weight: bold;">${title}</h3>
        ${description ? `<p style="margin: 0 0 4px 0; font-size: 10px; color: #333; line-height: 1.4;">${description}</p>` : ''}
        ${techs.length > 0 ? `
          <span style="font-size: 9px; color: #666; font-style: italic;">Tech Stack: ${techs.join(', ')}</span>
        ` : ''}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}
