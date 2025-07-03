'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Upload, X, Play, Pause, Volume2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { AudiobookWithDetails } from '@/services/audiobook.service'

interface Author {
  id: string
  name: string
}

interface Category {
  id: string
  title: string
}

interface FileUpload {
  file: File | null
  url: string | null
  uploading: boolean
  filename?: string
}

interface UpdateAudiobookPageProps {
  audiobook: AudiobookWithDetails
}

export default function UpdateAudiobookPage({ audiobook }: UpdateAudiobookPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Form state - initialize with existing audiobook data
  const [formData, setFormData] = useState({
    title: audiobook.title,
    description: audiobook.description || '',
    authorId: audiobook.authorId,
    categoryIds: audiobook.categories.map(cat => cat.category.id),
    totalTime: audiobook.totalTime?.toString() || '',
    isPublished: audiobook.isPublished
  })

  // File upload state - initialize with existing URLs
  const [coverUpload, setCoverUpload] = useState<FileUpload>({
    file: null,
    url: audiobook.coverUrl,
    uploading: false
  })

  const [audioUpload, setAudioUpload] = useState<FileUpload>({
    file: null,
    url: audiobook.audioUrl,
    uploading: false
  })

  // Audio preview state
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(audiobook.totalTime)

  // Load authors and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          fetch('/api/authors?limit=100'),
          fetch('/api/categories?limit=100')
        ])

        if (authorsRes.ok) {
          const authorsData = await authorsRes.json()
          setAuthors(authorsData.authors || [])
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories || [])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load authors and categories')
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [])

  // Handle form input changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: checked
        ? [...prev.categoryIds, categoryId]
        : prev.categoryIds.filter(id => id !== categoryId)
    }))
  }

  // Handle file selection
  const handleFileSelect = (type: 'cover' | 'audio') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (type === 'cover') {
      setCoverUpload(prev => ({ ...prev, file, url: null }))
    } else {
      setAudioUpload(prev => ({ ...prev, file, url: null }))
      
      // Create audio element for preview and duration detection
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      audio.src = url
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
        setFormData(prev => ({
          ...prev,
          totalTime: Math.round(audio.duration).toString()
        }))
      })
      
      setAudioElement(audio)
    }
  }

  // Upload file
  const uploadFile = async (type: 'cover' | 'audio') => {
    const upload = type === 'cover' ? coverUpload : audioUpload
    const setUpload = type === 'cover' ? setCoverUpload : setAudioUpload
    
    if (!upload.file) return

    setUpload(prev => ({ ...prev, uploading: true }))

    try {
      const formData = new FormData()
      formData.append('file', upload.file)

      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const result = await response.json()
      
      setUpload(prev => ({
        ...prev,
        url: result.file.url,
        filename: result.file.filename,
        uploading: false
      }))

      toast.success(`${type === 'cover' ? 'Cover' : 'Audio'} uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
      setUpload(prev => ({ ...prev, uploading: false }))
    }
  }

  // Remove uploaded file
  const removeFile = async (type: 'cover' | 'audio') => {
    const upload = type === 'cover' ? coverUpload : audioUpload
    const setUpload = type === 'cover' ? setCoverUpload : setAudioUpload

    if (upload.filename) {
      try {
        await fetch(`/api/upload/${type}?filename=${upload.filename}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error('Failed to delete file:', error)
      }
    }

    setUpload({
      file: null,
      url: null,
      uploading: false
    })

    if (type === 'audio') {
      setAudioElement(null)
      setIsPlaying(false)
      setDuration(null)
      setFormData(prev => ({ ...prev, totalTime: '' }))
    }
  }

  // Audio preview controls
  const toggleAudioPreview = () => {
    if (!audioElement && audioUpload.url) {
      // Create audio element from existing URL
      const audio = new Audio(audioUpload.url)
      setAudioElement(audio)
      audio.play()
      setIsPlaying(true)
      return
    }

    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      audioElement.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false)
      audioElement.addEventListener('ended', handleEnded)
      return () => audioElement.removeEventListener('ended', handleEnded)
    }
  }, [audioElement])

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Helper function to normalize the image URL
  const normalizeImageUrl = (url: string | null): string => {
    if (!url) return "";
    
    // If URL already starts with / or is absolute, return as is
    if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Add leading slash for relative paths
    return `/${url}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.authorId) {
      toast.error('Author is required')
      return
    }

    if (!audioUpload.url) {
      toast.error('Audio file is required')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        coverUrl: coverUpload.url || undefined,
        audioUrl: audioUpload.url,
        totalTime: formData.totalTime ? parseInt(formData.totalTime) : undefined,
        authorId: formData.authorId,
        categoryIds: formData.categoryIds,
        isPublished: formData.isPublished
      }

      const response = await fetch(`/api/audiobooks/${audiobook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update audiobook')
      }
      

      toast.success('Audiobook updated successfully')
      router.push('/admin/audiobooks')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update audiobook')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/audiobooks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Audiobooks
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Audiobook</h1>
          <p className="text-muted-foreground">
            Update &quot;{audiobook.title}&quot; configuration
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter audiobook title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter audiobook description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Select
                  value={formData.authorId}
                  onValueChange={(value) => handleInputChange('authorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalTime">Duration (seconds)</Label>
                <Input
                  id="totalTime"
                  type="number"
                  value={formData.totalTime}
                  onChange={(e) => handleInputChange('totalTime', e.target.value)}
                  placeholder="Duration in seconds"
                  min="0"
                />
                {duration && (
                  <p className="text-sm text-muted-foreground">
                    Current duration: {formatDuration(duration)}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.categoryIds.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category.id}`}>
                      {category.title}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Uploads */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cover Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!coverUpload.file && coverUpload.url ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={normalizeImageUrl(coverUpload.url)}
                      alt="Current cover"
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeFile('cover')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Change Cover Image</span>
                      </Button>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect('cover')}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              ) : !coverUpload.url ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Click to upload cover image
                        </span>
                        <Input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect('cover')}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                  
                  {coverUpload.file && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{coverUpload.file.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => uploadFile('cover')}
                        disabled={coverUpload.uploading}
                      >
                        {coverUpload.uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={coverUpload.url}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeFile('cover')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audio Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Audio File *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!audioUpload.file && audioUpload.url ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current audio file</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile('audio')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleAudioPreview}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm text-gray-600">
                        Preview current audio
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <Label htmlFor="audio-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Change Audio File</span>
                      </Button>
                      <Input
                        id="audio-upload"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileSelect('audio')}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              ) : !audioUpload.url ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Volume2 className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="audio-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Click to upload audio file
                        </span>
                        <Input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          onChange={handleFileSelect('audio')}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        MP3, WAV, M4A, AAC up to 100MB
                      </p>
                    </div>
                  </div>
                  
                  {audioUpload.file && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{audioUpload.file.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => uploadFile('audio')}
                        disabled={audioUpload.uploading}
                      >
                        {audioUpload.uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">New audio uploaded</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile('audio')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {audioElement && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={toggleAudioPreview}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-sm text-gray-600">
                          Preview new audio
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !audioUpload.url}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Updating...' : 'Update Audiobook'}
          </Button>
        </div>
      </form>
    </div>
  )
}