'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CustomDialog from '@/components/common/custom-dialog'
import AuthorForm, { authorFormSchema, type AuthorFormInputs } from '@/components/admin/authors/author-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface UpdateAuthorDialogProps {
  trigger: ReactNode
  authorId: string
  onSuccess?: () => void
}

export default function UpdateAuthorDialog({
  trigger,
  authorId,
  onSuccess
}: UpdateAuthorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AuthorFormInputs>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: { 
      name: '', 
      isActive: true 
    },
  })

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/authors/${authorId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load author')
          return res.json()
        })
        .then((data) => {
          form.reset({ 
            name: data.name, 
            isActive: data.isActive ?? true 
          })
        })
        .catch(err => {
          toast.error(err.message)
          setIsOpen(false)
        })
    }
  }, [isOpen, authorId, form])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setIsSubmitting(false)
      form.reset()
    }
  }

  const onSubmit = async (data: AuthorFormInputs) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          isActive: data.isActive ?? true
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Failed to update author')
      }

      toast.success('Author updated successfully')
      handleOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update author')
      setIsSubmitting(false)
    }
  }

  return (
    <CustomDialog
      trigger={trigger}
      title="Edit Author"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AuthorForm form={form} disabled={isSubmitting} />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Author'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}