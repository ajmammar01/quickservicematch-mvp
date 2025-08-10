import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveImage(file: File): Promise<string> {
  try {
    // Ensure the upload directory exists
    await ensureUploadDir();
    
    // Generate a unique filename
    const fileExtension = path.extname(file.name) || '.jpg';
    const uniqueFilename = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    
    // Convert the File to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Save the file
    await fs.writeFile(filePath, buffer);
    
    // Return the relative path for web access
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

export async function deleteImage(imagePath: string): Promise<void> {
  try {
    if (!imagePath || !imagePath.startsWith('/uploads/')) {
      return; // Invalid path, skip deletion
    }
    
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for deletion failures
  }
}
