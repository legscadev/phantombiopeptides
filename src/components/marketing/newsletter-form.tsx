"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type Values = z.infer<typeof schema>;

interface Props {
  variant?: "footer" | "hero" | "inline";
}

export function NewsletterForm({ variant = "footer" }: Props) {
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    // Placeholder — wire up to a mailing provider or Woo subscribers endpoint.
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
    toast.success("You're on the list.");
    reset();
    setTimeout(() => setSubmitted(false), 4000);
    void values;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-input p-1",
        variant === "hero" && "max-w-lg",
      )}
      aria-label="Subscribe to newsletter"
    >
      <input
        type="email"
        placeholder="Enter your email"
        aria-label="Email address"
        aria-invalid={!!errors.email}
        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
        {...register("email")}
      />
      <button
        type="submit"
        disabled={isSubmitting || submitted}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-full bg-gradient-to-b from-primary to-[hsl(258_90%_56%)] px-4 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all",
          "hover:brightness-110 disabled:opacity-70",
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : submitted ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <>
            Subscribe <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
