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
 * Generates a portfolio PDF with proper formatting
 * @param username - The username for the filename
 */
export async function generatePortfolioPDF(username: string): Promise<void> {
  // Find the main portfolio container
  const portfolioElement = document.querySelector('.portfolio-view') as HTMLElement;

  if (!portfolioElement) {
    throw new Error('Portfolio container not found');
  }

  // Store original styles
  const originalStyles = new Map<HTMLElement, string>();

  // Temporarily hide elements that shouldn't be in PDF
  const elementsToHide = [
    '.chat-container',
    '.chat-overlay',
    'header',
    '.chat-fab',
    'button'
  ];

  const hiddenElements: HTMLElement[] = [];
  elementsToHide.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.display !== 'none') {
        hiddenElements.push(htmlEl);
        originalStyles.set(htmlEl, htmlEl.style.cssText);
        htmlEl.style.display = 'none';
      }
    });
  });

  // Add PDF-specific styling
  const pdfStyles = document.createElement('style');
  pdfStyles.id = 'pdf-export-styles';
  pdfStyles.innerHTML = `
    /* PDF-specific styles */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      overflow: visible !important;
    }

    .portfolio-view {
      width: 1920px !important;
      max-width: none !important;
      overflow: visible !important;
      padding: 40px !important;
    }

    section {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 60px !important;
    }

    .container {
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 0 40px !important;
    }

    /* Ensure backgrounds are visible */
    .hero, .section {
      background-color: inherit !important;
    }

    /* Fix text readability */
    h1, h2, h3, h4, h5, h6, p, span, li, a {
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
    }

    /* Fix images */
    img {
      max-width: 100% !important;
      height: auto !important;
    }
  `;
  document.head.appendChild(pdfStyles);

  // Force reflow
  void portfolioElement.offsetHeight;

  try {
    // Generate the PDF with higher quality
    await generatePDF(portfolioElement, {
      filename: `${username}-portfolio.pdf`,
      quality: 1.0,
      scale: 3
    });
  } finally {
    // Restore hidden elements
    hiddenElements.forEach(el => {
      const originalStyle = originalStyles.get(el);
      if (originalStyle !== undefined) {
        el.style.cssText = originalStyle;
      } else {
        el.style.display = '';
      }
    });

    // Remove PDF styles
    const stylesToRemove = document.getElementById('pdf-export-styles');
    if (stylesToRemove) {
      stylesToRemove.remove();
    }
  }
}
