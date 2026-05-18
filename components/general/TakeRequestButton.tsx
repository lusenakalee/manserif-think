"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TakeRequestButtonProps {
  productId: string;
  name: string;
  price?: number;
  image?: string;
  slug?: string;
  className?: string;
}

type Status = "idle" | "loading" | "sent";

export function TakeRequestButton({
  productId,
  name,
  price,
  image,
  slug,
  className,
}: TakeRequestButtonProps) {
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>("idle");

  const isAuthLoading = !isLoaded;

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!isAuthLoading && !isSignedIn) {
    return (
      <Button
        variant="outline"
        className={cn("h-11 w-full", className)}
        onClick={() => openSignIn({ afterSignInUrl: window.location.href })}
      >
        <Mail className="mr-2 h-4 w-4" />
        Sign in to Request Quote
      </Button>
    );
  }

  // ── Request already sent ───────────────────────────────────────────────────
  if (status === "sent") {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn("h-11 w-full", className)}
      >
        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
        Quote Requested
      </Button>
    );
  }

  // ── Send request ──────────────────────────────────────────────────────────
  const handleRequest = async () => {
    if (status === "loading") return;
    setStatus("loading");

    try {
      const token = await getToken();
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, name, price, image, slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Something went wrong");
      }

      setStatus("sent");
      toast.success("Quote request sent! Check your email for confirmation.");
    } catch (err: unknown) {
      setStatus("idle");
      const message =
        err instanceof Error ? err.message : "Failed to send request";
      toast.error(message);
    }
  };

  return (
    <Button
      onClick={handleRequest}
      disabled={isAuthLoading || status === "loading"}
      variant="outline"
      className={cn("h-11 w-full", className)}
    >
      {status === "loading" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          <Mail className="mr-2 h-4 w-4" />
          Request a Quote
        </>
      )}
    </Button>
  );
}