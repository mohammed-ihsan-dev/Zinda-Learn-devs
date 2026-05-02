import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const s3Service = {
  /**
   * Generate a presigned URL for uploading a file to S3
   * @param {string} fileName - Original file name
   * @param {string} fileType - MIME type
   * @param {string} courseId - Associated course ID for folder structure
   * @returns {Promise<{uploadUrl: string, fileUrl: string, fileKey: string}>}
   */
  generatePresignedUploadUrl: async (fileName, fileType, courseId) => {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const fileKey = `courses/${courseId}/${timestamp}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    // URL expires in 15 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    
    // Construct the public/CDN URL
    const fileUrl = process.env.CLOUDFRONT_URL 
      ? `${process.env.CLOUDFRONT_URL}/${fileKey}`
      : `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      uploadUrl,
      fileUrl,
      fileKey
    };
  }
};
