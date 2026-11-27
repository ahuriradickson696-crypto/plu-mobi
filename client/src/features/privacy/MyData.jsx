import { Link } from "react-router-dom";
import { Button } from "../../design-system/components";
import { DataExportCard } from "./components/DataExportCard";
import { CorrectionRequestForm } from "./components/CorrectionRequestForm";
import { DeletionRequestForm } from "./components/DeletionRequestForm";
import { ConsentHistory } from "./components/ConsentHistory";
import { DPOContact } from "./components/DPOContact";

export default function MyData() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-primary">
          My Data
        </h1>
        <p className="text-sm text-ink-secondary mt-2">
          Under Uganda's Data Protection and Privacy Act, you have the right to access, correct, and request deletion of your personal data.
        </p>
      </header>

      <DataExportCard />
      <CorrectionRequestForm />
      <DeletionRequestForm />
      <ConsentHistory />
      <DPOContact />

      <nav className="flex flex-col-reverse sm:flex-row gap-3 pt-2" aria-label="My Data navigation">
        <Link
          to="/dashboard"
          className="flex-1 min-h-comfortable inline-flex items-center justify-center gap-2
                     bg-surface-raised text-ink-primary font-semibold rounded-md px-4 py-2
                     border border-line-strong hover:bg-surface-sunken transition-colors
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </Link>
        <Link
          to="/"
          className="flex-1 min-h-comfortable inline-flex items-center justify-center gap-2
                     bg-plu-yellow text-plu-black font-semibold rounded-md px-4 py-2
                     hover:brightness-95 transition-all
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Home <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </main>
  );
}
