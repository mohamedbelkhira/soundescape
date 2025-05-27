"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteAction({ href }: { href?: string }) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      onClick={href ? handleClick : undefined}
    >
      <Trash2 className="text-destructive" />
    </Button>
  );
}
