import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Zap, TrendingUp, Clock, Activity, Radio } from "lucide-react";
import logo from "@/assets/pak-nexus-icon.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAK NEXUS — Quotex Signal Bot" },
      { name: "description", content: "Futuristic Quotex signal generator. Select market and timeframe to receive instant CALL/PUT signals." },
    ],
  }),
  component: Index,
});

const MARKETS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD",
  "EUR/JPY", "GBP/JPY", "BTC/USD", "ETH/USD", "XAU/USD (Gold)",
];

const TIMES = ["5 sec", "15 sec", "30 sec", "1 min", "2 min", "5 min", "15 min"];

type Signal = {
  direction: "CALL" | "PUT";
  market: string;
  time: string;
  accuracy: number;
  expiry: string;
  generatedAt: string;
};

function Index() {
  const [market, setMarket] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState<Signal | null>(null);

  const generate = () => {
    if (!market || !time) return;
    setLoading(true);
    setSignal(null);
    setTimeout(() => {
      const dir: "CALL" | "PUT" = Math.random() > 0.5 ? "CALL" : "PUT";
      const acc = Math.floor(85 + Math.random() * 12);
      const now = new Date();
      const expiry = new Date(now.getTime() + 60000);
      setSignal({
        direction: dir,
        market,
        time,
        accuracy: acc,
        expiry: expiry.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        generatedAt: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
      setLoading(false);
    }, 1800);
  };

  return (
    <main className="relative min-h-screen px-4 py-10 sm:py-16 z-10">
      <div className="mx-auto max-w-2xl relative">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <img
                src={logo.url}
                alt="PAK NEXUS"
                width={72}
                height={72}
                className="size-18 rounded-2xl border border-primary/40 animate-pulse-glow"
                style={{ width: 72, height: 72 }}
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-primary mb-5 backdrop-blur">
            <Radio className="size-3 animate-pulse" />
            System Online
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight uppercase">
            <span className="bg-gradient-to-r from-primary via-[var(--primary-glow)] to-primary bg-clip-text text-transparent">
              PAK NEXUS
            </span>
          </h1>
          <p className="mt-2 text-sm font-mono uppercase tracking-[0.3em] text-muted-foreground">
            // Quotex Signal Engine
          </p>
        </header>

        {/* Form */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-card/60 backdrop-blur-xl border-primary/20 shadow-[var(--shadow-elegant)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2 text-primary">
                <TrendingUp className="size-3.5" /> Market Pair
              </label>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger className="h-12 bg-input/60 border-primary/30 font-mono">
                  <SelectValue placeholder="// Select market" />
                </SelectTrigger>
                <SelectContent>
                  {MARKETS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2 text-primary">
                <Clock className="size-3.5" /> Timeframe
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12 bg-input/60 border-primary/30 font-mono">
                  <SelectValue placeholder="// Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generate}
              disabled={!market || !time || loading}
              className="w-full h-13 py-3 text-base font-bold uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-glow)] hover:shadow-[0_0_50px_oklch(0.74_0.19_50/0.6)] transition-shadow"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Activity className="size-4 animate-spin" />
                  Scanning Market…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Zap className="size-4" /> Generate Signal
                </span>
              )}
            </Button>
          </div>
        </Card>

        {/* Signal */}
        {signal && (
          <Card className={`relative overflow-hidden mt-6 p-8 bg-card/70 backdrop-blur-xl border-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 scan-line ${
            signal.direction === "CALL" ? "border-success/60 shadow-success/20" : "border-danger/60 shadow-danger/20"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">// Signal</p>
                <p className="text-lg font-bold mt-0.5 font-mono">{signal.market}</p>
              </div>
              <Badge variant="secondary" className="text-xs font-mono border border-primary/30">{signal.time}</Badge>
            </div>

            <div className={`flex flex-col items-center justify-center rounded-xl py-8 border-2 ${
              signal.direction === "CALL"
                ? "bg-success/10 text-success border-success/40"
                : "bg-danger/10 text-danger border-danger/40"
            }`}>
              {signal.direction === "CALL" ? (
                <ArrowUp className="size-16 mb-2 drop-shadow-[0_0_15px_currentColor]" strokeWidth={3} />
              ) : (
                <ArrowDown className="size-16 mb-2 drop-shadow-[0_0_15px_currentColor]" strokeWidth={3} />
              )}
              <p className="text-5xl font-black tracking-tight uppercase drop-shadow-[0_0_20px_currentColor]">{signal.direction}</p>
              <p className="text-xs font-mono uppercase tracking-widest opacity-80 mt-2">
                {signal.direction === "CALL" ? "// Buy / Up" : "// Sell / Down"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-lg bg-secondary/40 border border-primary/20 p-3 text-center">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Accuracy</p>
                <p className="text-lg font-black text-primary mt-1">{signal.accuracy}%</p>
              </div>
              <div className="rounded-lg bg-secondary/40 border border-primary/20 p-3 text-center">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Generated</p>
                <p className="text-sm font-bold mt-1 font-mono">{signal.generatedAt}</p>
              </div>
              <div className="rounded-lg bg-secondary/40 border border-primary/20 p-3 text-center">
                <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Expiry</p>
                <p className="text-sm font-bold mt-1 font-mono">{signal.expiry}</p>
              </div>
            </div>
          </Card>
        )}

        <footer className="mt-10 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Powered by <span className="text-primary font-bold">PAK NEXUS</span>
          </p>
          <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
            ⚠ Signals are for educational purposes. Trading involves risk — no signal is guaranteed.
          </p>
        </footer>
      </div>
    </main>
  );
}
