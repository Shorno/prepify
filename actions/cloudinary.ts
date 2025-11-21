"use server"

import { v2 as cloudinary , UploadApiResponse} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

interface UploadResult {
    success: true
    url: string
    publicId: string
}

interface UploadError {
    success: false
    error: string
}

export async function uploadImageToCloudinary(
    formData: FormData
): Promise<UploadResult | UploadError> {
    try {
        const file = formData.get('file') as File
        const folder = (formData.get('folder') as string) || 'uploads'

        if (!file) {
            return { success: false, error: 'No file provided' }
        }

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'application/svg+xml',
            'application/pdf',
            'pdf'
        ]

        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Invalid file type. Please upload JPG, PNG, WebP, or PDF files.'
            }
        }

        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File too large. Please upload files smaller than 10MB.'
            }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Determine if file is a PDF
        const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadOptions = {
                folder,
                resource_type: 'auto' as const,
                ...(isPDF
                    ? { format: 'pdf' }
                    : {
                        transformation: [
                            { quality: 'auto:good' },
                            { fetch_format: 'auto' }
                        ]
                    }
                ),
            }

            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) reject(error)
                    else if (result) resolve(result)
                    else reject(new Error("Unknown Cloudinary error"))
                }
            ).end(buffer)
        })

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return {
            success: false,
            error: 'Failed to upload image. Please try again.',
        }
    }
}

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
