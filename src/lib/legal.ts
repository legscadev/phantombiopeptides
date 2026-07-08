export interface LegalDoc {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const UPDATED = "July 2026";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    slug: "terms",
    title: "Terms of service",
    eyebrow: "Legal",
    description: `Last updated ${UPDATED}. By using this site or purchasing our products you agree to these terms.`,
    sections: [
      {
        heading: "1. Products offered",
        body: [
          "All products sold by Phantom Bio Peptides are supplied strictly for in-vitro laboratory research and analytical use.",
          "They are not intended for human consumption, therapeutic use, diagnostic applications, or veterinary use.",
        ],
      },
      {
        heading: "2. Eligibility",
        body: [
          "You must be at least 21 years of age and legally permitted to receive research chemicals in your jurisdiction to purchase from us.",
        ],
      },
      {
        heading: "3. Order acceptance",
        body: [
          "We reserve the right to cancel any order at our discretion, including for suspected misuse, incomplete information, or shipment to restricted destinations.",
        ],
      },
      {
        heading: "4. Limitation of liability",
        body: [
          "You accept full responsibility for the safe handling, storage, and lawful use of all products purchased.",
          "Phantom Bio Peptides is not liable for damages arising from misuse, off-label use, or violation of applicable law.",
        ],
      },
      {
        heading: "5. Governing law",
        body: [
          "These terms are governed by the laws of the United States and the state of registered business operations, without regard to conflict-of-law principles.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy policy",
    eyebrow: "Legal",
    description: `Last updated ${UPDATED}. How we collect, use, and protect your information.`,
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect the information you provide when creating an account or placing an order: name, email, shipping address, phone number, and payment information (processed and stored by Stripe — never on our servers).",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To fulfill orders, provide customer support, send transactional emails (order confirmations, shipping updates), and — with your explicit consent — send marketing communications.",
          "We never sell or rent customer data to third parties.",
        ],
      },
      {
        heading: "Payment information",
        body: [
          "Card details are collected directly by Stripe using PCI-compliant fields. Phantom Bio Peptides does not see or store your card number.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You may request a copy of your data or ask us to delete it by writing to support@phantombiopeptides.com.",
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping policy",
    eyebrow: "Fulfillment",
    description: `Last updated ${UPDATED}. Order dispatch, carriers, and delivery windows.`,
    sections: [
      {
        heading: "Dispatch times",
        body: [
          "Orders placed before 2pm ET on business days are dispatched the same day. Orders placed after 2pm ship the next business day.",
        ],
      },
      {
        heading: "Carriers",
        body: [
          "Domestic orders ship via USPS Priority or UPS Ground. Overnight and 2-day options are available at checkout.",
        ],
      },
      {
        heading: "Free shipping",
        body: [
          "Orders over $125 ship free within the United States.",
        ],
      },
      {
        heading: "International",
        body: [
          "We ship to most countries where receipt of research chemicals is legally permitted. Customs duties and delays are the recipient's responsibility.",
        ],
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Returns & refunds",
    eyebrow: "Support",
    description: `Last updated ${UPDATED}. Damaged, defective, or lost orders.`,
    sections: [
      {
        heading: "Damaged or defective product",
        body: [
          "Because these are research chemicals, opened products cannot be returned. However, we replace any product that arrives damaged, defective, or fails to meet its published purity spec — free of charge.",
        ],
      },
      {
        heading: "How to file a claim",
        body: [
          "Email support@phantombiopeptides.com within 7 days of delivery with your order number and photos of the damaged product or packaging. We respond within one business day.",
        ],
      },
      {
        heading: "Lost shipments",
        body: [
          "If your tracking shows delivered but the package hasn't arrived, contact us within 5 days. We investigate with the carrier and reship at our cost if the shipment cannot be recovered.",
        ],
      },
    ],
  },
  "research-use": {
    slug: "research-use",
    title: "Research use policy",
    eyebrow: "Compliance",
    description: `Last updated ${UPDATED}. Read this before ordering.`,
    sections: [
      {
        heading: "Strict research use",
        body: [
          "All products sold by Phantom Bio Peptides are supplied strictly for in-vitro laboratory research and analytical use.",
          "They are not intended for human consumption, therapeutic use, diagnostic applications, or veterinary use.",
        ],
      },
      {
        heading: "Buyer responsibility",
        body: [
          "By placing an order, you certify that you are a qualified researcher and that you will handle, store, and use these compounds in accordance with all applicable federal, state, and local laws in your jurisdiction.",
        ],
      },
      {
        heading: "FDA disclosure",
        body: [
          "The statements on this website have not been evaluated by the Food and Drug Administration. Our products are not intended to diagnose, treat, cure, or prevent any disease.",
        ],
      },
    ],
  },
  quality: {
    slug: "quality",
    title: "Quality & testing",
    eyebrow: "Standards",
    description: `Last updated ${UPDATED}. How we source, test, and verify every batch.`,
    sections: [
      {
        heading: "Synthesis",
        body: [
          "Solid-phase peptide synthesis at ISO-9001 certified facilities using USP-grade solvents and excipients.",
        ],
      },
      {
        heading: "Purification & purity",
        body: [
          "Reverse-phase HPLC purification. Minimum 99% purity target on every batch, verified by an independent third-party lab (ISL Labs).",
        ],
      },
      {
        heading: "Documentation",
        body: [
          "Every lot ships with a Certificate of Analysis from an independent third-party lab.",
        ],
      },
      {
        heading: "Fulfillment",
        body: [
          "Vacuum-sealed vials, temperature-monitored packaging with gel-pack cooling on all shipments.",
        ],
      },
    ],
  },
};
