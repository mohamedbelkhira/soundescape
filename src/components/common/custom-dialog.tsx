"use client";
import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
export const dynamic = "force-dynamic";
type CustomDialogProps = {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CustomDialog({
  trigger,
  title,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: CustomDialogProps) {
  const isControlled = controlledIsOpen !== undefined;

  const isMobile = useIsMobile();
  const width = typeof window !== "undefined" ? window.innerWidth - 2 * 16 : 0;
  return (
    <Dialog
      open={isControlled ? controlledIsOpen : undefined}
      onOpenChange={controlledOnOpenChange}
    >
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent style={isMobile ? { width: width } : { minWidth: 500 }}>
        <DialogHeader className="px-6 py-4 bg-muted text-foreground">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-5 text-foreground">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
