# scripts/process_text.py
import sys
import os
import json
import re
import PyPDF2
import docx2txt
import traceback

# Try to import optional OCR libraries
try:
    import pytesseract
    from pdf2image import convert_from_path
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

try:
    from pdfminer.high_level import extract_text as pdfminer_extract_text
    PDFMINER_AVAILABLE = True
except ImportError:
    PDFMINER_AVAILABLE = False

def extract_text_from_pdf(file_path):
    """Extract text from PDF using multiple methods."""
    text = ""
    extraction_method = "None"
    
    # Try pdfminer.six first if available (usually better results)
    if PDFMINER_AVAILABLE:
        try:
            print("Attempting extraction with pdfminer.six...")
            text = pdfminer_extract_text(file_path)
            if text.strip():
                extraction_method = "pdfminer"
                print(f"Successfully extracted text with pdfminer.six ({len(text)} characters)")
                return text, extraction_method
            print("pdfminer.six extraction produced no text")
        except Exception as e:
            print(f"pdfminer.six extraction error: {str(e)}")
    
    # Try PyPDF2 as backup
    try:
        print("Attempting extraction with PyPDF2...")
        temp_text = ""
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page_num in range(len(pdf_reader.pages)):
                try:
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    if page_text:
                        temp_text += page_text + "\n"
                except Exception as e:
                    print(f"Error extracting page {page_num+1} with PyPDF2: {str(e)}")
        
        if temp_text.strip():
            text = temp_text
            extraction_method = "PyPDF2"
            print(f"Successfully extracted text with PyPDF2 ({len(text)} characters)")
            return text, extraction_method
        print("PyPDF2 extraction produced no text")
    except Exception as e:
        print(f"PyPDF2 extraction error: {str(e)}")
    
    # If both methods failed and OCR is available, try OCR
    if OCR_AVAILABLE and not text.strip():
        try:
            print("Attempting OCR extraction...")
            # Convert PDF to images
            images = convert_from_path(file_path)
            ocr_text = ""
            
            # Process each page with OCR
            for i, image in enumerate(images):
                print(f"OCR processing page {i+1}/{len(images)}...")
                page_text = pytesseract.image_to_string(image)
                ocr_text += f"{page_text}\n\n"
            
            if ocr_text.strip():
                text = ocr_text
                extraction_method = "OCR"
                print(f"Successfully extracted text with OCR ({len(text)} characters)")
                return text, extraction_method
            print("OCR extraction produced no text")
        except Exception as e:
            print(f"OCR extraction error: {str(e)}")
            print(traceback.format_exc())
    
    # If OCR is not available, suggest installing it
    if not OCR_AVAILABLE and not text.strip():
        print("OCR libraries not available. Consider installing pytesseract and pdf2image for better PDF support.")
    
    return text, extraction_method

def extract_text(file_path, file_type):
    """Extract text from various file types."""
    if file_type == 'txt':
        with open(file_path, 'r', errors='ignore') as f:
            return f.read(), "txt"
    
    elif file_type == 'pdf':
        return extract_text_from_pdf(file_path)
    
    elif file_type == 'docx':
        try:
            text = docx2txt.process(file_path)
            return text, "docx2txt"
        except Exception as e:
            print(f"DOCX extraction error: {str(e)}")
            return f"Error extracting DOCX: {str(e)}", "error"
    
    return "Unsupported file type", "error"

def process_text(text):
    """Process text to split into words and sentences."""
    # Remove excess whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Split into sentences (basic implementation - can be improved)
    # This regex handles common sentence endings (., !, ?) followed by a space or newline
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    # Filter out empty sentences
    sentences = [sentence for sentence in sentences if sentence.strip()]
    
    return {
        'full_text': text,
        'sentences': sentences
    }

def find_important_words(text, max_words=10):
    """Find important words in text based on frequency and other factors."""
    words = re.findall(r'\b\w+\b', text.lower())
    word_freq = {}
    
    # Skip common words (a basic stopword list)
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 
                'about', 'as', 'of', 'is', 'was', 'were', 'be', 'been', 'am', 'are', 'that', 'this',
                'these', 'those', 'it', 'they', 'them', 'their', 'has', 'have', 'had', 'not', 'no',
                'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall'}
    
    for word in words:
        if len(word) > 3 and word not in stopwords:  # Ignore very short words and stopwords
            if word in word_freq:
                word_freq[word] += 1
            else:
                word_freq[word] = 1
    
    # Get top words by frequency
    important_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:max_words]
    return [word for word, freq in important_words]

def get_extraction_stats(text, extraction_method):
    """Get statistics about the extracted text."""
    stats = {
        "extraction_method": extraction_method,
        "character_count": len(text),
        "word_count": len(re.findall(r'\b\w+\b', text)) if text else 0,
        "is_empty": len(text.strip()) == 0
    }
    return stats

if __name__ == "__main__":
    try:
        # Get command line arguments
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Not enough arguments. Usage: process_text.py <file_path> <file_name>"}))
            sys.exit(1)
            
        file_path = sys.argv[1]
        file_name = sys.argv[2]
        file_type = file_name.rsplit('.', 1)[1].lower()
        
        print(f"Processing file: {file_name} (type: {file_type})")
        
        # Process the file
        extracted_text, extraction_method = extract_text(file_path, file_type)
        processed_data = process_text(extracted_text)
        important_words = find_important_words(extracted_text)
        
        # Add important words and extraction stats to the result
        processed_data['important_words'] = important_words
        processed_data['extraction_stats'] = get_extraction_stats(extracted_text, extraction_method)
        
        # Print JSON result to stdout (will be captured by Node.js)
        print(json.dumps(processed_data))
        
    except Exception as e:
        print(json.dumps({
            "error": f"Unexpected error: {str(e)}",
            "traceback": traceback.format_exc(),
            "full_text": "",
            "sentences": [],
            "important_words": []
        }))