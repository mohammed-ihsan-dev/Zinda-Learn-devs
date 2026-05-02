import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  /**
   * Generate a signed upload signature for direct browser upload
   * @param {string} courseId - Associated course ID for folder structure
   * @returns {Object} Signature data
   */
  generateUploadSignature: (courseId) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `zinda-learn/courses/${courseId}/videos`;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        resource_type: 'video'
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    };
  },

  /**
   * Delete a video from Cloudinary
   * @param {string} publicId - Cloudinary public_id
   */
  deleteVideo: async (publicId) => {
    try {
      return await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw error;
    }
  }
};
