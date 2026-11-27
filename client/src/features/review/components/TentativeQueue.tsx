import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusChip } from "../../../design-system/components";

export function TentativeQueue({ records }) {
  const [districtFilter, setDistrictFilter] = useState("");
  const [query, setQuery] = useState("");

  const districts = useMemo(() => {
    const set = new Set(records.map((r) => r.location).filter(Boolean));
    return Array.from(set).sort();
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (districtFilter && r.location !== districtFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${r.pcNumber} ${r.name} ${r.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, districtFilter, query]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-district" className="text-sm font-medium text-ink-primary">
            Filter by district
          </label>
          <select
            id="filter-district"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="min-h-comfortable rounded-md border border-line-strong bg-surface-base px-3 py-2 text-base text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <option value="">All districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-query" className="text-sm font-medium text-ink-primary">
            Search name, PC, or phone
          </label>
          <input
            id="filter-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-comfortable rounded-md border border-line-strong bg-surface-base px-3 py-2 text-base text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-secondary text-center py-6">No records match your filters.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line-subtle">
          <table className="min-w-full text-sm">
            <caption className="sr-only">
              Tentative membership records awaiting reviewer decision
            </caption>
            <thead className="bg-surface-raised">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-semibold text-ink-primary">PC Number</th>
                <th scope="col" className="px-3 py-2 text-left font-semibold text-ink-primary">Name</th>
                <th scope="col" className="px-3 py-2 text-left font-semibold text-ink-primary">District</th>
                <th scope="col" className="px-3 py-2 text-left font-semibold text-ink-primary">Submitted</th>
                <th scope="col" className="px-3 py-2 text-left font-semibold text-ink-primary">Assisted by</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-line-subtle">
                  <td className="px-3 py-2 font-mono">
                    <Link to={`/review/${r.id}`} className="underline text-ink-primary">
                      {r.pcNumber}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.location}</td>
                  <td className="px-3 py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{r.assistedBy || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
