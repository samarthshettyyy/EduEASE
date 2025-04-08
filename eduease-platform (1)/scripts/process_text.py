# scripts/process_text.py
import sys
import os
import json
import re
import traceback

# Redirect normal print statements to stderr to avoid messing up the JSON output
def debug_print(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

# Try to import optional dependencies with proper error handling
def import_optional_dependencies():
    dependencies = {}
    
    # Try to import PyPDF2
    try:
        import PyPDF2
        dependencies['PyPDF2'] = PyPDF2
        debug_print("Successfully imported PyPDF2")
    except ImportError:
        debug_print("PyPDF2 not available")
        dependencies['PyPDF2'] = None
    
    # Try to import docx2txt
    try:
        import docx2txt
        dependencies['docx2txt'] = docx2txt
        debug_print("Successfully imported docx2txt")
    except ImportError:
        debug_print("docx2txt not available")
        dependencies['docx2txt'] = None
    
    # Try to import OCR libraries
    try:
        import pytesseract
        from pdf2image import convert_from_path
        dependencies['OCR_AVAILABLE'] = True
        dependencies['pytesseract'] = pytesseract
        dependencies['convert_from_path'] = convert_from_path
        debug_print("Successfully imported OCR libraries")
    except ImportError:
        dependencies['OCR_AVAILABLE'] = False
        debug_print("OCR libraries not available")
    
    # Try to import pdfminer
    try:
        from pdfminer.high_level import extract_text as pdfminer_extract_text
        dependencies['PDFMINER_AVAILABLE'] = True
        dependencies['pdfminer_extract_text'] = pdfminer_extract_text
        debug_print("Successfully imported pdfminer")
    except ImportError:
        dependencies['PDFMINER_AVAILABLE'] = False
        debug_print("pdfminer not available")
    
    return dependencies

# Import dependencies
deps = import_optional_dependencies()

def extract_text_from_pdf(file_path):
    """Extract text from PDF using multiple methods."""
    text = ""
    extraction_method = "None"
    
    # Try PyPDF2 first if available
    if deps.get('PyPDF2'):
        try:
            debug_print("Attempting extraction with PyPDF2...")
            temp_text = ""
            with open(file_path, 'rb') as f:
                pdf_reader = deps['PyPDF2'].PdfReader(f)
                for page_num in range(len(pdf_reader.pages)):
                    try:
                        page = pdf_reader.pages[page_num]
                        page_text = page.extract_text()
                        if page_text:
                            temp_text += page_text + "\n"
                    except Exception as e:
                        debug_print(f"Error extracting page {page_num+1} with PyPDF2: {str(e)}")
            
            if temp_text.strip():
                text = temp_text
                extraction_method = "PyPDF2"
                debug_print(f"Successfully extracted text with PyPDF2 ({len(text)} characters)")
                return text, extraction_method
            debug_print("PyPDF2 extraction produced no text")
        except Exception as e:
            debug_print(f"PyPDF2 extraction error: {str(e)}")
    
    # Try pdfminer.six if available and PyPDF2 failed
    if deps.get('PDFMINER_AVAILABLE', False) and not text.strip():
        try:
            debug_print("Attempting extraction with pdfminer.six...")
            text = deps['pdfminer_extract_text'](file_path)
            if text.strip():
                extraction_method = "pdfminer"
                debug_print(f"Successfully extracted text with pdfminer.six ({len(text)} characters)")
                return text, extraction_method
            debug_print("pdfminer.six extraction produced no text")
        except Exception as e:
            debug_print(f"pdfminer.six extraction error: {str(e)}")
    
    # If both methods failed and OCR is available, try OCR
    if deps.get('OCR_AVAILABLE', False) and not text.strip():
        try:
            debug_print("Attempting OCR extraction...")
            # Convert PDF to images
            images = deps['convert_from_path'](file_path)
            ocr_text = ""
            
            # Process each page with OCR
            for i, image in enumerate(images):
                debug_print(f"OCR processing page {i+1}/{len(images)}...")
                page_text = deps['pytesseract'].image_to_string(image)
                ocr_text += f"{page_text}\n\n"
            
            if ocr_text.strip():
                text = ocr_text
                extraction_method = "OCR"
                debug_print(f"Successfully extracted text with OCR ({len(text)} characters)")
                return text, extraction_method
            debug_print("OCR extraction produced no text")
        except Exception as e:
            debug_print(f"OCR extraction error: {str(e)}")
            debug_print(traceback.format_exc())
    
    # If we got here, no extraction method worked
    if not text.strip():
        text = "Failed to extract text from the PDF document. Please try a different file format or check if the PDF contains extractable text."
        extraction_method = "failed"
    
    return text, extraction_method

def extract_text(file_path, file_type):
    """Extract text from various file types."""
    # Handle case where file doesn't exist
    if not os.path.exists(file_path):
        return f"Error: File not found at {file_path}", "error"
    
    if file_type == 'txt':
        try:
            with open(file_path, 'r', errors='ignore') as f:
                text = f.read()
                return text, "txt"
        except Exception as e:
            debug_print(f"TXT extraction error: {str(e)}")
            return f"Error reading TXT file: {str(e)}", "error"
    
    elif file_type == 'pdf':
        if deps.get('PyPDF2') or deps.get('PDFMINER_AVAILABLE', False):
            return extract_text_from_pdf(file_path)
        else:
            return "PDF processing requires PyPDF2 or pdfminer.six library, which is not available.", "error"
    
    elif file_type == 'docx':
        if deps.get('docx2txt'):
            try:
                text = deps['docx2txt'].process(file_path)
                return text, "docx2txt"
            except Exception as e:
                debug_print(f"DOCX extraction error: {str(e)}")
                return f"Error extracting DOCX: {str(e)}", "error"
        else:
            return "DOCX processing requires docx2txt library, which is not available.", "error"
    
    return f"Unsupported file type: {file_type}", "error"

def process_text(text):
    """Process text to split into words and sentences."""
    # Remove excess whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Split into sentences (basic implementation - can be improved)
    # This regex handles common sentence endings (., !, ?) followed by a space or newline
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    # Filter out empty sentences
    sentences = [sentence for sentence in sentences if sentence.strip()]
    
    # If no sentences were found (maybe the text doesn't have proper punctuation)
    # split by newlines or create chunks of text
    if not sentences:
        # Try splitting by newlines first
        sentences = [s.strip() for s in text.split('\n') if s.strip()]
        
        # If still no sentences, create chunks of approximately 100 characters
        if not sentences and text:
            chunk_size = 100
            sentences = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
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

def create_fallback_response():
    """Create a fallback response when processing fails."""
    fallback_text = "This is a fallback text generated because the document processing failed. " + \
                   "Please check the server logs for more information about the error. " + \
                   "You can still use the TTS reader with this sample text."
    
    sentences = [
        "This is a fallback text generated because the document processing failed.",
        "Please check the server logs for more information about the error.",
        "You can still use the TTS reader with this sample text."
    ]
    
    important_words = ["fallback", "document", "processing", "failed", "sample"]
    
    return {
        "full_text": fallback_text,
        "sentences": sentences,
        "important_words": important_words,
        "extraction_stats": {
            "extraction_method": "fallback",
            "character_count": len(fallback_text),
            "word_count": len(fallback_text.split()),
            "is_empty": False
        }
    }

if __name__ == "__main__":
    try:
        # Get command line arguments
        if len(sys.argv) < 3:
            result = {
                "error": "Not enough arguments. Usage: process_text.py <file_path> <file_name>",
                "full_text": "Error: Not enough arguments provided to the script.",
                "sentences": ["Error: Not enough arguments provided to the script."],
                "important_words": []
            }
            print(json.dumps(result))
            sys.exit(1)
        
        # Print all arguments for debugging (to stderr)
        debug_print(f"Script arguments: {sys.argv}")
        
        file_path = sys.argv[1]
        file_name = sys.argv[2]
        
        # Extract file type from filename
        try:
            file_type = file_name.rsplit('.', 1)[1].lower()
        except IndexError:
            file_type = "unknown"
            debug_print(f"Warning: Could not determine file type from name: {file_name}")
        
        debug_print(f"Processing file: {file_name} (type: {file_type})")
        debug_print(f"File path: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            result = {
                "error": f"File not found: {file_path}",
                "full_text": f"Error: The file {file_path} does not exist or cannot be accessed.",
                "sentences": [f"Error: The file {file_path} does not exist or cannot be accessed."],
                "important_words": [],
                "extraction_stats": {
                    "extraction_method": "error",
                    "character_count": 0,
                    "word_count": 0,
                    "is_empty": True
                }
            }
            print(json.dumps(result))
            sys.exit(1)
        
        # Process the file
        extracted_text, extraction_method = extract_text(file_path, file_type)
        processed_data = process_text(extracted_text)
        important_words = find_important_words(extracted_text)
        
        # Add important words and extraction stats to the result
        processed_data['important_words'] = important_words
        processed_data['extraction_stats'] = get_extraction_stats(extracted_text, extraction_method)
        
        # ONLY print the JSON result to stdout (will be captured by Node.js)
        # All other output should go to stderr using debug_print
        print(json.dumps(processed_data))
        
    except Exception as e:
        debug_print(f"Unexpected error: {str(e)}")
        debug_print(traceback.format_exc())
        
        # Return a fallback response that won't break the UI
        print(json.dumps(create_fallback_response()))