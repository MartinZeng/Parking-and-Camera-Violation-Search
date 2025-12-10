"use client";

import { FormEvent, useState } from "react";

type Ticket = {
  id: string | number;
  summonsNumber: string;
  plate: string;
  state: string;
  issueDate: string;
  violation: string;
  fineAmount: number;
};

type TicketsResponse = {
  plate: string;
  state: string | null;
  count: number;
  tickets: Ticket[];
};

export default function HomePage() {
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("NY");
  const [email, setEmail] = useState("");
  const [data, setData] = useState<TicketsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [subscribeMsg, setSubscribeMsg] = useState("");

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    setData(null);

    const params = new URLSearchParams({
      plate: plate.trim(),
      state: state.trim(),
    });

    try {
      const res = await fetch(`/api/tickets?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || "Unknown error");
      } else {
        setData(json);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    setSubscribeMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plate, state }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSubscribeMsg(json.error || "Failed to subscribe");
        return;
      }

      if (json.alreadySubscribed) {
        setSubscribeMsg("You are already subscribed for this plate.");
      } else {
        setSubscribeMsg("Subscribed! You will be notified about new tickets.");
      }
    } catch (err) {
      console.error(err);
      setSubscribeMsg("Network error while subscribing");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-50">
            NYC Ticket History Lookup
          </h1>
          <p className="text-sm text-slate-400">
            Search by plate and subscribe for email notifications when new
            tickets appear.
          </p>
        </header>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            value={plate}
            onChange={(e) =>
              setPlate(e.target.value.toUpperCase().slice(0, 10))
            }
            placeholder="License plate (e.g. ABC123)"
            className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <input
            type="text"
            value={state}
            onChange={(e) =>
              setState(e.target.value.toUpperCase().slice(0, 2))
            }
            className="w-20 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-center focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !plate.trim()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {errorMsg && (
          <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        {/* Results table */}
        {data && (
          <section className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>
                Results for{" "}
                <span className="font-mono font-semibold">
                  {data.plate} ({data.state || "ALL STATES"})
                </span>
              </span>
              <span className="text-slate-400">
                {data.count} ticket{data.count === 1 ? "" : "s"} found
              </span>
            </div>

            {data.count === 0 ? (
              <div className="text-sm text-slate-400 border border-slate-800 rounded-md px-3 py-2">
                No tickets found for this plate.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-slate-800">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-900/70">
                    <tr className="text-left text-slate-400">
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Violation</th>
                      <th className="px-3 py-2">Amount Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tickets.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t border-slate-800 even:bg-slate-900/40"
                      >
                        <td className="px-3 py-2 text-slate-200">
                          {t.issueDate}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          {t.violation}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          ${t.fineAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Subscribe form */}
            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex flex-col md:flex-row gap-3 border-t border-slate-800 pt-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for ticket alerts"
                className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!email || !plate.trim()}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 transition"
              >
                Notify me for new tickets
              </button>
            </form>

            {subscribeMsg && (
              <p className="text-xs text-slate-400">{subscribeMsg}</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
