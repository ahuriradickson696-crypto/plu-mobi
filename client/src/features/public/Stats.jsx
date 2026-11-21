import { useEffect, useState } from "react";
import api from "../../api/client";

export default function Stats() {
  const [stats, setStats] = useState({ members: 0, endorsements: 0, districts: 0, corruptions: 0 });

  useEffect(() => {
    api.get("/members/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <Cell label="Members" value={stats.members} tone="black" />
      <Cell label="Endorsements" value={stats.endorsements} tone="yellow" />
      <Cell label="Districts" value={stats.districts} tone="black" />
      <Cell label="Reports" value={stats.corruptions} tone="red" />
    </section>
  );
}

function Cell({ label, value, tone }) {
  const tones = {
    black: "text-plu-black",
    yellow: "text-plu-black",
    red: "text-plu-red",
  };
  const bg = tone === "yellow" ? "bg-plu-yellow" : "bg-white";
  return (
    <div className={`${bg} rounded-2xl p-4 md:p-5 shadow-md border border-black/5 text-center`}>
      <p className={`text-3xl md:text-4xl font-extrabold ${tones[tone]}`}>{value}</p>
      <p className="text-xs md:text-sm text-plu-slate mt-1 font-semibold uppercase tracking-wide">{label}</p>
    </div>
  );
}
