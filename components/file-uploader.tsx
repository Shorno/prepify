"use client"

import { useState, useTransition, useCallback, useEffect } from "react"
import { AlertCircleIcon, FileArchiveIcon, FileIcon, FileSpreadsheetIcon, FileTextIcon, HeadphonesIcon, ImageIcon, Trash2Icon, UploadIcon, VideoIcon, XIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@/components/ui/skeleton"
import { getPublicIdFromUrl } from "@/utils/getPublicIdFromUrl"
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "@/actions/cloudinary"

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

const getFileIcon = (type: string, name: string) => {
    const iconMap = {
        pdf: {
            icon: FileTextIcon,
            conditions: (type: string, name: string) =>
                type.includes("pdf") ||
                name.endsWith(".pdf") ||
                type.includes("word") ||
                name.endsWith(".doc") ||
                name.endsWith(".docx"),
        },
        archive: {
            icon: FileArchiveIcon,
            conditions: (type: string, name: string) =>
                type.includes("zip") || type.includes("archive") || name.endsWith(".zip") || name.endsWith(".rar"),
        },
        excel: {
            icon: FileSpreadsheetIcon,
            conditions: (type: string, name: string) =>
                type.includes("excel") || name.endsWith(".xls") || name.endsWith(".xlsx"),
        },
        video: {
            icon: VideoIcon,
            conditions: (type: string) => type.includes("video/"),
        },
        audio: {
            icon: HeadphonesIcon,
            conditions: (type: string) => type.includes("audio/"),
        },
        image: {
            icon: ImageIcon,
            conditions: (type: string) => type.startsWith("image/"),
        },
    }

    for (const { icon: Icon, conditions } of Object.values(iconMap)) {
        if (conditions(type, name)) {
            return <Icon className="size-5 opacity-60" />
        }
    }

    return <FileIcon className="size-5 opacity-60" />
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

    console.log(uploadedFiles)

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
                        const formData = new FormData()
                        formData.append("file", file)
                        formData.append("folder", folder)
                        return await uploadImageToCloudinary(formData)
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

    const getFilePreview = (file: UploadedFile) => {
        return (
            <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
                {file.type.startsWith("image/") ? (
                    <CldImage
                        src={file.url}
                        alt={file.name}
                        width={200}
                        height={200}
                        className="size-full rounded-t-[inherit] object-cover"
                    />
                ) : (
                    getFileIcon(file.type, file.name)
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={uploadedFiles.length > 0 || uploadingCount > 0 || undefined}
                // className="border-input relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center data-[dragging=true]:bg-accent/50"
            >
                {uploadedFiles.length > 0 || uploadingCount > 0 ? (
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2 pb-3">
                            <h3 className="truncate text-sm font-medium">Files ({uploadedFiles.length}/{maxFiles})</h3>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={openFileDialog}
                                    disabled={uploadedFiles.length >= maxFiles || disabled || isPending}
                                >
                                    <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                                    Add files
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFiles}
                                    disabled={disabled || isPending}
                                >
                                    <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                                    Remove all
                                </Button>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto overflow-x-hidden">
                            <div className="grid grid-cols-2 p-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {uploadedFiles.map((file) => (
                                    <div key={file.id} className="bg-background relative flex flex-col rounded-md border">
                                        {getFilePreview(file)}
                                        <Button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            size="icon"
                                            disabled={deletingId === file.id || disabled}
                                            className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                            aria-label="Remove file"
                                        >
                                            {deletingId === file.id ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <XIcon className="size-3.5" />
                                            )}
                                        </Button>
                                        <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                                            <p className="truncate text-[13px] font-medium">{file.name}</p>
                                            <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading skeletons */}
                                {Array.from({ length: uploadingCount }).map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="relative aspect-square rounded-md bg-accent overflow-hidden"
                                    >
                                        <Skeleton className="h-full w-full" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/10">
                                            <Loader2 className="size-8 opacity-60 animate-spin" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div
                            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                            aria-hidden="true"
                        >
                            <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
                        <p className="text-muted-foreground text-xs">
                            Max {maxFiles} files ∙ Up to {maxSizeMB}MB each
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4 bg-transparent"
                            onClick={openFileDialog}
                            disabled={disabled || isPending}
                        >
                            {isPending ? (
                                <Loader2 className="-ms-1 size-4 animate-spin opacity-60" aria-hidden="true" />
                            ) : (
                                <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                            )}
                            Select files
                        </Button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    )
}
