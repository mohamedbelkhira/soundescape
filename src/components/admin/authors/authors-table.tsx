// src/components/admin/authors/authors-table.tsx
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
import { AuthorWithCount } from "@/services/author.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";
import UpdateAuthorDialog from "./UpdateAuthorDialog";

interface AuthorsTableProps {
  authors: AuthorWithCount[];
  onUpdate?: () => void;
}

export default function AuthorsTable({ 
  authors, 
  onUpdate 
}: AuthorsTableProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());


  const handleDelete = async (authorId: string) => {
    setDeletingIds(prev => new Set(prev).add(authorId));
    
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete author");
      }

      toast.success("Author deleted successfully");
      
      if (onUpdate) {
        onUpdate();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete author"
      );
      throw error; // Re-throw so DeleteDialog can handle the error state
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(authorId);
        return newSet;
      });
    }
  };



  if (authors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No authors found.</p>
      </div>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Audiobooks</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.id}>
              <TableCell className="font-medium">
                {author.name}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={author.isActive ? "default" : "secondary"}
                  className={author.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  <div className="flex items-center gap-1">
                    {author.isActive ? (
                      <UserCheck className="h-3 w-3" />
                    ) : (
                      <UserX className="h-3 w-3" />
                    )}
                    {author.isActive ? 'Active' : 'Inactive'}
                  </div>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {author._count.audiobooks} audiobook{author._count.audiobooks !== 1 ? 's' : ''}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(author.createdAt), "MMM dd, yyyy")}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(author.updatedAt), "MMM dd, yyyy")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                
                  <UpdateAuthorDialog
                    trigger={<EditAction />}
                    authorId={author.id}
                    onSuccess={onUpdate}
                  />
                                  
                  <DeleteDialog
                    title="Delete Author"
                    itemName={author.name}
                    description={
                      author._count.audiobooks > 0
                        ? `This author has ${author._count.audiobooks} audiobook${author._count.audiobooks !== 1 ? 's' : ''}. Deleting this author will permanently remove them and may affect related audiobooks. Are you sure you want to continue?`
                        : `This will permanently delete the author "${author.name}". This action cannot be undone.`
                    }
                    onDelete={() => handleDelete(author.id)}
                    disabled={deletingIds.has(author.id)}
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