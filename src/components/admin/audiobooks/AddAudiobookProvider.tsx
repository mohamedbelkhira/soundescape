// components/audiobooks/AddAudiobookProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { audiobookFormSchema } from '@/lib/validation/audiobookSchema';

type Author = { id: string; name: string };
type Category = { id: string; title: string };

export interface FileUploadState {
  file: File | null;
  url: string | null;
  uploading: boolean;
  filename?: string;
}

interface FormState extends z.infer<typeof audiobookFormSchema> {} // keeps TS in sync

interface Ctx {
  loadingData: boolean;
  authors: Author[];
  categories: Category[];
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Partial<Record<keyof FormState | 'audioUrl', string>>;
  setErrors: React.Dispatch<React.SetStateAction<Ctx['errors']>>;
  coverUpload: FileUploadState;
  setCoverUpload: React.Dispatch<React.SetStateAction<FileUploadState>>;
  audioUpload: FileUploadState;
  setAudioUpload: React.Dispatch<React.SetStateAction<FileUploadState>>;
}

const AddCtx = createContext<Ctx | null>(null);
export const useAddAudiobook = () => {
  const ctx = useContext(AddCtx);
  if (!ctx) throw new Error('useAddAudiobook must be used within AddAudiobookProvider');
  return ctx;
};

export const AddAudiobookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /* ---------- remote data ---------- */
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [a, c] = await Promise.all([
          fetch('/api/authors?limit=100').then(r => r.json()),
          fetch('/api/categories?limit=100').then(r => r.json())
        ]);
        setAuthors(a.authors ?? []);
        setCategories(c.categories ?? []);
      } catch (e) {
        toast.error('Failed to load authors or categories');
      } finally {
        setLoadingData(false);
      }
    })();
  }, []);

  /* ---------- form state ---------- */
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    authorId: '',
    categoryIds: [],
    totalTime: '',
    isPublished: false,
    isPremium: false,
  });

  const setField = useCallback(
    (k, v) => setForm(prev => ({ ...prev, [k]: v })),
    []
  );

  const [errors, setErrors] = useState<Ctx['errors']>({});

  /* ---------- file uploads ---------- */
  const [coverUpload, setCoverUpload] = useState<FileUploadState>({ file: null, url: null, uploading: false });
  const [audioUpload, setAudioUpload] = useState<FileUploadState>({ file: null, url: null, uploading: false });

  return (
    <AddCtx.Provider value={{
      loadingData,
      authors,
      categories,
      form,
      setField,
      errors,
      setErrors,
      coverUpload,
      setCoverUpload,
      audioUpload,
      setAudioUpload,
    }}>
      {children}
    </AddCtx.Provider>
  );
};
