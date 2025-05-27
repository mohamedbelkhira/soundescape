'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import CustomDialog from '@/components/common/custom-dialog'
import AuthorForm, { authorFormSchema, type AuthorFormInputs } from '@/components/admin/authors/author-form'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface AddAuthorDialogProps {
  onSuccess?: () => void
}

export default function AddAuthorDialog({ onSuccess }: AddAuthorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AuthorFormInputs>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: { 
      name: '', 
      isActive: true 
    },
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: AuthorFormInputs) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          isActive: data.isActive ?? true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create author')
      }

      toast.success('Author added successfully')
      handleOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to add author')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CustomDialog
     trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Author
            </Button>
          }
      title="Add Author"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AuthorForm form={form} disabled={isSubmitting} />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Author'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}