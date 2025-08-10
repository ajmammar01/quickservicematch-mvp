import fs from 'fs';
import path from 'path';
// Changed import approach - using CommonJS version for better compatibility
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';

// Define the public upload directory
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const UPLOAD_DIR_URL = '/uploads'; // URL path to access uploaded files

// Ensure the uploads directory exists
export function ensureUploadDirExists(): void {
  try {
    if (!fs.existsSync(PUBLIC_UPLOAD_DIR)) {
      fs.mkdirSync(PUBLIC_UPLOAD_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw new Error('Failed to create upload directory');
  }
}

/**
 * Save an image file to the uploads directory
 * @param file The file object from formData
 * @returns The path to the saved image relative to the public directory
 */
export async function saveImage(file: File): Promise<string> {
  // Ensure upload directory exists
  ensureUploadDirExists();
  
  try {
    // Ensure we have a proper File object
    if (!file || typeof file.arrayBuffer !== 'function') {
      throw new Error('Invalid file object');
    }
    
    // Generate a unique filename
    const fileExt = path.extname(file.name).toLowerCase();
    const uniqueFilename = `${uuidv4()}${fileExt}`;
    const filePath = path.join(PUBLIC_UPLOAD_DIR, uniqueFilename);
    
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write the file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Store image metadata in the database
    await prisma.image.create({
      data: {
        filename: file.name,
        path: `${UPLOAD_DIR_URL}/${uniqueFilename}`,
        mimeType: file.type,
        size: file.size,
      },
    });
    
    // Return the public URL path to the image
    return `${UPLOAD_DIR_URL}/${uniqueFilename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

/**
 * Delete an image from the uploads directory
 * @param imagePath The path to the image relative to the public directory
 */
export async function deleteImage(imagePath: string): Promise<void> {
  try {
    // Extract the filename from the path
    const filename = path.basename(imagePath);
    const filePath = path.join(PUBLIC_UPLOAD_DIR, filename);
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      
      // Delete the image metadata from the database
      await prisma.image.deleteMany({
        where: {
          path: imagePath,
        },
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}
