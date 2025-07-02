// components/audiobooks/BasicInfoCard.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BookOpen } from 'lucide-react';
import { useAddAudiobook } from './AddAudiobookProvider';

export default function BasicInfoCard() {
  const { form, setField, authors, errors, setErrors } = useAddAudiobook();

  const clearError = (key: keyof typeof errors) =>
    errors[key] && setErrors(e => ({ ...e, [key]: undefined }));

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Content Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            value={form.title}
            onChange={e => { setField('title', e.target.value); clearError('title'); }}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4}
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">{form.description.length}/500 characters</p>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
          <Select value={form.authorId} onValueChange={v => { setField('authorId', v); clearError('authorId'); }}>
            <SelectTrigger className={errors.authorId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select an author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.authorId && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.authorId}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
