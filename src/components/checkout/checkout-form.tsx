"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock, ArrowRight, AlertTriangle } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import {
  startCheckoutAction,
  finalizeCheckoutAction,
} from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { WCCart, WCAddress } from "@/types";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  company: z.string().optional(),
  address_1: z.string().min(1, "Required"),
  address_2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postcode: z.string().min(3, "Required"),
  country: z.string().min(2).max(2, "Use a 2-letter country code"),
  phone: z.string().optional(),
  customer_note: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function CheckoutForm({ cart }: { cart: WCCart }) {
  const stripePromise = React.useMemo(() => getStripe(), []);
  const currency = cart.totals.currency_code.toLowerCase();
  const amountMinor = Math.round(
    parseFloat(cart.totals.total_price) *
      10 ** (cart.totals.currency_minor_unit ?? 2),
  );

  // "Deferred" Elements mode — we haven't created a PaymentIntent yet
  // (that happens on submit), so we pass amount + currency here and
  // Stripe uses them to decide which methods to show (Card, Apple Pay,
  // Google Pay, Link, etc.).
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: amountMinor > 0 ? amountMinor : 100,
    currency,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "hsl(264 100% 45%)",
        borderRadius: "12px",
        fontFamily:
          "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerCheckoutForm cart={cart} />
    </Elements>
  );
}

function InnerCheckoutForm({ cart }: { cart: WCCart }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { country: "US" },
  });

  const currency = cart.totals.currency_code;

  async function onSubmit(values: Values) {
    setError(null);

    if (!stripe || !elements) {
      setError("Payment provider is still loading. Try again in a moment.");
      return;
    }

    setSubmitting(true);
    try {
      // Have the Payment Element validate what the customer has typed.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Please check the payment details.");
        return;
      }

      const address: WCAddress = {
        first_name: values.first_name,
        last_name: values.last_name,
        company: values.company ?? "",
        address_1: values.address_1,
        address_2: values.address_2 ?? "",
        city: values.city,
        state: values.state,
        postcode: values.postcode,
        country: values.country.toUpperCase(),
        email: values.email,
        phone: values.phone ?? "",
      };

      // Server: create Woo order + Stripe PaymentIntent, return
      // client_secret.
      const start = await startCheckoutAction({
        billing_address: address,
        shipping_address: address,
        customer_note: values.customer_note ?? "",
      });
      if (!start.ok || !start.client_secret || !start.order_id) {
        setError(start.error ?? "Checkout could not be started.");
        return;
      }

      // Confirm the payment against Stripe. `redirect: "if_required"`
      // keeps the customer on our page unless the payment method (e.g.
      // some cards under 3-D Secure) mandates a bank-hosted step.
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          clientSecret: start.client_secret,
          confirmParams: {
            return_url: `${window.location.origin}/thank-you?order=${start.order_id}`,
            payment_method_data: {
              billing_details: {
                email: values.email,
                name: `${values.first_name} ${values.last_name}`.trim(),
                phone: values.phone || undefined,
                address: {
                  line1: values.address_1,
                  line2: values.address_2 || undefined,
                  city: values.city,
                  state: values.state,
                  postal_code: values.postcode,
                  country: values.country.toUpperCase(),
                },
              },
            },
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(
          confirmError.message ??
            "Payment was declined. Please try a different card.",
        );
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setError(
          `Payment was not completed (status: ${paymentIntent?.status ?? "unknown"}).`,
        );
        return;
      }

      // Flip the Woo order to processing + clear the cart.
      const finalize = await finalizeCheckoutAction(
        start.order_id,
        paymentIntent.id,
      );
      if (!finalize.ok) {
        // The payment succeeded but bookkeeping failed — don't lose the
        // customer. Log them through anyway; support can reconcile.
        toast.error(
          "Payment recorded but our system had a hiccup — support has been notified.",
        );
      } else {
        toast.success("Payment approved — thank you.");
      }

      router.push(`/thank-you?order=${start.order_id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <div className="space-y-6">
        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 text-xs uppercase tracking-widest text-muted-foreground">
            Contact
          </legend>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 text-xs uppercase tracking-widest text-muted-foreground">
            Shipping address
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" {...register("first_name")} />
              {errors.first_name && (
                <p className="text-xs text-destructive">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" {...register("last_name")} />
              {errors.last_name && (
                <p className="text-xs text-destructive">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="company">Institution / company (optional)</Label>
              <Input id="company" {...register("company")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address_1">Street address</Label>
              <Input id="address_1" {...register("address_1")} />
              {errors.address_1 && (
                <p className="text-xs text-destructive">
                  {errors.address_1.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address_2">Apt / suite (optional)</Label>
              <Input id="address_2" {...register("address_2")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State / province</Label>
              <Input id="state" {...register("state")} />
              {errors.state && (
                <p className="text-xs text-destructive">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postcode">ZIP / postcode</Label>
              <Input id="postcode" {...register("postcode")} />
              {errors.postcode && (
                <p className="text-xs text-destructive">
                  {errors.postcode.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country (2-letter)</Label>
              <Input
                id="country"
                maxLength={2}
                {...register("country")}
                placeholder="US"
              />
              {errors.country && (
                <p className="text-xs text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="flex items-center gap-2 px-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Lock className="h-3 w-3" />
            Payment
          </legend>
          <p className="mb-4 text-xs text-muted-foreground">
            Cards, Apple Pay, Google Pay and Link are supported. Details go
            straight to Stripe — we never see your card number.
          </p>
          <PaymentElement
            options={{
              layout: { type: "tabs", defaultCollapsed: false },
            }}
          />
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 text-xs uppercase tracking-widest text-muted-foreground">
            Order note (optional)
          </legend>
          <textarea
            {...register("customer_note")}
            rows={3}
            placeholder="Anything we should know about your order?"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring"
          />
        </fieldset>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Payment error</p>
              <p className="mt-1 text-foreground/90">{error}</p>
            </div>
          </div>
        )}
      </div>

      <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <div>
          <h2 className="text-lg font-semibold">Order summary</h2>
          <p className="text-xs text-muted-foreground">
            {cart.items_count} item{cart.items_count === 1 ? "" : "s"}
          </p>
        </div>
        <ul className="space-y-3 text-sm">
          {cart.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                {item.quantity} × {item.name}
              </span>
              <span>{formatPrice(item.totals.line_total, currency)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(cart.totals.total_items, currency)}</span>
          </div>
          {parseFloat(cart.totals.total_shipping ?? "0") > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {formatPrice(cart.totals.total_shipping!, currency)}
              </span>
            </div>
          )}
          {parseFloat(cart.totals.total_tax ?? "0") > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatPrice(cart.totals.total_tax!, currency)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span>{formatPrice(cart.totals.total_price, currency)}</span>
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || !stripe}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Pay {formatPrice(cart.totals.total_price, currency)}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          Secure checkout · Stripe · SSL
        </p>
      </aside>
    </form>
  );
}
