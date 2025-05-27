'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import CustomDialog from '@/components/common/custom-dialog'
import CategoryForm, { categoryFormSchema, type CategoryFormInputs } from '@/components/admin/categories/category-form'
import { toast } from 'sonner'

interface AddCategoryDialogProps {
  onSuccess?: () => void
}

export default function AddCategoryDialog({ onSuccess }: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { title: '', description: '' },
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: CategoryFormInputs) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title.trim(),
          description: data.description?.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create category')
      }

      toast.success('Category added successfully')
      handleOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to add category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CustomDialog
      trigger={
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      }
      title="Add Category"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CategoryForm form={form} disabled={isSubmitting} />
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
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}
