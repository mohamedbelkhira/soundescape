// components/audiobooks/SubmitActions.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Save, Crown, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddAudiobook } from './AddAudiobookProvider';
import { audiobookFormSchema } from '@/lib/validation/audiobookSchema';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SubmitActions() {
  const {
    form, errors, setErrors,
    coverUpload, audioUpload,
  } = useAddAudiobook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const parse = audiobookFormSchema.safeParse(form);
    const newErrors: typeof errors = {};
    if (!parse.success) {
      parse.error.issues.forEach(i => { newErrors[i.path[0] as keyof typeof errors] = i.message; });
    }
    if (!audioUpload.url) newErrors.audioUrl = 'Audio file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        description: form.description || undefined,
        coverUrl: coverUpload.url || undefined,
        audioUrl: audioUpload.url,
        totalTime: form.totalTime ? Number(form.totalTime) : undefined,
      };
      const r = await fetch('/api/audiobooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error((await r.json()).message);
      toast.success('Audiobook created!');
      router.push('/admin/audiobooks');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create audiobook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end items-center gap-4 pt-6 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {form.isPremium && (
          <Badge variant="secondary" className="gap-1"><Crown className="h-3 w-3" /> Premium</Badge>
        )}
        {form.isPublished && (
          <Badge variant="default" className="gap-1"><Eye className="h-3 w-3" /> Published</Badge>
        )}
      </div>
      <Button onClick={submit} disabled={loading || !audioUpload.url} size="lg" className="min-w-[160px] gap-2">
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creating…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> Create Audiobook
          </>
        )}
      </Button>
    </div>
  );
}
