"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from "lucide-react";

type PollOption = {
  id: string;
  text: string;
  members?: string;
  teamName?: string;
  tagline?: string;
  votes?: number;
  percent?: number;
};

type ActivePoll = {
  id: string;
  question: string;
  options: PollOption[];
};

type PollResults = {
  options: Required<PollOption>[];
  totalVotes: number;
};

function getFingerprint() {
  try {
    const key = "bob.fp";
    let fp = localStorage.getItem(key);
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem(key, fp);
    }
    return fp;
  } catch {
    return "anon";
  }
}

export default function PollingBoothPage() {
  const [poll, setPoll] = useState<ActivePoll | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const prevRanksRef = useRef<Record<string, number>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  const votedKey = useMemo(() => (poll ? `bob.poll.voted:${poll.id}` : null), [poll]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/polls/active");
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) {
          setPoll(null);
          setResults(null);
          setLoadError("No active poll or server error. You can seed a demo poll.");
          return;
        }
        const data = await res.json();
        if (data && data.id) {
          setPoll({ id: data.id, question: data.question, options: data.options });
          setLoadError(null);
        } else {
          setPoll(null);
          setResults(null);
          setLoadError("No active poll for today. You can seed a demo poll.");
        }
      } catch (e) {
        console.error(e);
        setLoadError("Failed to load poll. You can seed a demo poll.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load vote from localStorage
  useEffect(() => {
    if (!votedKey) return;
    try {
      const saved = localStorage.getItem(votedKey);
      if (saved) setVotedOption(saved);
    } catch {}
  }, [votedKey]);

  // Poll results
  useEffect(() => {
    if (!poll) return;
    let stop = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/polls/${poll.id}/results`);
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) return;
        const data: PollResults = await res.json();
        if (!stop && data && Array.isArray(data.options)) {
          // compute ranks and keep previous
          const sorted = [...data.options].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
          const ranks: Record<string, number> = {};
          sorted.forEach((o, idx) => (ranks[o.id] = idx + 1));
          prevRanksRef.current = prevRanksRef.current || {};
          setResults(data);
          // Store latest ranks for next comparison
          prevRanksRef.current = ranks;
        }
      } catch (e) {
        // ignore
      }
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [poll]);

  const handleVote = async (optionId: string) => {
    if (!poll) return;
    if (votedOption) {
      toast("You have already voted today.");
      return;
    }
    try {
      const fp = getFingerprint();
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, fingerprint: fp }),
      });
      if (res.ok) {
        setVotedOption(optionId);
        if (votedKey) localStorage.setItem(votedKey, optionId);
        toast.success("Your vote has been recorded! ✅");
        // Refresh results soon after vote
        setTimeout(async () => {
          try {
            const r = await fetch(`/api/polls/${poll.id}/results`);
            const d = await r.json();
            setResults(d);
          } catch {}
        }, 500);
      } else {
        const err = await res.json().catch(() => ({}));
        if (err?.error?.code === "ALREADY_VOTED") {
          toast("You have already voted today.");
          if (votedKey && !votedOption) localStorage.setItem(votedKey, optionId);
        } else {
          toast.error("Failed to submit vote. Please try again.");
        }
      }
    } catch (e) {
      toast.error("Network error. Please try again.");
    }
  };

  const ranked = useMemo(() => {
    if (!results) return [] as Required<PollOption>[];
    return [...results.options].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  }, [results]);

  const trendFor = (optionId: string, currentRank: number) => {
    const prev = prevRanksRef.current[optionId];
    if (!prev) return null;
    if (currentRank < prev) return "up" as const;
    if (currentRank > prev) return "down" as const;
    return "same" as const;
  };

  return (
    <div className="w-full min-h-[80vh] flex items-start justify-center py-10">
      <div className="w-full max-w-3xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className=" text-2xl">Polling Booth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && <div>Loading poll…</div>}
            {!loading && !poll && (
              <div className="space-y-3">
                <div>{loadError ?? "No active poll. Be the first to vote when it opens!"}</div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/polls/seed", { method: "POST" });
                      const ct = res.headers.get("content-type") || "";
                      if (!res.ok || !ct.includes("application/json")) {
                        toast.error("Failed to seed poll.");
                        return;
                      }
                      const data = await res.json();
                      if (data?.created) {
                        toast.success("Demo poll created. Loading…");
                        // reload active poll
                        const a = await fetch("/api/polls/active");
                        const act = await a.json();
                        if (act && act.id) {
                          setPoll({ id: act.id, question: act.question, options: act.options });
                          setLoadError(null);
                        }
                      } else {
                        toast.error("Seed did not create a poll.");
                      }
                    } catch {
                      toast.error("Failed to seed poll.");
                    }
                  }}
                >
                  Seed today's demo poll
                </Button>
              </div>
            )}

            {poll && !votedOption && (
              <div className="space-y-4">
                <div className="text-xl font-semibold">{poll.question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {poll.options.map((opt) => (
                    <Card key={opt.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{opt.teamName ?? opt.text}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {opt.members && <div className="text-sm">{opt.members}</div>}
                        {opt.tagline && (
                          <div className="text-sm text-muted-foreground">“{opt.tagline}”</div>
                        )}
                        <div className="pt-2">
                          <Button className="w-full" onClick={() => handleVote(opt.id)}>
                            Vote for {opt.teamName ?? opt.text}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {votedOption && results && (
              <div className="mt-8">
                <div className="text-lg font-semibold mb-2">Leaderboard</div>
                <div className="space-y-2">
                  {ranked.map((o, idx) => {
                    const rank = idx + 1;
                    const trend = trendFor(o.id, rank);
                    return (
                      <div key={o.id} className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center font-semibold">{rank}</div>
                          <div className="font-medium">{o.teamName ?? o.text}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">
                            {o.votes ?? 0} votes · {o.percent ?? 0}%
                          </div>
                          {trend === "up" && <ArrowUp className="text-green-600" size={18} />}
                          {trend === "down" && <ArrowDown className="text-red-600" size={18} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
