"use client";

import Image from "next/image";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-black/60 px-6 py-24 text-white">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <section className="text-center mb-28">
          <h1 className="text-3xl sm:text-4xl mb-4 font-semibold">
            The People Building{" "}
            <span style={{ color: "#D4AF37" }}>PartnerSync</span>
          </h1>

          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            A focused team driven by purpose, execution, and the belief that
            collaboration can unlock real-world value at scale.
          </p>
        </section>

        {/* FOUNDER */}
        <section className="flex flex-col md:flex-row items-center gap-14 mb-36">

          <div className="w-52 h-52 rounded-full overflow-hidden border-2 border-yellow-500 shadow-[0_0_40px_rgba(255,215,0,0.4)]">
            <Image
              src="/placeholder-founder.jpg"
              alt="Founder"
              width={220}
              height={220}
              className="object-cover"
            />
          </div>

          <div className="max-w-xl text-center md:text-left">
            <p className="uppercase tracking-widest text-xs text-gray-400 mb-3">
              Founder
            </p>

            <h2 className="text-2xl mb-1 font-semibold">
              Satyamanoj Biyyapu
            </h2>

            <p className="text-yellow-500 mb-6">
              Founder & Chief Executive Officer
            </p>

            <p className="text-sm leading-relaxed mb-6 text-gray-300">
              Satyamanoj is building PartnerSync with a long-term vision to
              redefine how people collaborate through structured partnerships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
              <a
                href="mailto:syncpartnerduo@gmail.com"
                className="px-6 py-2 rounded-full bg-yellow-500
                           text-black font-medium
                           hover:bg-yellow-400 transition"
              >
                Contact Founder
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-yellow-500 transition"
              >
                LinkedIn Profile →
              </a>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section>
          <h3 className="text-2xl text-center mb-16 font-semibold">
            Core <span className="text-yellow-500">Contributors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

            {[
              {
                name: "Bollu Aditya",
                role: "Chief Technology Officer",
              },
              {
                name: "Jeethukumar",
                role: "Product Architect",
              },
              {
                name: "Abhi Gokavarapu",
                role: "Head of Growth & Strategy",
              },
              {
                name: "Jyothi Suggula",
                role: "Operations Lead",
              },
              {
                name: "Bobba Jaswanth",
                role: "Platform Engineer",
              },
              {
                name: "Dasari Srikar",
                role: "Data Intelligence Lead",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="group relative rounded-2xl p-8
                           bg-black/50 border border-gray-700
                           hover:border-yellow-500
                           transition-all duration-300
                           hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
              >
                <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border border-yellow-500/40">
                  <Image
                    src={`/team/${i + 1}.jpg`}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>

                <h4 className="text-lg text-center mb-2 font-semibold">
                  {member.name}
                </h4>

                <p className="text-gray-400 text-xs text-center mb-5">
                  {member.role}
                </p>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-yellow-500 transition"
                  >
                    LinkedIn Profile →
                  </a>
                </div>

                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl
                             opacity-0 group-hover:opacity-100
                             shadow-[0_0_50px_rgba(255,215,0,0.25)]
                             transition"
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}