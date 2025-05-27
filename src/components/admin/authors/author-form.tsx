"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Author } from "@prisma/client";
import * as z from "zod";
import type { UseFormReturn } from "react-hook-form";

// Zod schema for form validation
export const authorFormSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  isActive: z.boolean().optional(),
});

export type AuthorFormInputs = z.infer<typeof authorFormSchema>;

interface AuthorFormProps {
  author?: Author;
  onSuccess?: () => void;
  onCancel?: () => void;
  // react-hook-form integration
  form?: UseFormReturn<AuthorFormInputs>;
  disabled?: boolean;
}

export default function AuthorForm({
  author,
  onSuccess,
  onCancel,
  form,
  disabled = false,
}: AuthorFormProps) {
  const router = useRouter();
  const isControlled = !!form;

  const [formData, setFormData] = useState<{
    name: string;
    isActive: boolean;
  }>({
    name: author?.name || "",
    isActive: author?.isActive ?? true,
  });

  const handleInternalSubmit = async (data?: AuthorFormInputs) => {
    const values = data || formData;
    if (!values.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      const url = author ? `/api/authors/${author.id}` : "/api/authors";
      const method = author ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          isActive: values.isActive ?? true,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save author");
      }

      toast.success(
        author ? "Author updated successfully" : "Author created successfully"
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save author"
      );
    }
  };

  if (isControlled && form) {
    return (
      <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Enter author name"
            disabled={disabled}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={form.watch("isActive") ?? true}
            onCheckedChange={(checked) => form.setValue("isActive", checked)}
            disabled={disabled}
          />
          <Label htmlFor="isActive">Active Author</Label>
        </div>
      </form>
    );
  }

  // Uncontrolled mode
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleInternalSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Enter author name"
          required
          disabled={disabled}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
          disabled={disabled}
        />
        <Label htmlFor="isActive">Active Author</Label>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={disabled || !formData.name.trim()}>
          {author ? "Update Author" : "Create Author"}
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