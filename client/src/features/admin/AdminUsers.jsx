import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../store/auth";
import { Button, Input, Alert, Spinner, EmptyState } from "../../ui";
import { notify } from "../../lib/notify";

export default function AdminUsers() {
  const nav = useNavigate();
  const { token, member } = useAuth();

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return nav("/login");
    if (!member?.isAdmin) { setError("Admin access required."); return; }
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/admin/users", {
        params: { q, role, page, limit: 20 },
      });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      setError(e.response?.data?.error || "Could not load users");
    } finally {
      setLoading(false);
    }
  }, [token, member, nav, q, role, page]);

  useEffect(() => { load(); }, [load]);

  async function toggleFlag(user, flag) {
    setBusyId(user.id);
    try {
      await api.patch(`/admin/users/${user.id}`, { [flag]: !user[flag] });
      notify("Updated", `${user.pcNumber} ${flag === "isAdmin" ? "admin" : "reviewer"} access ${!user[flag] ? "granted" : "removed"}.`);
      await load();
    } catch (e) {
      setError(e.response?.data?.error || "Could not update role");
    } finally {
      setBusyId(null);
    }
  }

  async function suspend(user) {
    const reason = window.prompt(`Reason for suspending ${user.name}?`) || null;
    setBusyId(user.id);
    try {
      await api.post(`/admin/users/${user.id}/suspend`, { reason });
      notify("Suspended", `${user.pcNumber} is now suspended.`);
      await load();
    } catch (e) {
      setError(e.response?.data?.error || "Could not suspend");
    } finally {
      setBusyId(null);
    }
  }

  async function activate(user) {
    setBusyId(user.id);
    try {
      await api.post(`/admin/users/${user.id}/activate`, {});
      notify("Activated", `${user.pcNumber} is now active.`);
      await load();
    } catch (e) {
      setError(e.response?.data?.error || "Could not activate");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="max-w-4xl mx-auto space-y-4">
      <header>
        <h1 className="text-xl md:text-2xl font-extrabold text-plu-black">User management</h1>
        <p className="text-sm text-plu-slate mt-1">
          {total} member{total !== 1 ? "s" : ""} in the system.
        </p>
      </header>

      {error && <Alert tone="error" title="Error">{error}</Alert>}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-black/5 p-3 flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
          placeholder="Search by name, phone, PC number…"
          className="flex-1"
        />
        <select
          value={role}
          onChange={(e) => { setPage(1); setRole(e.target.value); }}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-plu-black/15 text-plu-black"
        >
          <option value="all">All roles</option>
          <option value="admins">Admins</option>
          <option value="reviewers">Reviewers</option>
          <option value="members">Members</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-10"><Spinner label="Loading users…" /></div>
      ) : users.length === 0 ? (
        <EmptyState title="No users match" description="Try a different search or filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-plu-black text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-3 py-2">Member</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-center px-2 py-2">Admin</th>
                  <th className="text-center px-2 py-2">Reviewer</th>
                  <th className="text-right px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-black/5 hover:bg-plu-black/[0.02]">
                    <td className="px-3 py-2">
                      <p className="font-bold text-plu-black">{u.name}</p>
                      <p className="text-xs text-plu-slate font-mono">{u.pcNumber} · {u.phone}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" :
                        u.status === "SUSPENDED" ? "bg-red-100 text-red-800" :
                        u.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => toggleFlag(u, "isAdmin")}
                        disabled={busyId === u.id || u.id === member.id}
                        aria-label={`Toggle admin for ${u.name}`}
                        className={`min-w-[44px] min-h-[32px] rounded-lg text-xs font-bold ${
                          u.isAdmin ? "bg-plu-yellow text-plu-black" : "bg-plu-black/5 text-plu-slate"
                        } disabled:opacity-40`}
                      >
                        {u.isAdmin ? "✓" : "-"}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => toggleFlag(u, "isReviewer")}
                        disabled={busyId === u.id}
                        aria-label={`Toggle reviewer for ${u.name}`}
                        className={`min-w-[44px] min-h-[32px] rounded-lg text-xs font-bold ${
                          u.isReviewer ? "bg-plu-yellow text-plu-black" : "bg-plu-black/5 text-plu-slate"
                        } disabled:opacity-40`}
                      >
                        {u.isReviewer ? "✓" : "-"}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-right space-x-1">
                      {u.status === "SUSPENDED" ? (
                        <Button size="sm" variant="secondary" onClick={() => activate(u)} disabled={busyId === u.id}>
                          Activate
                        </Button>
                      ) : (
                        <Button size="sm" variant="danger" onClick={() => suspend(u)} disabled={busyId === u.id || u.id === member.id}>
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ← Previous
          </Button>
          <span className="text-sm text-plu-slate">Page {page} of {pages}</span>
          <Button variant="secondary" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
            Next 
          </Button>
        </div>
      )}
    </main>
  );
}
