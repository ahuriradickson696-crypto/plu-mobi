import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";
import { Button, Field, Input, Alert, Spinner, EmptyState } from "../../ui";
import StatusBadge from "../../components/StatusBadge";

export default function Verify() {
  const [params] = useSearchParams();
  const [pc, setPc] = useState(params.get("pc") || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const pcRef = useRef(null);

  async function lookup(e) {
    if (e) e.preventDefault();
    setError("");
    setNotFound(false);
    setResult(null);

    const trimmed = pc.trim().toUpperCase();
    if (!trimmed) {
      setError("Enter a PC number to verify.");
      pcRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/verify/${encodeURIComponent(trimmed)}`);
      if (!data.found) {
        setNotFound(true);
      } else {
        setResult(data);
      }
    } catch {
      setError("Lookup failed. Check the number and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-lookup if ?pc=XXXX is in the URL
  useEffect(() => {
    if (params.get("pc")) lookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden">
        <img
          src="/GEN.jpg"
          alt="Patriotic League of Uganda"
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.currentTarget.parentElement.style.display = "none";
          }}
        />
      </div>

      <form
        onSubmit={lookup}
        noValidate
        aria-labelledby="verify-heading"
        className="bg-white rounded-2xl shadow-md border border-black/5 p-5 md:p-6 space-y-4"
      >
      <div className="flex flex-col items-center gap-2 pb-2">
        <img
          src="/plu-logo-circle.png"
          alt="Patriotic League of Uganda"
          className="h-16 w-16 rounded-full object-cover border-2 border-plu-yellow shadow-md"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <span className="text-[10px] uppercase tracking-widest text-plu-yellow font-semibold">
          Patriotic League of Uganda
        </span>
      </div>
        <header>
          <h1
            id="verify-heading"
            className="text-xl md:text-2xl font-extrabold text-plu-black"
          >
            Verify membership
          </h1>
          <p className="text-sm text-plu-slate mt-1">
            Enter a PC number to verify a membership. Public verification, anytime.
          </p>
        </header>

        {error && (
          <Alert tone="error" title="Cannot verify">
            {error}
          </Alert>
        )}

        <Field
          label="PC number"
          required
          hint="Format: PC-XXXXXX (the number on the member's card)"
        >
          <Input
            ref={pcRef}
            type="text"
            name="pc"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck="false"
            className="font-mono uppercase"
            value={pc}
            onChange={(e) => setPc(e.target.value.toUpperCase())}
            placeholder="PC-000000"
          />
        </Field>

        <Button
          type="submit"
          variant="yellow"
          loading={loading}
          className="w-full"
        >
          {loading ? "Checking…" : "Verify"}
        </Button>

        {loading && (
          <div className="flex justify-center pt-2">
            <Spinner label="Checking registry…" />
          </div>
        )}
      </form>

      {notFound && (
        <EmptyState
          title="No membership found"
          description={`No record for "${pc.trim().toUpperCase()}". Check the number and try again, or contact the Secretariat.`}
        />
      )}

      {result && (
        <section
          aria-labelledby="result-heading"
          aria-live="polite"
          className="bg-white rounded-2xl shadow-md border border-black/5 p-5 space-y-2"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="result-heading"
              className="font-mono font-bold text-plu-black"
            >
              {result.pcNumber}
            </h2>
            <StatusBadge status={result.status} />
          </div>
          {result.name && (
            <p className="text-sm text-plu-black">
              <span className="text-plu-slate">Name: </span>
              {result.name}
            </p>
          )}
          {result.district && (
            <p className="text-sm text-plu-black">
              <span className="text-plu-slate">District: </span>
              {result.district}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

