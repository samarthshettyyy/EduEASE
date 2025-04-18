// Create a new file: lib/pdf-client.ts

import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Define the return type for our PDF extraction function
interface PdfExtractResult {
  title: string;
  content: string;
  pageCount: number;
}

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts text content from a PDF file
 * @param {File} file - The PDF file object
 * @returns {Promise<PdfExtractResult>}
 */
export async function extractPdfContent(file: File): Promise<PdfExtractResult> {
  return new Promise<PdfExtractResult>(async (resolve, reject) => {
    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      
      // Extract title from the first page (assuming first line is title)
      const firstPage = await pdf.getPage(1);
      const firstPageText = await firstPage.getTextContent();
      const title = firstPageText.items[0]?.str || 'Imported PDF';
      
      // Extract content from all pages
      let fullContent = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullContent += pageText + '\n\n';
      }
      
      // Clean up the content (optional)
      const cleanedContent = fullContent
        .replace(/\s+/g, ' ')
        .trim();
      
      resolve({
        title,
        content: cleanedContent,
        pageCount: pdf.numPages
      });
    } catch (error) {
      reject(error);
    }
  });
}