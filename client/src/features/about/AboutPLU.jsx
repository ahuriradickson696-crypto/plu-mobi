import { Link } from "react-router-dom";

const VALUES = [
  "Patriotism",
  "National Unity",
  "Discipline",
  "Service to the Nation",
  "Integrity and Accountability",
  "Socio-Economic Transformation",
  "Youth Empowerment",
  "Sovereignty and Self-Reliance",
  "Constitutionalism and Rule of Law",
  "Community Mobilization",
];

const DISTRICTS = [
  { name: "Kampala", count: 8458 },
  { name: "Mitooma", count: 7049 },
  { name: "Wakiso", count: 5639 },
  { name: "Lwengo", count: 4889 },
  { name: "Tororo", count: 4658 },
  { name: "Gulu", count: 2809 },
];

// LEADERSHIP: Do not populate this array with names from news articles.
// Only fill it in after written confirmation from PLU.
// Example (do not use until confirmed):
//   { role: "Secretary General", name: "[confirmed by PLU on YYYY-MM-DD]" }
const LEADERSHIP = [
  { role: "Chairman", name: "Gen. Muhoozi Kainerugaba", img: "MK.jpg" },
  { role: "National Vice Chairman", name: "Michael Nuwagira", img: "MN.jpg" },
  { role: "General Secretary", name: "Hon. Fadil Twalla", img: "FT.jpg" },
  { role: "Regional Vice Chairperson, Western", name: "Hon. Balaam Barugahara Ateenyi", img: "BB.jpg" },
  { role: "Regional Vice Chairperson, Buganda", name: "Hon. Kiryowa Kiwanuka", img: "KK.jpg" },
  { role: "Central Committee", name: "Hon. Lillian Aber", img: "LA.jpg" },
  { role: "Central Committee", name: "Andrew Mwenda", img: "AM.jpg" },
  { role: "Director of Legal Affairs", name: "Edwin Karugire", img: "EK.jpg" },
  { role: "Director of Mobilisation", name: "Hon. Michael Mawanda", img: "MM.jpg" },
  { role: "Central Committee", name: "Owek. Henry Basaliza", img: "HB.jpg" },
  { role: "Central Committee", name: "Rt. Hon. Jacob Oboth-Oboth", img: "JO.jpg" },
  { role: "Central Committee", name: "Thomas Tayebwa", img: "TT.jpg" },
  { role: "Central Committee", name: "Dr. Jane Ruth Aceng", img: "JR.jpg" },
  { role: "Central Committee", name: "Hon. Sanjay Tanna", img: "ST.jpg" },
  { role: "Central Committee", name: "Hussein Kashillingi", img: "HK.jpg" },
];

export default function AboutPLU() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-secondary">
          About
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-primary mt-1">
          Patriotic League of Uganda
        </h1>
        <p className="text-sm text-ink-secondary mt-2">
          A civic movement mobilizing Ugandans to fulfil their civic duties.
        </p>
      </header>

      <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Vision</h2>
        <p className="text-sm text-ink-secondary">
          A united, patriotic, disciplined, prosperous, self-reliant, and sovereign Uganda.
        </p>
      </section>

      <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Mission</h2>
        <p className="text-sm text-ink-secondary">
          To mobilize Ugandans to fulfil their civic duties and participate actively in national development.
        </p>
      </section>

      <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Core Values</h2>
        <ol className="list-decimal list-inside text-sm text-ink-secondary space-y-1">
          {VALUES.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">History</h2>
        <p className="text-sm text-ink-secondary">
          The Patriotic League of Uganda was rebranded from the MK Movement in 2024 and has since expanded its public engagement across the country.
        </p>
      </section>

      <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Leadership</h2>
        {LEADERSHIP.length === 0 ? (
          <p className="text-sm text-ink-secondary" role="status">
            Leadership information is pending official confirmation from the PLU Secretariat.
          </p>
        ) : (
          <ul className="text-sm text-ink-secondary space-y-1">
            {LEADERSHIP.map((l) => (
              <li key={l.name} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0">
                <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 shadow-md border border-gray-200 bg-gray-200">
                  {l.img ? (
                    <img src={`/leaders/${l.img}`} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                      {l.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-ink-primary">{l.name}</div>
                  <div className="text-sm text-gray-600">{l.role}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

            <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Official Motto</h2>
        <p className="text-sm text-ink-secondary italic">
          "One God, One People, One Army!"
        </p>
      </section>
<section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Contact</h2>
        <p className="text-sm text-ink-secondary">
          Plot 07, Saddler Lane, Naguru, Kampala<br />
          Tel: 0414675689
        </p>
      </section>

      <section className="rounded-card border border-line-subtle bg-surface-raised p-5 space-y-2">
        <h2 className="text-lg font-semibold text-ink-primary">Official PLU Figures</h2>
        <p className="text-sm text-ink-secondary">
          PLU reports <strong>96,207 registered Patriotic Cadres</strong> nationwide.
        </p>
        <p className="text-xs text-ink-secondary">
          Source: plu.org.ug (accessed 26 November 2026). This is PLU's published cumulative figure, not a live count from this app.
        </p>
        <a
          href="https://plu.org.ug"
          className="text-sm underline text-ink-primary inline-block mt-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          View official PLU website
        </a>
      </section>

      <section className="rounded-card border border-line-subtle bg-surface-base p-5 space-y-3">
        <h2 className="text-lg font-semibold text-ink-primary">Membership by District</h2>
        <table className="w-full text-sm">
          <caption className="sr-only">Top districts by registered member count</caption>
          <thead>
            <tr className="border-b border-line-subtle">
              <th scope="col" className="text-left py-2 font-semibold text-ink-primary">District</th>
              <th scope="col" className="text-right py-2 font-semibold text-ink-primary">Members</th>
            </tr>
          </thead>
          <tbody>
            {DISTRICTS.map((d) => (
              <tr key={d.name} className="border-b border-line-subtle last:border-0">
                <td className="py-2 text-ink-secondary">{d.name}</td>
                <td className="py-2 text-right text-ink-primary font-mono">{d.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink-secondary">
          Source: plu.org.ug (accessed 26 November 2026).
        </p>
      </section>

      <nav aria-label="About page navigation" className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center justify-center min-h-comfortable bg-plu-yellow text-plu-black font-semibold rounded-md px-4 py-2 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Home
        </Link>
      </nav>
    </main>
  );
}