"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateCustomerAction } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const addressSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});
type AddressValues = z.infer<typeof addressSchema>;

interface Props {
  kind: "billing" | "shipping";
  defaults?: Partial<AddressValues>;
  includeEmailPhone?: boolean;
}

export function AddressForm({ kind, defaults, includeEmailPhone }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: defaults?.first_name ?? "",
      last_name: defaults?.last_name ?? "",
      company: defaults?.company ?? "",
      address_1: defaults?.address_1 ?? "",
      address_2: defaults?.address_2 ?? "",
      city: defaults?.city ?? "",
      state: defaults?.state ?? "",
      postcode: defaults?.postcode ?? "",
      country: defaults?.country ?? "",
      email: defaults?.email ?? "",
      phone: defaults?.phone ?? "",
    },
  });

  async function onSubmit(values: AddressValues) {
    const address: Record<string, string> = {
      first_name: values.first_name ?? "",
      last_name: values.last_name ?? "",
      company: values.company ?? "",
      address_1: values.address_1 ?? "",
      address_2: values.address_2 ?? "",
      city: values.city ?? "",
      state: values.state ?? "",
      postcode: values.postcode ?? "",
      country: (values.country ?? "").toUpperCase(),
    };
    if (includeEmailPhone) {
      address.email = values.email ?? "";
      address.phone = values.phone ?? "";
    }
    const res = await updateCustomerAction(
      kind === "billing"
        ? { billing: address as never }
        : { shipping: address as never },
    );
    if (res.ok) toast.success(`${kind === "billing" ? "Billing" : "Shipping"} address saved.`);
    else toast.error(res.error ?? "Could not save.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={`${kind}_first_name`} label="First name" reg={register("first_name")} />
        <Field id={`${kind}_last_name`} label="Last name" reg={register("last_name")} />
        <Field
          id={`${kind}_company`}
          label="Company (optional)"
          reg={register("company")}
          span
        />
        <Field
          id={`${kind}_address_1`}
          label="Street address"
          reg={register("address_1")}
          span
        />
        <Field
          id={`${kind}_address_2`}
          label="Apt / suite (optional)"
          reg={register("address_2")}
          span
        />
        <Field id={`${kind}_city`} label="City" reg={register("city")} />
        <Field id={`${kind}_state`} label="State / province" reg={register("state")} />
        <Field id={`${kind}_postcode`} label="ZIP / postcode" reg={register("postcode")} />
        <Field
          id={`${kind}_country`}
          label="Country (2-letter)"
          reg={register("country")}
        />
        {includeEmailPhone && (
          <>
            <Field
              id={`${kind}_email`}
              label="Email"
              type="email"
              reg={register("email")}
            />
            <Field
              id={`${kind}_phone`}
              label="Phone"
              type="tel"
              reg={register("phone")}
            />
          </>
        )}
      </div>
      <Button className="mt-6" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
      </Button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  span?: boolean;
  reg: ReturnType<ReturnType<typeof useForm<AddressValues>>["register"]>;
}

function Field({ id, label, type = "text", span, reg }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${span ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...reg} />
    </div>
  );
}
