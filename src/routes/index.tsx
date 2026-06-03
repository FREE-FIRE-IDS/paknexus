import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Zap, TrendingUp, Clock, Activity, Radio, KeyRound, Lock, Timer } from "lucide-react";
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

const FIXED_TIME = "1 min";

const VALID_LICENSE = "16897463890072";
const LICENSE_STORAGE_KEY = "pak_nexus_license";

type Signal = {
  direction: "CALL" | "PUT";
  market: string;
  time: string;
  accuracy: number;
  entryAt: string;
  entryAtMs: number;
  expiry: string;
  generatedAt: string;
};

function parseTimeframeMs(tf: string): number {
  const [n, unit] = tf.split(" ");
  const num = parseInt(n, 10);
  return unit.startsWith("sec") ? num * 1000 : num * 60_000;
}

function fmt(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function Index() {
  const [licensed, setLicensed] = useState(false);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState("");

  const [market, setMarket] = useState<string>("");
  const time = FIXED_TIME;
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState<Signal | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LICENSE_STORAGE_KEY) === VALID_LICENSE) {
      setLicensed(true);
    }
  }, []);

  useEffect(() => {
    if (!signal) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(signal.entryAtMs).getTime() - Date.now()) / 1000));
      setCountdown(diff);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);

  const activateLicense = () => {
    if (licenseInput.trim() === VALID_LICENSE) {
      localStorage.setItem(LICENSE_STORAGE_KEY, VALID_LICENSE);
      setLicensed(true);
      setLicenseError("");
    } else {
      setLicenseError("Invalid license key. Access denied.");
    }
  };

  const generate = () => {
    if (!market || !time) return;
    setLoading(true);
    setSignal(null);
    setTimeout(() => {
      const dir: "CALL" | "PUT" = Math.random() > 0.5 ? "CALL" : "PUT";
      const now = new Date();
      // Fixed execution time: 15 seconds from now (gives trader time to place trade)
      const entryAt = new Date(now.getTime() + 15_000);
      const expiry = new Date(entryAt.getTime() + parseTimeframeMs(time));
      setSignal({
        direction: dir,
        market,
        time,
        accuracy: 100,
        entryAt: fmt(entryAt),
        entryAtMs: entryAt.getTime(),
        expiry: fmt(expiry),
        generatedAt: fmt(now),
      });
      setLoading(false);
    }, 1800);
  };

  if (!licensed) {
    return (
      <main className="relative min-h-screen px-4 py-16 z-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo.url} alt="PAK NEXUS" width={72} height={72}
              className="rounded-2xl border border-primary/40 animate-pulse-glow"
              style={{ width: 72, height: 72 }} />
          </div>
          <h1 className="text-center text-3xl font-black uppercase tracking-tight mb-2">
            <span className="bg-gradient-to-r from-primary via-[var(--primary-glow)] to-primary bg-clip-text text-transparent">
              PAK NEXUS
            </span>
          </h1>
          <p className="text-center text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-8">
            // Secure Access Required
          </p>

          <Card className="p-6 bg-card/60 backdrop-blur-xl border-primary/20 shadow-[var(--shadow-elegant)]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-3">
              <Lock className="size-3.5" /> License Activation
            </div>
            <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2 text-muted-foreground">
              <KeyRound className="size-3.5" /> Enter License Key
            </label>
            <Input
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && activateLicense()}
              placeholder="••••••••••••••"
              className="h-12 bg-input/60 border-primary/30 font-mono tracking-widest"
            />
            {licenseError && (
              <p className="text-xs font-mono text-danger mt-2">// {licenseError}</p>
            )}
            <Button
              onClick={activateLicense}
              disabled={!licenseInput.trim()}
              className="w-full h-12 mt-4 font-bold uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Zap className="size-4 mr-2" /> Activate
            </Button>
          </Card>

          <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Powered by <span className="text-primary font-bold">PAK NEXUS</span>
          </p>
        </div>
      </main>
    );
  }

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
              <div className="h-12 rounded-md bg-input/60 border border-primary/30 font-mono flex items-center justify-between px-3">
                <span className="text-foreground font-bold">{FIXED_TIME}</span>
                <Badge variant="secondary" className="text-[10px] font-mono border border-primary/30 uppercase tracking-widest">
                  <Lock className="size-3 mr-1" /> Locked
                </Badge>
              </div>
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

            {/* Execution Timer */}
            <div className="mt-6 rounded-xl border-2 border-primary/40 bg-primary/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="size-6 text-primary animate-pulse" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">// Enter Trade At</p>
                  <p className="text-xl font-black font-mono text-primary">{signal.entryAt}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Countdown</p>
                <p className={`text-2xl font-black font-mono ${countdown <= 5 ? "text-danger animate-pulse" : "text-primary"}`}>
                  {countdown}s
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
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
