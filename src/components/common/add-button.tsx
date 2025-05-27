"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function AddButton({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Button
      type="button"
      size={isMobile ? "icon" : "default"}
      className="flex items-center gap-2"
      onClick={href ? handleClick : undefined}
    >
      <Plus className="h-4 w-4" />
      <span className="hidden md:block">{label}</span>
    </Button>
  );
}
