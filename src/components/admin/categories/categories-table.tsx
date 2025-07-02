// src/components/categories/categories-table.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EditAction from "@/components/common/edit-action";
import DeleteDialog from "@/components/common/delete-dialog";
import TableWrapper from "@/components/common/table-wrapper";
import { CategoryWithCount } from "@/services/category.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UpdateCategoryDialog from "./UpdateCategoryDialog";
import { truncate } from "@/lib/utils";
interface CategoriesTableProps {
  categories: CategoryWithCount[];
  onUpdate?: () => void;
}

export default function CategoriesTable({ 
  categories, 
  onUpdate 
}: CategoriesTableProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (categoryId: string) => {
    setDeletingIds(prev => new Set(prev).add(categoryId));
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete category");
      }

      if (onUpdate) {
        onUpdate();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
      throw error; // Re-throw so DeleteDialog can handle the error state
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Audiobooks</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                {category.title}
              </TableCell>
              <TableCell>
                {category.description ? (
                  <span className="text-sm text-muted-foreground line-clamp-2">
                        {truncate(category.description, 50)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    No description
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {category._count.audiobooks} audiobook{category._count.audiobooks !== 1 ? 's' : ''}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(category.createdAt), "MMM dd, yyyy")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* later add view action to check available ebooks for that category */}
                  {/* <EditAction href={`/admin/categories/${category.id}/edit`} /> */}
                  <UpdateCategoryDialog
                    trigger={<EditAction />}
                    categoryId={category.id}
                    onSuccess={onUpdate} // Pass the onUpdate callback here
                  />
                  <DeleteDialog
                    title="Delete Category"
                    itemName={category.title}
                    description={
                      category._count.audiobooks > 0
                        ? `This category is currently assigned to ${category._count.audiobooks} audiobook${category._count.audiobooks !== 1 ? 's' : ''}. Deleting it will remove it from all audiobooks. Are you sure you want to continue?`
                        : undefined
                    }
                    onDelete={() => handleDelete(category.id)}
                    disabled={deletingIds.has(category.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}