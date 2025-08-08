'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface FileUploadProps {
  onUpload: (urls: string[]) => void
  existingImages?: string[]
  maxFiles?: number
  folder?: string
  className?: string
  accept?: string
  maxSize?: number
}

interface UploadedFile {
  url: string
  filename: string
  uploading?: boolean
}

export function FileUpload({ 
  onUpload, 
  existingImages = [], 
  maxFiles = 5, 
  folder = 'products',
  className = '',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB default
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(
    existingImages.map(url => ({ url, filename: url.split('/').pop() || '' }))
  )
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (fileList: FileList) => {
    const newFiles = Array.from(fileList)
    
    // Check if adding new files would exceed the limit
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file types and sizes
    for (const file of newFiles) {
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        alert(`File ${file.name} is not a valid image type`)
        return
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`)
        return
      }
    }

    // Add files with uploading state
    const uploadingFiles = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      filename: file.name,
      uploading: true
    }))
    
    setFiles(prev => [...prev, ...uploadingFiles])

    // Upload files
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i]
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          setFiles(prev => prev.map((f, index) => {
            if (index === prev.length - newFiles.length + i) {
              // Revoke the object URL to free memory
              URL.revokeObjectURL(f.url)
              return {
                url: result.data.url,
                filename: result.data.filename,
                uploading: false
              }
            }
            return f
          }))
          
          // Call onUpload with the new URL
          onUpload([result.data.url])
        } else {
          // Remove failed upload
          setFiles(prev => prev.filter((_, index) => index !== prev.length - newFiles.length + i))
          alert(`Failed to upload ${file.name}: ${result.error}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        setFiles(prev => prev.filter((_, index) => index !== prev.length - newFiles.length + i))
        alert(`Failed to upload ${file.name}`)
      }
    }
  }

  const removeFile = async (index: number) => {
    const file = files[index]
    
    // If it's an uploaded file (not just a preview), try to delete it from server
    if (!file.uploading && file.url.startsWith('/images/')) {
      try {
        await fetch(`/api/upload?filename=${file.filename}&folder=${folder}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }
    
    // If it's a blob URL, revoke it
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
    
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onUpload(newFiles.filter(f => !f.uploading).map(f => f.url))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }



  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>
            {' '}or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, WebP up to 5MB (max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {file.uploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Image
                    src={file.url}
                    alt={file.filename}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder.svg'
                    }}
                  />
                )}
              </div>
              
              {!file.uploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              <p className="mt-1 text-xs text-gray-500 truncate">
                {file.filename}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}