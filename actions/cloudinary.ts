"use server"

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function deleteImageFromCloudinary(
    publicId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        if (!publicId) {
            return { success: false, error: 'No public ID provided' }
        }

        // Try to delete as raw resource first (for PDFs and documents)
        let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })

        // If not found as raw, try as image
        if (result.result !== 'ok') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        }

        return {
            success: result.result === 'ok',
            message: result.result === 'ok'
                ? 'File deleted successfully'
                : 'Failed to delete file'
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        return {
            success: false,
            error: 'Failed to delete file'
        }
    }
}
