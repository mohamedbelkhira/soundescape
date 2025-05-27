"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import * as z from "zod";
import type { UseFormReturn } from "react-hook-form";

// Zod schema for form validation
export const categoryFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});
export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
  // react-hook-form integration
  form?: UseFormReturn<CategoryFormInputs>;
  disabled?: boolean;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
  form,
  disabled = false,
}: CategoryFormProps) {
  const router = useRouter();
  const isControlled = !!form;

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({
    title: category?.title || "",
    description: category?.description || "",
  });

  const handleInternalSubmit = async (data?: CategoryFormInputs) => {
    const values = data || formData;
    if (!values.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const url = category ? `/api/categories/${category.id}` : "/api/categories";
      const method = category ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
         description: values.description?.trim() ?? null,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save category");
      }
      toast.success(category ? "Category updated successfully" : "Category created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    }
  };

  if (isControlled && form) {
    return (
      <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Enter category title"
            disabled={disabled}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Enter category description (optional)"
            rows={4}
            disabled={disabled}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
          )}
        </div>
      </form>
    );
  }

  // Uncontrolled mode
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleInternalSubmit(); }} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter category title"
          required
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter category description (optional)"
          rows={4}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={disabled || !formData.title.trim()}>
          {category ? "Update Category" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel ?? (() => router.back())}
          disabled={disabled}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}