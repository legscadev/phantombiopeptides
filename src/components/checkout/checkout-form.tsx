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
import { submitCheckoutAction } from "@/app/actions/checkout";
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

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: amountMinor > 0 ? amountMinor : 100,
    currency,
    paymentMethodCreation: "manual",
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "hsl(178 78% 52%)",
        colorBackground: "hsl(224 40% 7%)",
        colorText: "hsl(210 40% 98%)",
        colorDanger: "hsl(0 85% 60%)",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
        borderRadius: "12px",
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
    defaultValues: {
      country: "US",
    },
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
      // Validate the Payment Element (card, wallets, etc.).
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Please check the payment details.");
        return;
      }

      // Create a PaymentMethod from the collected details.
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          elements,
          params: {
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
                country: values.country,
              },
            },
          },
        });
      if (pmError || !paymentMethod) {
        setError(pmError?.message ?? "Card details could not be processed.");
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

      const result = await submitCheckoutAction({
        billing_address: address,
        shipping_address: address,
        customer_note: values.customer_note ?? "",
        stripe_payment_method_id: paymentMethod.id,
      });

      if (!result.ok) {
        setError(result.error ?? "Checkout failed. Please try again.");
        return;
      }

      // Handle 3-D Secure (SCA).
      if (result.requires_action_client_secret) {
        const { error: actionError, paymentIntent } =
          await stripe.handleNextAction({
            clientSecret: result.requires_action_client_secret,
          });
        if (actionError) {
          setError(actionError.message ?? "Authentication failed.");
          return;
        }
        if (paymentIntent?.status !== "succeeded") {
          setError(
            "Payment was not completed. Please try again or use a different card.",
          );
          return;
        }
      } else if (result.redirect_url) {
        window.location.assign(result.redirect_url);
        return;
      }

      const orderId = result.order?.order_id;
      const orderKey = result.order?.order_key;
      toast.success("Payment approved — thank you.");
      router.push(
        `/thank-you?order=${orderId ?? ""}${orderKey ? `&key=${orderKey}` : ""}`,
      );
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
            Cards, Apple Pay, and Google Pay are supported. Your details are
            processed by Stripe — we never see the card number.
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
          {parseFloat(cart.totals.total_discount) > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>
                -{formatPrice(cart.totals.total_discount, currency)}
              </span>
            </div>
          )}
          {parseFloat(cart.totals.total_shipping ?? "0") > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{formatPrice(cart.totals.total_shipping!, currency)}</span>
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
          Secure headless checkout · Stripe · SSL
        </p>
      </aside>
    </form>
  );
}
