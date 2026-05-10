import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "buffer"; // Import Node.js Buffer for compatibility

// --- Configuration (Keep this part as is) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// --- Main Upload Function (FIXED: Uses Node.js Buffer instead of FileReader) ---

/**
 * Uploads a single File object (Blob) to Cloudinary by converting it to a Node.js Buffer.
 * This is the correct approach for Next.js App Router API routes.
 * * @param file The File object received from the client via FormData.
 * @param folder The target folder in Cloudinary.
 * @returns A promise that resolves to the secure URL of the uploaded image.
 * @throws An error if the upload fails.
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = "monastery_events"
): Promise<string> => {
    if (!file) {
        throw new Error("No file provided for upload.");
    }
    
    try {
        // 1. Convert the File (Blob) to an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // 2. Convert the ArrayBuffer to a Node.js Buffer
        const buffer = Buffer.from(arrayBuffer);
        
        // 3. Upload the buffer data using Cloudinary's uploader stream API
        // This is necessary because the default `cloudinary.uploader.upload` expects a file path or a Data URI.
        // We use a stream wrapper to pass the buffer data.
        
        const uploadPromise = new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "auto",
                    // Suggest public_id to keep filenames clean
                    public_id: file.name.replace(/\.[^/.]+$/, "") + '-' + Date.now(),
                },
                (error, result) => {
                    if (error || !result?.secure_url) {
                        return reject(new Error(`Cloudinary upload stream failed: ${error?.message || 'No URL returned'}`));
                    }
                    resolve(result.secure_url);
                }
            );
            
            // Pipe the buffer data to the upload stream
            uploadStream.end(buffer);
        });

        return await uploadPromise;

    } catch (err: unknown) {
        let message = "Cloudinary upload failed";

        if (err instanceof Error) {
            message = `Cloudinary Error: ${err.message}`;
        }
        
        // Throw the error to be caught by the API route's Promise.allSettled
        console.error(message);
        throw new Error(message); 
    }
};