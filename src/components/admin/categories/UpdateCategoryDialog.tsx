'use client'
import React, { useState, useEffect, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CustomDialog from '@/components/common/custom-dialog'
import CategoryForm, { categoryFormSchema, type CategoryFormInputs } from '@/components/admin/categories/category-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface UpdateCategoryDialogProps {
  trigger: ReactNode
  categoryId: string
  onSuccess?: () => void // Add this prop
}

export default function UpdateCategoryDialog({ 
  trigger, 
  categoryId, 
  onSuccess 
}: UpdateCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { title: '', description: '' },
  })

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/categories/${categoryId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load category')
          return res.json()
        })
        .then((data: CategoryFormInputs) => {
          form.reset({ title: data.title, description: data.description ?? '' })
        })
        .catch(err => {
          toast.error(err.message)
          setIsOpen(false)
        })
    }
  }, [isOpen, categoryId, form])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setIsSubmitting(false)
      form.reset()
    }
  }

  const onSubmit = async (data: CategoryFormInputs) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: data.title.trim(), 
          description: data.description?.trim() ?? null 
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Failed to update category')
      }

      toast.success('Category updated successfully')
      handleOpenChange(false)
      
      // Call the onSuccess callback to refresh the table data
      onSuccess?.()
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update category')
      setIsSubmitting(false)
    }
  }

  return (
    <CustomDialog
      trigger={trigger}
      title="Edit Category"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CategoryForm form={form} disabled={isSubmitting} />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Category'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}