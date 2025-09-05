import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(
  file: File,
  projectId: string
): Promise<{
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  publicId?: string;
}> {
  try {
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const filename = `${uuidv4()}.${fileExtension}`;

    // Upload to Cloudinary
    const result = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `pixel-boba/uploads/${projectId}`,
            public_id: filename,
            resource_type: 'auto', // Automatically detect file type
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    })) as any;

    return {
      filename: result.public_id.split('/').pop(),
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('File upload failed');
  }
}
