"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  organization: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(20, "Please provide a bit more detail"),
});
type Values = z.infer<typeof schema>;

const inputStyles = cn(
  "flex w-full rounded-2xl border border-border/70 bg-white/70 px-4 py-3 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:border-[color:hsl(var(--brand-500))]/50 focus:outline-none focus:ring-4 focus:ring-[color:hsl(var(--brand-500))]/12",
  "transition-colors",
);

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    // Wire to a mail provider or Woo custom endpoint. Placeholder for now.
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Message received. We'll reply within one business day.");
    reset();
    void values;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <input id="name" className={inputStyles} {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            className={inputStyles}
            {...register("email")}
          />
        </Field>
      </div>
      <Field
        label="Institution / company"
        htmlFor="organization"
        hint="Optional — include if you're asking about institutional pricing."
      >
        <input
          id="organization"
          className={inputStyles}
          {...register("organization")}
        />
      </Field>
      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <input
          id="subject"
          className={inputStyles}
          {...register("subject")}
        />
      </Field>
      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={6}
          className={inputStyles}
          {...register("message")}
        />
      </Field>
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground">
          By sending, you agree to our{" "}
          <a
            href="/privacy"
            className="text-[color:hsl(var(--brand-500))] hover:underline"
          >
            privacy policy
          </a>
          .
        </p>
        <Button size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Send message <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
