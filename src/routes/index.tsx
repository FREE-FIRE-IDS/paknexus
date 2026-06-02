import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Zap, TrendingUp, Clock, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quotex Signal Bot — AI Trading Signals" },
      { name: "description", content: "Generate AI-powered trading signals. Select market and timeframe to get instant CALL/PUT signals." },
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
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground mb-5 backdrop-blur">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            AI Bot Online
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            Quotex Signal Bot
          </h1>
          <p className="mt-3 text-muted-foreground">
            Select a market and timeframe — get an instant AI-generated signal.
          </p>
        </header>

        {/* Form */}
        <Card className="p-6 sm:p-8 bg-card/70 backdrop-blur border-border shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <TrendingUp className="size-4 text-primary" /> Market
              </label>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <SelectValue placeholder="Choose a market" />
                </SelectTrigger>
                <SelectContent>
                  {MARKETS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Clock className="size-4 text-primary" /> Timeframe
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <SelectValue placeholder="Choose timeframe" />
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
              className="w-full h-13 py-3 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Activity className="size-4 animate-spin" />
                  Analyzing market…
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
          <Card className={`mt-6 p-8 bg-card/70 backdrop-blur border-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            signal.direction === "CALL" ? "border-success/60 shadow-success/10" : "border-danger/60 shadow-danger/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Signal</p>
                <p className="text-lg font-semibold mt-0.5">{signal.market}</p>
              </div>
              <Badge variant="secondary" className="text-xs">{signal.time}</Badge>
            </div>

            <div className={`flex flex-col items-center justify-center rounded-xl py-8 ${
              signal.direction === "CALL"
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}>
              {signal.direction === "CALL" ? (
                <ArrowUp className="size-16 mb-2" strokeWidth={3} />
              ) : (
                <ArrowDown className="size-16 mb-2" strokeWidth={3} />
              )}
              <p className="text-4xl font-bold tracking-tight">{signal.direction}</p>
              <p className="text-sm opacity-80 mt-1">
                {signal.direction === "CALL" ? "Buy / Up" : "Sell / Down"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Accuracy</p>
                <p className="text-lg font-bold text-primary mt-1">{signal.accuracy}%</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Generated</p>
                <p className="text-sm font-semibold mt-1">{signal.generatedAt}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Expiry</p>
                <p className="text-sm font-semibold mt-1">{signal.expiry}</p>
              </div>
            </div>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
          ⚠️ Signals are generated by an algorithm for educational/demo purposes. Trading carries real risk — no signal is truly 100% accurate.
        </p>
      </div>
    </main>
  );
}
