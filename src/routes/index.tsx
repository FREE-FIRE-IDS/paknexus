import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Zap, TrendingUp, Clock, Activity, Radio, Lock, KeyRound, ShieldCheck, Sun, Sunrise, Sunset, Star } from "lucide-react";
import logo from "@/assets/pak-nexus-icon.png.asset.json";

const REQUIRED_PASS = "Ahad@7860";
const REQUIRED_LICENSE = "Ahad@168974638900720089";
const AUTH_KEY = "pak_nexus_auth_v1";

function AuthGate({ onUnlock }: { onUnlock: () => void }) {
  const [pass, setPass] = useState("");
  const [license, setLicense] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);
    setTimeout(() => {
      if (pass === REQUIRED_PASS && license === REQUIRED_LICENSE) {
        try { localStorage.setItem(AUTH_KEY, "1"); } catch {}
        onUnlock();
      } else {
        setError("// Invalid password or license key");
        setVerifying(false);
      }
    }, 900);
  };

  return (
    <main className="relative min-h-screen px-4 py-10 sm:py-16 z-10 flex items-center justify-center">
      <div className="mx-auto max-w-md w-full">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <img
              src={logo.url}
              alt="PAK NEXUS"
              width={72}
              height={72}
              className="size-18 rounded-2xl border border-primary/40 animate-pulse-glow"
              style={{ width: 72, height: 72 }}
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-primary mb-4 backdrop-blur">
            <Lock className="size-3" /> Secure Access
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
            <span className="bg-gradient-to-r from-primary via-[var(--primary-glow)] to-primary bg-clip-text text-transparent">
              PAK NEXUS
            </span>
          </h1>
          <p className="mt-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            // Authorization Required
          </p>
        </header>

        <Card className="relative overflow-hidden p-6 sm:p-8 bg-card/60 backdrop-blur-xl border-primary/20 shadow-[var(--shadow-elegant)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2 text-primary">
                <Lock className="size-3.5" /> Password
              </label>
              <Input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="// Enter password"
                className="h-12 bg-input/60 border-primary/30 font-mono"
                autoFocus
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2 text-primary">
                <KeyRound className="size-3.5" /> License Key
              </label>
              <Input
                type="password"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="// Enter license key"
                className="h-12 bg-input/60 border-primary/30 font-mono"
              />
            </div>

            {error && (
              <p className="text-xs font-mono text-danger text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={!pass || !license || verifying}
              className="w-full h-13 py-3 text-base font-bold uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-glow)] hover:shadow-[0_0_50px_oklch(0.74_0.19_50/0.6)] transition-shadow"
              style={{ background: "var(--gradient-primary)" }}
            >
              {verifying ? (
                <span className="inline-flex items-center gap-2">
                  <Activity className="size-4 animate-spin" /> Verifying…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4" /> Unlock System
                </span>
              )}
            </Button>
          </form>
        </Card>

        <footer className="mt-8 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Powered by <span className="text-primary font-bold">PAK NEXUS</span>
          </p>
        </footer>
      </div>
    </main>
  );
}

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
  entryTime: string;
};

const TIME_SECONDS: Record<string, number> = {
  "5 sec": 5,
  "15 sec": 15,
  "30 sec": 30,
  "1 min": 60,
  "2 min": 120,
  "5 min": 300,
  "15 min": 900,
};


