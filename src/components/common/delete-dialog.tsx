// src/components/common/delete-dialog.tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteDialogProps {
  title?: string;
  description?: string;
  itemName?: string;
  onDelete: () => Promise<void>;
  trigger?: React.ReactNode;
  disabled?: boolean;
  variant?: "destructive" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function DeleteDialog({
  title = "Delete Item",
  description,
  itemName,
  onDelete,
  trigger,
  disabled = false,
  variant = "ghost",
  size = "icon",
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      toast.success(`${itemName || "Item"} deleted successfully`);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultTrigger = (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="h-4 w-4" />
      {size !== "icon" && <span className="ml-2">Delete</span>}
    </Button>
  );

  const finalDescription = description || 
    `Are you sure you want to delete ${itemName ? `"${itemName}"` : "this item"}? This action cannot be undone.`;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {finalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}