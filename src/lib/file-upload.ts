// src/lib/file-upload.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  uploadDir: string;
}

export interface UploadResult {
  filename: string;
  originalName: string;
  size: number;
  path: string;
  url: string;
}

/**
 * Ensures upload directory exists
 */
export async function ensureUploadDir(uploadPath: string): Promise<void> {
  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
  }
}

/**
 * Generates unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  
  // Clean filename - remove special characters and spaces
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50); // Limit length
    
  return `${cleanName}_${timestamp}_${random}${ext}`;
}

/**
 * Validates file type and size
 */
export function validateFile(
  file: File,
  options: Pick<UploadOptions, 'maxSize' | 'allowedTypes'>
): void {
  const { maxSize, allowedTypes } = options;
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type;
    const fileExtension = path.extname(file.name).toLowerCase();
    
    const isAllowedType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      } else {
        return fileType.startsWith(type);
      }
    });
    
    if (!isAllowedType) {
      throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }
}

/**
 * Processes and saves uploaded file
 */
export async function processUpload(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const { uploadDir, maxSize, allowedTypes } = options;
  
  // Validate file
  validateFile(file, { maxSize, allowedTypes });
  
  // Ensure upload directory exists
  const uploadPath = path.join(process.cwd(), uploadDir);
  await ensureUploadDir(uploadPath);
  
  // Generate unique filename
  const filename = generateUniqueFilename(file.name);
  const filePath = path.join(uploadPath, filename);
  
  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);
  
  // Generate URL using the API route
  // Remove 'uploads/' from the beginning and create API URL
  const relativePath = uploadDir.replace('uploads/', '');
  const url = `/api/files/${relativePath}/${filename}`;
  
  // Return upload result
  return {
    filename,
    originalName: file.name,
    size: file.size,
    path: filePath,
    url,
  };
}

/**
 * Deletes a file
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, ignore error
    console.warn(`Could not delete file: ${filePath}`, error);
  }
}

/**
 * Parses multipart form data from NextRequest
 */
export async function parseFormData(request: NextRequest): Promise<FormData> {
  try {
    return await request.formData();
  } catch (error) {
    console.log(error);
    throw new Error('Invalid form data');
  }
}

/**
 * Audio file specific upload options
 */
export const AUDIO_UPLOAD_OPTIONS: UploadOptions = {
  maxSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', '.mp3', '.wav', '.m4a', '.aac'],
  uploadDir: 'uploads/audio',
};

/**
 * Image/cover upload options
 */
export const IMAGE_UPLOAD_OPTIONS: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', '.jpg', '.jpeg', '.png', '.webp'],
  uploadDir: 'uploads/covers',
};