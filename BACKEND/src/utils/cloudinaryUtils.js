import cloudinary from "../config/cloudinary.js";

/**
 * Extracts the public_id from a Cloudinary URL.
 * Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/sample.jpg
 * Result: folder/sample
 */
export const extractPublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/");
    const filenameWithExt = parts[parts.length - 1];
    const folderPath = parts.slice(parts.indexOf("upload") + 2, parts.length - 1).join("/");
    
    const filename = filenameWithExt.split(".")[0];
    
    if (folderPath) {
      return `${folderPath}/${filename}`;
    }
    return filename;
  } catch (error) {
    console.error("Error extracting public_id from Cloudinary URL", error);
    return null;
  }
};

/**
 * Deletes an image from Cloudinary using its URL.
 */
export const deleteFromCloudinary = async (url) => {
  try {
    const publicId = extractPublicId(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary (${url}):`, error);
    return false;
  }
};

/**
 * Uploads a file stream/buffer to Cloudinary
 */
export const uploadToCloudinary = (buffer, folder = "virtual_spaces") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};
