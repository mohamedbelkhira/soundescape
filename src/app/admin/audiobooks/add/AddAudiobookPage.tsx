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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Upload, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  ArrowLeft, 
  BookOpen,
  User,
  Tag,
  Clock,
  Image,
  Music,
  Crown,
  Eye,
  Save,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

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

export default function AddAudiobookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Form state with new fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorId: '',
    categoryIds: [] as string[],
    totalTime: '',
    isPublished: false,
    isPremium: false, // New field
  })

  // File upload state
  const [coverUpload, setCoverUpload] = useState<FileUpload>({
    file: null,
    url: null,
    uploading: false
  })

  const [audioUpload, setAudioUpload] = useState<FileUpload>({
    file: null,
    url: null,
    uploading: false
  })

  // Audio preview state
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.authorId) {
      newErrors.authorId = 'Author selection is required'
    }

    if (!audioUpload.url) {
      newErrors.audioUrl = 'Audio file is required'
    }

    if (formData.totalTime && parseInt(formData.totalTime) <= 0) {
      newErrors.totalTime = 'Duration must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
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

    // File size validation
    const maxSize = type === 'cover' ? 5 * 1024 * 1024 : 100 * 1024 * 1024 // 5MB for cover, 100MB for audio
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${type === 'cover' ? '5MB' : '100MB'}`)
      return
    }

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

      // Clear audio error
      if (errors.audioUrl) {
        setErrors(prev => ({ ...prev, audioUrl: '' }))
      }
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

      toast.success(`${type === 'cover' ? 'Cover image' : 'Audio file'} uploaded successfully`)
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
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
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
        isPublished: formData.isPublished,
        isPremium: formData.isPremium, // New field
      }

      const response = await fetch('/api/audiobooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create audiobook')
      }

      toast.success('Audiobook created successfully!')
      router.push('/admin/audiobooks')
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create audiobook')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <div className="text-muted-foreground">Loading authors and categories...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Add New Audiobook</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Create and publish a new audiobook to your library
          </p>
        </div>
        <Link href="/admin/audiobooks">
          <Button variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Basic Information</h2>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Content Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter the audiobook title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of the audiobook..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium">
                    Author <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.authorId}
                    onValueChange={(value) => handleInputChange('authorId', value)}
                  >
                    <SelectTrigger className={errors.authorId ? 'border-red-500' : ''}>
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
                  {errors.authorId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.authorId}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Duration & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="totalTime" className="text-sm font-medium">
                    Duration (seconds)
                  </Label>
                  <Input
                    id="totalTime"
                    type="number"
                    value={formData.totalTime}
                    onChange={(e) => handleInputChange('totalTime', e.target.value)}
                    placeholder="Duration in seconds"
                    min="0"
                    className={errors.totalTime ? 'border-red-500' : ''}
                  />
                  {duration && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        Auto-detected: {formatDuration(duration)}
                      </p>
                    </div>
                  )}
                  {errors.totalTime && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.totalTime}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                        Publish immediately
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Make this audiobook visible to users right away
                      </p>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="isPremium"
                      checked={formData.isPremium}
                      onCheckedChange={(checked) => handleInputChange('isPremium', checked)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="isPremium" className="text-sm font-medium cursor-pointer">
                        Premium content
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Requires premium subscription to access
                      </p>
                    </div>
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Categories</h2>
          </div>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Select Categories</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose one or more categories that best describe this audiobook
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.categoryIds.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm font-medium cursor-pointer flex-1">
                      {category.title}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.categoryIds.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-2">Selected categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.categoryIds.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId)
                      return category ? (
                        <Badge key={categoryId} variant="secondary" className="bg-green-100 text-green-800">
                          {category.title}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* File Uploads Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Media Files</h2>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Cover Upload */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Cover Image
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a cover image for your audiobook (optional)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!coverUpload.url ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="cover-upload" className="cursor-pointer">
                          <span className="text-lg font-medium text-primary hover:text-primary/80 transition-colors">
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
                        <p className="text-sm text-gray-500">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                    
                    {coverUpload.file && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium truncate">{coverUpload.file.name}</span>
                        </div>
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
                    <div className="relative group">
                      <img
                        src={coverUpload.url}
                        alt="Cover preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile('cover')}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium">
                        Cover image uploaded successfully
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audio Upload */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Audio File <span className="text-red-500">*</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload the main audio file for your audiobook
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!audioUpload.url ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Volume2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="audio-upload" className="cursor-pointer">
                          <span className="text-lg font-medium text-primary hover:text-primary/80 transition-colors">
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
                        <p className="text-sm text-gray-500">
                          MP3, WAV, M4A, AAC up to 100MB
                        </p>
                      </div>
                    </div>
                    
                    {audioUpload.file && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium truncate">{audioUpload.file.name}</span>
                        </div>
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

                    {errors.audioUrl && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.audioUrl}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Audio file uploaded</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('audio')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {audioElement && (
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAudioPreview}
                            className="gap-2"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {isPlaying ? 'Pause' : 'Preview'}
                          </Button>
                          {duration && (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(duration)}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex justify-end items-center gap-4 pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {formData.isPremium && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            )}
            {formData.isPublished && (
              <Badge variant="default" className="gap-1">
                <Eye className="h-3 w-3" />
                Published
              </Badge>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || !audioUpload.url}
            size="lg"
            className="min-w-[160px] gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Audiobook
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}