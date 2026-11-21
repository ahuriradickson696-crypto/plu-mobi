import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Card } from "../../ui";

export default function AdminHome() {
  const { member } = useAuth();

  if (!member?.isAdmin) {
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <p className="text-sm text-plu-slate">You do not have admin access.</p>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto space-y-5">
      <header>
        <h1 className="text-xl md:text-2xl font-extrabold text-plu-black">
          Administration
        </h1>
        <p className="text-sm text-plu-slate mt-1">
          Manage users, roles and system settings.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link to="/admin/users" className="block no-underline">
          <Card>
            <h2 className="text-lg font-extrabold text-plu-black mb-1">User management</h2>
            <p className="text-sm text-plu-slate">
              Search all members. Grant reviewer access. Suspend or reactivate accounts.
            </p>
          </Card>
        </Link>

        <Link to="/audit" className="block no-underline">
          <Card>
            <h2 className="text-lg font-extrabold text-plu-black mb-1">Audit log</h2>
            <p className="text-sm text-plu-slate">
              View all recorded actions in the system.
            </p>
          </Card>
        </Link>

        <Link to="/reporting" className="block no-underline">
          <Card>
            <h2 className="text-lg font-extrabold text-plu-black mb-1">Reporting dashboard</h2>
            <p className="text-sm text-plu-slate">
              Statistics and trends for members, endorsements and corruption reports.
            </p>
          </Card>
        </Link>

        <Link to="/review" className="block no-underline">
          <Card>
            <h2 className="text-lg font-extrabold text-plu-black mb-1">Review queue</h2>
            <p className="text-sm text-plu-slate">
              Approve, reject or request more info for Tentative members.
            </p>
          </Card>
        </Link>
      </div>
    </main>
  );
}
