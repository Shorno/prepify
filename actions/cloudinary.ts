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

        // Try to delete with auto resource type first
        let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'auto', invalidate: true })

        // If not found with auto, try as raw (for PDFs and documents)
        if (result.result !== 'ok') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', invalidate: true })
        }

        // If not found as raw, try as image
        if (result.result !== 'ok') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
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
