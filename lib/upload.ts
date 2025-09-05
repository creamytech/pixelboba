import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(
  file: File,
  projectId: string
): Promise<{
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
}> {
  const uploadsDir = join(process.cwd(), 'uploads', 'messages', projectId);

  // Create directory if it doesn't exist
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }

  // Generate unique filename
  const fileExtension = file.name.split('.').pop() || '';
  const filename = `${uuidv4()}.${fileExtension}`;
  const filepath = join(uploadsDir, filename);

  // Convert file to buffer and write
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return {
    filename,
    originalName: file.name,
    mimetype: file.type,
    size: file.size,
    url: `/uploads/messages/${projectId}/${filename}`,
  };
}
