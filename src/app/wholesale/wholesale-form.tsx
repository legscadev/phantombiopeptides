"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().min(2, "Institution required"),
  role: z.string().optional(),
  monthly_volume: z.string().min(1, "Estimated volume required"),
  interests: z.string().min(5, "Which compounds?"),
});
type Values = z.infer<typeof schema>;

export function WholesaleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    await new Promise((r) => setTimeout(r, 700));
    toast.success(
      "Received — our institutional team will reach out within one business day.",
    );
    reset();
    void values;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          id="name"
          error={errors.name?.message}
          register={register("name")}
        />
        <Field
          label="Work email"
          id="email"
          type="email"
          error={errors.email?.message}
          register={register("email")}
        />
      </div>
      <Field
        label="Institution / company"
        id="organization"
        error={errors.organization?.message}
        register={register("organization")}
      />
      <Field
        label="Role (optional)"
        id="role"
        register={register("role")}
      />
      <Field
        label="Estimated monthly volume"
        id="monthly_volume"
        placeholder="e.g. 20 vials / month"
        error={errors.monthly_volume?.message}
        register={register("monthly_volume")}
      />
      <div className="space-y-1.5">
        <Label htmlFor="interests">Compounds of interest</Label>
        <textarea
          id="interests"
          rows={4}
          {...register("interests")}
          placeholder="Which peptides, doses, and study timelines?"
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring"
        />
        {errors.interests && (
          <p className="text-xs text-destructive">
            {errors.interests.message}
          </p>
        )}
      </div>
      <Button size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Request pricing <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: ReturnType<
    ReturnType<typeof useForm<Values>>["register"]
  >;
}

function Field({ label, id, type = "text", placeholder, error, register }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
