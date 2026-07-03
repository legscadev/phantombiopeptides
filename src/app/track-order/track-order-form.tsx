"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  order_number: z.string().min(3, "Order number required"),
  email: z.string().email("Valid email required"),
});
type Values = z.infer<typeof schema>;

interface OrderStatus {
  status: string;
  date_created?: string;
  total?: string;
  tracking_number?: string;
  tracking_url?: string;
}

export function TrackOrderForm() {
  const [status, setStatus] = React.useState<OrderStatus | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    const res = await fetch(
      `/api/track-order?order=${encodeURIComponent(values.order_number)}&email=${encodeURIComponent(values.email)}`,
    );
    if (!res.ok) {
      toast.error("We couldn't find an order matching those details.");
      setStatus(null);
      return;
    }
    const data = (await res.json()) as OrderStatus;
    setStatus(data);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="order_number">Order number</Label>
          <Input
            id="order_number"
            placeholder="e.g. 1027"
            {...register("order_number")}
          />
          {errors.order_number && (
            <p className="text-xs text-destructive">
              {errors.order_number.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Track order <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {status && (
        <div className="space-y-3 rounded-2xl border border-border bg-background-elevated p-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Status
            </span>
            <span className="text-sm font-medium text-foreground capitalize">
              {status.status.replace(/-/g, " ")}
            </span>
          </div>
          {status.date_created && (
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Placed
              </span>
              <span className="text-sm text-foreground">
                {new Date(status.date_created).toLocaleDateString()}
              </span>
            </div>
          )}
          {status.total && (
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="text-sm text-foreground">${status.total}</span>
            </div>
          )}
          {status.tracking_url ? (
            <a
              href={status.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View carrier tracking →
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">
              Tracking number will appear here once your order ships.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
