// lib/storage.ts

/**
 * This is a simplified storage handler.
 * In a production environment, you would use a proper storage solution
 * like AWS S3, Google Cloud Storage, or Azure Blob Storage.
 */

import fs from 'fs';
import path from 'path';

// Base storage directory - make sure this exists and is writable
const STORAGE_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure the storage directory exists
export function ensureDirectoryExists(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

/**
 * Upload a file to local storage
 * @param file The file to upload (from form data)
 * @param filePath The path within storage where the file should be saved
 * @returns The public URL of the uploaded file
 */
export async function uploadToStorage(file: File, filePath: string): Promise<string> {
  // Convert File object to buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Create the full path where the file will be saved
  const fullPath = path.join(STORAGE_DIR, filePath);
  
  // Ensure the directory exists
  ensureDirectoryExists(path.dirname(fullPath));
  
  // Write the file
  fs.writeFileSync(fullPath, buffer);
  
  // Return the public URL
  return `/uploads/${filePath}`;
}

/**
 * Delete a file from storage
 * @param filePath The path of the file to delete
 * @returns Whether the file was successfully deleted
 */
export async function deleteFromStorage(filePath: string): Promise<boolean> {
  try {
    // Get the full path of the file
    const fullPath = path.join(STORAGE_DIR, filePath);
    
    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      // Delete the file
      fs.unlinkSync(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Get the full path of a file in storage
 * @param filePath The path of the file
 * @returns The full path of the file
 */
export function getStoragePath(filePath: string): string {
  return path.join(STORAGE_DIR, filePath);
}

/**
 * Get the public URL of a file
 * @param filePath The path of the file
 * @returns The public URL of the file
 */
export function getPublicUrl(filePath: string): string {
  return `/uploads/${filePath}`;
}