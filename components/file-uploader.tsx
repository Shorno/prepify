"use client"

import { useState, useTransition, useCallback, useEffect } from "react"
import { AlertCircleIcon, FileTextIcon, ImageIcon, Trash2Icon, UploadIcon, XIcon, Loader2, CloudUpload, FileIcon, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@/components/ui/skeleton"
import { getPublicIdFromUrl } from "@/utils/getPublicIdFromUrl"
import { deleteImageFromCloudinary } from "@/actions/cloudinary"
import { cn } from "@/lib/utils"

interface UploadedFile {
    id: string
    name: string
    size: number
    type: string
    url: string
    publicId: string
}

interface FileUploaderProps {
    value?: string[]
    onChange?: (urls: string[]) => void
    maxFiles?: number
    maxSizeMB?: number
    folder?: string
    disabled?: boolean
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const getFileTypeInfo = (type: string, name: string): { label: string; color: string; icon: typeof FileIcon } => {
    if (type.includes("pdf") || name.endsWith(".pdf")) {
        return { label: "PDF", color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: FileTextIcon }
    }
    if (type.includes("word") || name.endsWith(".doc") || name.endsWith(".docx")) {
        return { label: "DOC", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: FileTextIcon }
    }
    if (type.startsWith("image/")) {
        return { label: "IMG", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: ImageIcon }
    }
    return { label: "FILE", color: "bg-muted text-muted-foreground", icon: FileIcon }
}

export default function FileUploader({
    value = [],
    onChange,
    maxFiles = 10,
    maxSizeMB = 10,
    folder = "notes",
    disabled = false
}: FileUploaderProps) {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [uploadingCount, setUploadingCount] = useState(0)

    // Initialize from value prop
    useEffect(() => {
        if (value.length > 0 && uploadedFiles.length === 0) {
            const filesFromValue = value.map((url, index) => {
                // Try to infer file type from URL
                let type = "application/octet-stream"
                if (url.includes('.pdf') || url.includes('f_pdf')) {
                    type = "application/pdf"
                } else if (url.match(/\.(jpg|jpeg)$/i) || url.includes('f_jpg')) {
                    type = "image/jpeg"
                } else if (url.includes('.png') || url.includes('f_png')) {
                    type = "image/png"
                } else if (url.includes('.webp') || url.includes('f_webp')) {
                    type = "image/webp"
                }

                return {
                    id: `file-${Date.now()}-${index}`,
                    name: url.split("/").pop()?.split('.')[0] || "file",
                    size: 0,
                    type,
                    url,
                    publicId: getPublicIdFromUrl(url) || "",
                }
            })
            setUploadedFiles(filesFromValue)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleFileUpload = useCallback(
        async (files: File[]) => {
            setErrors([])

            // Check max files limit
            if (uploadedFiles.length + files.length > maxFiles) {
                const errorMsg = `Maximum ${maxFiles} files allowed`
                setErrors([errorMsg])
                toast.error(errorMsg)
                return
            }

            const maxSize = maxSizeMB * 1024 * 1024

            // Validate all files first
            for (const file of files) {
                if (file.size > maxSize) {
                    const errorMsg = `File "${file.name}" is too large. Max size: ${maxSizeMB}MB`
                    setErrors([errorMsg])
                    toast.error(errorMsg)
                    return
                }
            }

            setUploadingCount(files.length)

            startTransition(async () => {
                try {
                    const uploadPromises = files.map(async (file) => {
                        // Get upload signature from our API
                        const signatureResponse = await fetch('/api/sign-cloudinary-params', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ folder }),
                        })

                        if (!signatureResponse.ok) {
                            throw new Error('Failed to get upload signature')
                        }

                        const { signature, timestamp, cloudName, apiKey, folder: uploadFolder } = await signatureResponse.json()

                        // Determine resource type based on file
                        const isImage = file.type.startsWith('image/')
                        const resourceType = isImage ? 'image' : 'auto'

                        // Upload directly to Cloudinary
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('signature', signature)
                        formData.append('timestamp', timestamp.toString())
                        formData.append('api_key', apiKey)
                        formData.append('folder', uploadFolder)

                        // Use the appropriate endpoint based on resource type
                        const uploadResponse = await fetch(
                            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                            {
                                method: 'POST',
                                body: formData,
                            }
                        )

                        if (!uploadResponse.ok) {
                            const error = await uploadResponse.json()
                            throw new Error(error.error?.message || 'Upload failed')
                        }

                        const result = await uploadResponse.json()

                        return {
                            success: true,
                            url: result.secure_url,
                            publicId: result.public_id,
                        }
                    })

                    const results = await Promise.all(uploadPromises)

                    const successfulUploads = results.filter(r => r.success)
                    const failedUploads = results.filter(r => !r.success)

                    if (successfulUploads.length > 0) {
                        const newFiles: UploadedFile[] = successfulUploads.map((r, index) => ({
                            id: `${r.publicId || Date.now()}-${index}`,
                            name: files[index].name,
                            size: files[index].size,
                            type: files[index].type,
                            url: r.url,
                            publicId: r.publicId || "",
                        }))

                        const updatedFiles = [...uploadedFiles, ...newFiles]
                        setUploadedFiles(updatedFiles)

                        if (onChange) {
                            onChange(updatedFiles.map((f) => f.url))
                        }

                        toast.success(`${successfulUploads.length} file(s) uploaded successfully!`)
                    }

                    if (failedUploads.length > 0) {
                        toast.error(`Failed to upload ${failedUploads.length} file(s)`)
                    }
                } catch (error) {
                    const errorMessage = "Failed to upload files. Please try again."
                    setErrors([errorMessage])
                    toast.error(errorMessage)
                    console.error("Upload error:", error)
                } finally {
                    setUploadingCount(0)
                }
            })
        },
        [folder, maxSizeMB, maxFiles, uploadedFiles, onChange]
    )

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) setIsDragging(true)
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            if (disabled) return

            const files = Array.from(e.dataTransfer.files)

            if (files.length === 0) {
                toast.error("Please drop valid files")
                return
            }

            handleFileUpload(files)
        },
        [disabled, handleFileUpload]
    )

    const openFileDialog = useCallback(() => {
        if (disabled || isPending) return

        const input = document.createElement("input")
        input.type = "file"
        input.accept = "*/*" // Accept all file types
        input.multiple = true
        input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || [])
            if (files.length > 0) handleFileUpload(files)
        }
        input.click()
    }, [disabled, isPending, handleFileUpload])

    const removeFile = useCallback((fileId: string) => {
        if (disabled) return

        const fileToRemove = uploadedFiles.find(f => f.id === fileId)
        if (!fileToRemove) return

        const publicId = fileToRemove.publicId

        if (publicId) {
            setDeletingId(fileId)
            startTransition(async () => {
                try {
                    const result = await deleteImageFromCloudinary(publicId)

                    if (result.success) {
                        const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId)
                        setUploadedFiles(updatedFiles)

                        if (onChange) {
                            onChange(updatedFiles.map((f) => f.url))
                        }

                        setErrors([])
                        toast.success("File deleted successfully")
                    } else {
                        toast.error(result.error || "Failed to delete file")
                    }
                } catch (error) {
                    console.error("Delete error:", error)
                    toast.error("Failed to delete file")
                } finally {
                    setDeletingId(null)
                }
            })
        } else {
            // Just remove from state if no public ID
            const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId)
            setUploadedFiles(updatedFiles)

            if (onChange) {
                onChange(updatedFiles.map((f) => f.url))
            }
        }
    }, [disabled, uploadedFiles, onChange])

    const clearFiles = useCallback(() => {
        setUploadedFiles([])
        setErrors([])
        if (onChange) {
            onChange([])
        }
    }, [onChange])

    const hasFiles = uploadedFiles.length > 0 || uploadingCount > 0

    return (
        <div className="flex flex-col gap-2">
            {/* Drop zone container */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                    "relative rounded-xl border-2 border-dashed transition-all duration-200",
                    isDragging
                        ? "border-primary bg-primary/[0.04] scale-[1.01]"
                        : "border-border/60 hover:border-border",
                    hasFiles ? "p-4" : "p-6",
                    disabled && "opacity-50 pointer-events-none"
                )}
            >
                {hasFiles ? (
                    <div className="space-y-3">
                        {/* Header row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    <span>
                                        {uploadedFiles.length} of {maxFiles} files
                                    </span>
                                </div>
                                {/* File count progress bar */}
                                <div className="hidden sm:block w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${(uploadedFiles.length / maxFiles) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={openFileDialog}
                                    disabled={uploadedFiles.length >= maxFiles || disabled || isPending}
                                    className="h-7 text-xs gap-1 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <UploadIcon className="size-3" />
                                    Add
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFiles}
                                    disabled={disabled || isPending}
                                    className="h-7 text-xs gap-1 px-2.5 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2Icon className="size-3" />
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {/* File list — horizontal rows, not a grid */}
                        <div className="space-y-1.5 max-h-72 overflow-y-auto">
                            {uploadedFiles.map((file, index) => {
                                const typeInfo = getFileTypeInfo(file.type, file.name)
                                const TypeIcon = typeInfo.icon
                                const isImage = file.type.startsWith("image/")
                                const isDeleting = deletingId === file.id

                                return (
                                    <div
                                        key={file.id}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-lg border border-border/40 bg-background p-2 pr-3 transition-all duration-200",
                                            isDeleting ? "opacity-50" : "hover:border-border hover:shadow-warm-sm"
                                        )}
                                    >
                                        {/* Thumbnail / Icon */}
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                                            {isImage ? (
                                                <CldImage
                                                    src={file.url}
                                                    alt={file.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <TypeIcon className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>

                                        {/* File info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-foreground">
                                                {file.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={cn(
                                                    "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                                                    typeInfo.color
                                                )}>
                                                    {typeInfo.label}
                                                </span>
                                                {file.size > 0 && (
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {formatBytes(file.size)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* File number */}
                                        <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums hidden sm:block">
                                            #{index + 1}
                                        </span>

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            disabled={isDeleting || disabled}
                                            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            aria-label="Remove file"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <XIcon className="w-3 h-3" />
                                            )}
                                        </button>
                                    </div>
                                )
                            })}

                            {/* Uploading skeleton rows */}
                            {Array.from({ length: uploadingCount }).map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-background p-2 pr-3"
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <Skeleton className="h-3.5 w-2/3" />
                                        <Skeleton className="h-2.5 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add more — inline drop hint */}
                        {uploadedFiles.length < maxFiles && (
                            <button
                                type="button"
                                onClick={openFileDialog}
                                disabled={disabled || isPending}
                                className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
                            >
                                <UploadIcon className="w-3 h-3" />
                                <span>Drop or click to add more files</span>
                            </button>
                        )}
                    </div>
                ) : (
                    /* Empty state */
                    <div
                        onClick={openFileDialog}
                        className="flex flex-col items-center justify-center py-6 text-center cursor-pointer group"
                    >
                        <div className="relative mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                                <CloudUpload className="w-6 h-6 text-primary" />
                            </div>
                            {/* Decorative ring */}
                            <div className="absolute inset-0 -m-1 rounded-2xl border-2 border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>

                        <p className="text-sm font-medium text-foreground mb-1">
                            Drop your files here, or <span className="text-primary">browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Images & PDFs · Up to {maxFiles} files · {maxSizeMB}MB each
                        </p>
                    </div>
                )}

                {/* Drag overlay */}
                {isDragging && (
                    <div className="absolute inset-0 rounded-xl bg-primary/[0.06] border-2 border-primary flex items-center justify-center z-10 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-2 text-primary">
                            <CloudUpload className="w-8 h-8 animate-bounce-soft" />
                            <p className="text-sm font-medium">Drop files here</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error */}
            {errors.length > 0 && (
                <div className="text-destructive flex items-center gap-1.5 text-xs" role="alert">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    )
}