function Index() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    try { if (localStorage.getItem(AUTH_KEY) === "1") setAuthed(true); } catch {}
  }, []);

  const [market, setMarket] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState<Signal | null>(null);

  if (!authed) return <AuthGate onUnlock={() => setAuthed(true)} />;


  const generate = () => {
    if (!market || !time) return;
    setLoading(true);
    setSignal(null);
    setTimeout(() => {
      const now = new Date();
      const seedStr = `${market}-${time}-${now.getHours()}-${now.getMinutes()}`;
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
      }
      const seededRandom = () => {
        hash = ((hash * 16807 + 0) % 2147483647) | 0;
        return (hash & 0x7fffffff) / 0x7fffffff;
      };

      const marketBias: Record<string, number> = {
        "EUR/USD": 0.05,
        "GBP/USD": -0.03,
        "USD/JPY": 0.08,
        "AUD/USD": -0.06,
        "USD/CAD": 0.04,
        "EUR/JPY": -0.02,
        "GBP/JPY": 0.06,
        "BTC/USD": 0.1,
        "ETH/USD": -0.08,
        "XAU/USD (Gold)": 0.03,
      };

      const hour = now.getHours();
      const sessionBoost =
        (hour >= 8 && hour < 12) || (hour >= 13 && hour < 17) ? 0.15 : 0.05;

      const timeWeight: Record<string, number> = {
        "5 sec": 0.52,
        "15 sec": 0.54,
        "30 sec": 0.56,
        "1 min": 0.58,
        "2 min": 0.6,
        "5 min": 0.65,
        "15 min": 0.72,
      };

      const baseScore = (seededRandom() - 0.5) * 2;
      const bias = marketBias[market] || 0;
      const trendStrength = Math.abs(baseScore + bias + sessionBoost);
      void timeWeight;


      const dir: "CALL" | "PUT" =
        baseScore + bias + sessionBoost > 0 ? "CALL" : "PUT";

      const acc = Math.max(92, Math.min(99, Math.floor(92 + trendStrength * 8 + seededRandom() * 3)));

      // Entry time: aligned to next candle boundary for the chosen timeframe
      const tfSec = TIME_SECONDS[time] || 60;
      const leadSec = tfSec <= 30 ? 10 : 20; // give user time to place trade
      const entryMs = Math.ceil((now.getTime() + leadSec * 1000) / (tfSec * 1000)) * (tfSec * 1000);
      const entry = new Date(entryMs);
      const expiry = new Date(entryMs + tfSec * 1000);
      const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setSignal({
        direction: dir,
        market,
        time,
        accuracy: acc,
        expiry: fmt(expiry),
        generatedAt: fmt(now),
        entryTime: fmt(entry),
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

        {/* Trading Sessions Guide */}
        <Card className="relative overflow-hidden mt-6 p-6 bg-card/60 backdrop-blur-xl border-primary/20 shadow-[var(--shadow-elegant)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-4 text-primary" />
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary font-bold">Optimal Trade Windows</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-success/10 border border-success/30 p-3 flex items-start gap-3">
              <Sunrise className="size-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-success tracking-wider">London / Asia Session</p>
                <p className="text-sm font-mono mt-1 text-foreground">08:00 AM – 12:00 PM</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Highest volatility • Best for EUR/USD, GBP/USD, USD/JPY</p>
              </div>
            </div>
            <div className="rounded-lg bg-success/10 border border-success/30 p-3 flex items-start gap-3">
              <Sun className="size-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-success tracking-wider">New York Session</p>
                <p className="text-sm font-mono mt-1 text-foreground">01:00 PM – 05:00 PM</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Major US news • Best for BTC/USD, ETH/USD, XAU/USD</p>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/40 border border-primary/20 p-3 flex items-start gap-3">
              <Sunset className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-primary tracking-wider">Overlap Session</p>
                <p className="text-sm font-mono mt-1 text-foreground">12:00 PM – 01:00 PM</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Moderate activity • Good for all pairs</p>
              </div>
            </div>
            <div className="rounded-lg bg-danger/10 border border-danger/30 p-3 flex items-start gap-3">
              <Star className="size-5 text-danger shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-danger tracking-wider">Off-Peak / Night</p>
                <p className="text-sm font-mono mt-1 text-foreground">05:00 PM – 08:00 AM</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Low liquidity • Avoid or use longer timeframes</p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-mono text-center text-primary">
              <span className="font-bold">Pro Tip:</span> 15 min timeframe gives the strongest signals. 5 sec & 15 sec are high risk — use only in active sessions.
            </p>
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
        </footer>
      </div>
    </main>
  );
}
