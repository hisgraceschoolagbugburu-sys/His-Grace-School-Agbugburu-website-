/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Reusable Cloudinary Upload Service (HGS_CLOUDINARY)
 * Handles client-side unsigned uploads directly to Cloudinary.
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'kzpuxfve',
  uploadPreset: 'hisgraceschool_uploads',
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedImageExts: ['jpg', 'jpeg', 'png', 'webp'],
  allowedDocumentTypes: ['application/pdf'],
  allowedDocumentExts: ['pdf']
};

/**
 * Validates a file against allowed types and max size limit.
 * @param {File} file 
 * @param {Object} options - { allowDocuments: boolean }
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file, options = {}) {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  // Size Check (10 MB Limit)
  if (file.size > CLOUDINARY_CONFIG.maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 10 MB.` 
    };
  }

  const fileName = file.name.toLowerCase();
  const ext = fileName.split('.').pop();
  const fileType = file.type.toLowerCase();

  const isImage = CLOUDINARY_CONFIG.allowedImageExts.includes(ext) || 
                  CLOUDINARY_CONFIG.allowedImageTypes.includes(fileType);

  const isDocument = options.allowDocuments && (
    CLOUDINARY_CONFIG.allowedDocumentExts.includes(ext) || 
    CLOUDINARY_CONFIG.allowedDocumentTypes.includes(fileType)
  );

  if (!isImage && !isDocument) {
    const allowedMsg = options.allowDocuments 
      ? "JPG, JPEG, PNG, WEBP, or PDF" 
      : "JPG, JPEG, PNG, or WEBP";
    return { 
      valid: false, 
      error: `Unsupported file format '${ext.toUpperCase()}'. Allowed formats: ${allowedMsg}.` 
    };
  }

  return { valid: true };
}

/**
 * Uploads a file directly to Cloudinary using unsigned upload preset.
 * @param {File} file - The file object to upload
 * @param {Object} [options] - { folder?: string, allowDocuments?: boolean, onProgress?: (percent: number) => void }
 * @returns {Promise<{ url: string, public_id: string, bytes: number, format: string, original_filename: string }>}
 */
export function uploadToCloudinary(file, options = {}) {
  return new Promise((resolve, reject) => {
    // 1. Validate File
    const validation = validateFile(file, options);
    if (!validation.valid) {
      reject(new Error(validation.error || "File validation failed."));
      return;
    }

    // 2. Determine resource_type (image vs raw/auto)
    const fileName = file.name.toLowerCase();
    const ext = fileName.split('.').pop();
    const isPdf = ext === 'pdf' || file.type === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;

    // 3. Prepare FormData payload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    // 4. Send XHR request with progress callback
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (options.onProgress && typeof options.onProgress === 'function') {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          options.onProgress(percentComplete);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.secure_url) {
            resolve({
              url: response.secure_url,
              public_id: response.public_id,
              bytes: response.bytes,
              format: response.format || ext,
              original_filename: response.original_filename || file.name
            });
          } else {
            reject(new Error("Upload failed. Invalid response from Cloudinary."));
          }
        } catch (parseErr) {
          reject(new Error("Upload failed. Unable to parse server response."));
        }
      } else {
        console.error("Cloudinary Error Response:", xhr.responseText);
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed. Network error or server connection lost."));
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload failed. Request timed out."));
    };

    xhr.send(formData);
  });
}

// Global Export Object
const HGS_CLOUDINARY = {
  config: CLOUDINARY_CONFIG,
  validateFile,
  uploadToCloudinary
};

if (typeof window !== 'undefined') {
  window.HGS_CLOUDINARY = HGS_CLOUDINARY;
}

export default HGS_CLOUDINARY;
