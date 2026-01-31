"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function InvestorsPage() {
  /* ================= INVEST FORM STATE ================= */
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInterestSubmit = async () => {
    if (!company || !email) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      // 🔜 Firebase / backend save can be added later
      console.log("Investor Interest:", {
        company,
        email,
        message,
        createdAt: new Date(),
      });

      toast.success("Thanks! Our team will reach out 🤝");

      setCompany("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 pt-28 pb-32 font-body">
      <div className="max-w-5xl mx-auto">

        {/* ================= HERO ================= */}
        <section className="text-center mb-24">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6">
            Building the infrastructure for
            <br />
            smarter cost-sharing partnerships
          </h1>

          <p className="text-text-muted text-sm sm:text-lg max-w-3xl mx-auto mb-10">
            PartnerSync is a collaboration platform that enables individuals and
            businesses to reduce costs through structured, trusted partnerships
            across high-demand categories.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-primary">
              Talk to Founders
            </a>

            <a href="#deck" className="btn-outline">
              View Pitch Overview
            </a>
          </div>
        </section>

        {/* ================= PROBLEM / SOLUTION ================= */}
        <section className="mb-24 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl mb-4">
              The problem
            </h2>
            <p className="text-text-muted leading-relaxed">
              Millions of consumers and small businesses overpay for products,
              services, and subscriptions due to fragmented demand and lack of
              coordination. Existing marketplaces focus on selling more — not
              on helping users collaborate to pay less.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl sm:text-3xl mb-4">
              Our solution
            </h2>
            <p className="text-text-muted leading-relaxed">
              PartnerSync enables users to form verified partner groups based on
              intent, location, and timing — unlocking shared purchases, bundled
              deals, and cost-optimized access without becoming a traditional
              marketplace.
            </p>
          </div>
        </section>

        {/* ================= WHY PARTNERSYNC ================= */}
        <section className="mb-24">
          <h2 className="font-heading text-2xl sm:text-3xl mb-10 text-center">
            Why PartnerSync
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-dark-card bg-dark-section rounded-2xl p-6">
              <h3 className="font-heading mb-2">Demand-first model</h3>
              <p className="text-sm text-text-muted">
                We aggregate demand before transactions occur, improving
                pricing power and conversion efficiency.
              </p>
            </div>

            <div className="border border-dark-card bg-dark-section rounded-2xl p-6">
              <h3 className="font-heading mb-2">Category-agnostic</h3>
              <p className="text-sm text-text-muted">
                From fitness and travel to fashion and education, the platform
                scales horizontally across verticals.
              </p>
            </div>

            <div className="border border-dark-card bg-dark-section rounded-2xl p-6">
              <h3 className="font-heading mb-2">Asset-light & scalable</h3>
              <p className="text-sm text-text-muted">
                No inventory, no logistics — PartnerSync focuses on matching,
                coordination, and value capture.
              </p>
            </div>
          </div>
        </section>

        {/* ================= MARKET OPPORTUNITY ================= */}
        <section className="mb-24">
          <h2 className="font-heading text-2xl sm:text-3xl mb-6">
            Market opportunity
          </h2>

          <p className="text-text-muted max-w-4xl leading-relaxed">
            PartnerSync operates at the intersection of consumer savings,
            shared-economy behavior, and digital coordination.
          </p>
        </section>

        {/* ================= MONETIZATION ================= */}
        <section className="mb-24">
          <h2 className="font-heading text-2xl sm:text-3xl mb-6">
            How we make money
          </h2>

          <ul className="list-disc list-inside text-text-muted space-y-3">
            <li>Commission on successfully formed partner groups</li>
            <li>Platform fees from premium or priority matching</li>
            <li>Enterprise and brand partnership integrations</li>
            <li>Future SaaS tools for demand aggregation</li>
          </ul>
        </section>

        {/* ================= CTA ================= */}
        <section id="contact" className="text-center mb-24">
          <h2 className="font-heading text-2xl sm:text-3xl mb-4">
            Let’s build this together
          </h2>

          <p className="text-text-muted mb-8 max-w-2xl mx-auto">
            We’re partnering with early investors who believe in demand-side
            innovation and scalable collaboration platforms.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Contact Founders
            </Link>

            <a id="deck" href="#" className="btn-outline">
              Request Pitch Deck
            </a>
          </div>
        </section>

        {/* ================= INVESTOR INTEREST BOX (ADDED) ================= */}
        <section className="mb-24">
          <div className="card-glass p-8 max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl mb-2">
              Ready to Invest or Partner?
            </h2>
            <p className="text-text-muted mb-6">
              Share your details and our founding team will get in touch.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Company / Investor Name *"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input w-full"
              />

              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
              />

              <textarea
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input w-full min-h-[120px]"
              />

              <button
                onClick={handleInterestSubmit}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Submitting..." : "I’m Ready to Invest"}
              </button>
            </div>

            <p className="text-xs text-text-muted text-center mt-4">
              🔒 Confidential · No spam · Founder-reviewed
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
