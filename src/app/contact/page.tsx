import { Mail, MessageCircle, Building } from "lucide-react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ContactForm } from "./contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the Phantom Labs research team.",
  path: "/contact",
});

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "research@phantomlabs.co",
    href: "mailto:research@phantomlabs.co",
  },
  {
    icon: MessageCircle,
    label: "Support hours",
    value: "Mon – Fri · 9am – 6pm ET",
  },
  {
    icon: Building,
    label: "Institutional",
    value: "For bulk & institutional orders",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="mt-8 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Get in touch.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Our research team responds within one business day. For bulk
            institutional orders or protocol support, include your affiliation
            and lot requirements.
          </p>

          <ul className="mt-10 space-y-5">
            {CHANNELS.map((c) => (
              <li key={c.label} className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </div>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="mt-1 block text-base font-medium hover:text-primary"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <div className="mt-1 text-base font-medium">{c.value}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
