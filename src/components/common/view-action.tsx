"use client";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewAction({ href }: { href?: string }) {
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
      <Eye className="text-primary" />
    </Button>
  );
}
