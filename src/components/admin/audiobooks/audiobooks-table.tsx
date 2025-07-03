// src/components/admin/audiobooks/audiobooks-table.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditAction from "@/components/common/edit-action";
import DeleteDialog from "@/components/common/delete-dialog";
import TableWrapper from "@/components/common/table-wrapper";
import { Eye, EyeOff, Play, Clock, Users, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AudiobookWithDetails } from "@/services/audiobook.service";

interface AudiobooksTableProps {
  audiobooks: AudiobookWithDetails[];
  onUpdate?: () => void;
}

export default function AudiobooksTable({ 
  audiobooks, 
  onUpdate 
}: AudiobooksTableProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (audiobookId: string) => {
    setDeletingIds(prev => new Set(prev).add(audiobookId));
    
    try {
      const response = await fetch(`/api/audiobooks/${audiobookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete audiobook");
      }

      toast.success("Audiobook deleted successfully");
      
      if (onUpdate) {
        onUpdate();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete audiobook"
      );
      throw error;
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(audiobookId);
        return newSet;
      });
    }
  };

  const handleTogglePublish = async (audiobookId: string) => {
    setTogglingIds(prev => new Set(prev).add(audiobookId));
    
    try {
      const response = await fetch(`/api/audiobooks/${audiobookId}/toggle-published`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to toggle publish status");
      }

      const result = await response.json();
      toast.success(result.message);
      
      if (onUpdate) {
        onUpdate();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to toggle publish status"
      );
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(audiobookId);
        return newSet;
      });
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Helper function to normalize the image URL
  const normalizeImageUrl = (url: string | null): string => {
    if (!url) return "";
    
    // If URL already starts with / or is absolute, return as is
    if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Add leading slash for relative paths
    return `/${url}`;
  };

  if (audiobooks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No audiobooks found.</p>
      </div>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Audiobook</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audiobooks.map((audiobook) => {
            const normalizedCoverUrl = normalizeImageUrl(audiobook.coverUrl);
            
            return (
              <TableRow key={audiobook.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      {normalizedCoverUrl ? (
                        <Image
                          src={normalizedCoverUrl}
                          alt={audiobook.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`h-full w-full flex items-center justify-center ${normalizedCoverUrl ? 'hidden' : ''}`}>
                        <Play className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {audiobook.title}
                      </div>
                      {audiobook.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {audiobook.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">
                    {audiobook.author.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {audiobook.categories.length > 0 ? (
                      audiobook.categories.slice(0, 2).map((cat) => (
                        <Badge key={cat.category.id} variant="outline" className="text-xs">
                          {cat.category.title}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic">
                        No categories
                      </span>
                    )}
                    {audiobook.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{audiobook.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    {formatDuration(audiobook.totalTime)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{audiobook._count.favorites} users liked</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{audiobook.viewCount} vues</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{audiobook.viewCount} Played</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={audiobook.isPublished ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {audiobook.isPublished ? "Published" : "Unpublished"}
                  </Badge>

                  {/* Render the toggle button only while unpublished */}
                  {!audiobook.isPublished && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleTogglePublish(audiobook.id)}
                      disabled={togglingIds.has(audiobook.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(audiobook.createdAt), "MMM dd, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <EditAction href={`/admin/audiobooks/${audiobook.id}/edit`} />
                    <DeleteDialog
                      title="Delete Audiobook"
                      itemName={audiobook.title}
                      description={
                        audiobook._count.listeningProgress > 0 || audiobook._count.bookmarks > 0
                          ? `This audiobook has ${audiobook._count.listeningProgress} listeners and ${audiobook._count.bookmarks} bookmarks. Deleting it will remove all associated data. Are you sure you want to continue?`
                          : undefined
                      }
                      onDelete={() => handleDelete(audiobook.id)}
                      disabled={deletingIds.has(audiobook.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}