import { useState } from "react";
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Droplets, BarChart2 } from "lucide-react";
import { usePillbaContext } from "../Root";
import { PILL_SLOTS, FLUID_SLOTS } from "../pillba-data";

export default function DashboardPage() {
  const { connected, setConnected } = usePillbaContext();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const lowCount = [
    ...PILL_SLOTS.map((s) => s.count / s.max < 0.1),
    ...FLUID_SLOTS.map((s) => s.volume / s.maxVolume < 0.1),
  ].filter(Boolean).length;

  return (
    <div className="px-5 py-5 space-y-4">
      {/* Wi-Fi Connectivity Card */}
      <div className="rounded-2xl p-4" style={{ background: "#12233F" }}>
        <div className="flex justify-between items-start">
          <div>
            <p
              className="text-white/40 text-[10px] uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Device Status
            </p>
            <div className="flex items-center gap-2 mt-2">
              {connected ? (
                <Wifi className="w-5 h-5" style={{ color: "#2BBCB0" }} />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <h3 className="text-white font-bold text-base">
                {connected ? "Connected to Pi" : "Connection Lost"}
              </h3>
            </div>
            <p
              className="text-white/30 text-[11px] mt-1"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              192.168.1.42 · PillbaUnit-01 · v2.4.1
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={handleSync}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.10)" }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              Sync
            </button>
            <button
              onClick={() => setConnected(!connected)}
              className="text-white/25 text-[9px] hover:text-white/50 transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {connected ? "simulate disconnect" : "reconnect"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "Last Sync", value: "2m ago", highlight: false },
            { label: "Log Status", value: syncing ? "Syncing…" : "Up to date", highlight: true },
            { label: "Uptime", value: "14d 6h", highlight: false },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-2.5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <p
                className="text-white/30 text-[9px] uppercase tracking-wider"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {s.label}
              </p>
              <p
                className="text-xs font-semibold mt-0.5"
                style={{
                  color: s.highlight ? "#2BBCB0" : "#fff",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div
            className="flex-1 h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div className="h-full rounded-full" style={{ width: "78%", background: "#2BBCB0" }} />
          </div>
          <span
            className="text-white/25 text-[9px]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            −62 dBm
          </span>
        </div>
      </div>

      {/* Inventory Monitor */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ boxShadow: "0 1px 4px rgba(18,35,63,0.07), 0 0 0 1px rgba(18,35,63,0.05)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[#12233F] font-bold text-base">Inventory Monitor</h3>
            <p
              className="text-[#12233F]/35 text-[11px] mt-0.5"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              8-compartment · Real-time
            </p>
          </div>
          {lowCount > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
              style={{
                background: "rgba(255,90,54,0.09)",
                border: "1px solid rgba(255,90,54,0.22)",
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#FF5A36" }} />
              <span className="text-xs font-bold" style={{ color: "#FF5A36" }}>
                {lowCount} Low
              </span>
            </div>
          )}
        </div>

        {/* 6 pill slots — 3×2 grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {PILL_SLOTS.map((slot) => {
            const pct = slot.count / slot.max;
            const isLow = pct < 0.1;
            const r = 17;
            const circ = 2 * Math.PI * r;
            return (
              <div
                key={slot.id}
                className="flex flex-col items-center p-2.5 rounded-xl relative"
                style={{
                  background: isLow ? "rgba(255,90,54,0.05)" : "#F7F9FC",
                  border: isLow ? "1px solid rgba(255,90,54,0.22)" : "1px solid transparent",
                }}
              >
                {isLow && (
                  <div className="absolute top-1.5 right-1.5">
                    <AlertTriangle className="w-3 h-3" style={{ color: "#FF5A36" }} />
                  </div>
                )}
                <div className="relative w-12 h-12">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 40 40"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    <circle
                      cx="20" cy="20" r={r}
                      fill="none"
                      stroke="#12233F"
                      strokeOpacity="0.06"
                      strokeWidth="4"
                    />
                    <circle
                      cx="20" cy="20" r={r}
                      fill="none"
                      stroke={isLow ? "#FF5A36" : "#2BBCB0"}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - pct)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-xs" style={{ color: "#12233F" }}>
                      {slot.id}
                    </span>
                  </div>
                </div>
                <p
                  className="text-[9px] font-bold mt-1.5 text-center leading-tight"
                  style={{ color: "#12233F" }}
                >
                  {slot.name.split(" ")[0]}
                </p>
                <p
                  className="text-[9px] mt-0.5 font-semibold"
                  style={{
                    color: isLow ? "#FF5A36" : "rgba(18,35,63,0.35)",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {slot.count}/{slot.max}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2 fluid bars */}
        <div className="space-y-2.5">
          {FLUID_SLOTS.map((fluid) => {
            const pct = fluid.volume / fluid.maxVolume;
            const isLow = pct < 0.1;
            return (
              <div
                key={fluid.id}
                className="p-3 rounded-xl"
                style={{
                  background: isLow ? "rgba(255,90,54,0.05)" : "#F7F9FC",
                  border: isLow ? "1px solid rgba(255,90,54,0.22)" : "1px solid transparent",
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "#12233F" }}
                    >
                      <Droplets className="w-4 h-4" style={{ color: "#2BBCB0" }} />
                    </div>
                    <div>
                      <p className="text-[#12233F] text-xs font-bold">{fluid.name}</p>
                      <p
                        className="text-[9px]"
                        style={{
                          color: "rgba(18,35,63,0.35)",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        Slot {fluid.id} · Volumetric
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isLow && <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#FF5A36" }} />}
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: isLow ? "#FF5A36" : "rgba(18,35,63,0.50)",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {fluid.volume}{fluid.unit}
                    </span>
                  </div>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: "rgba(18,35,63,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(pct * 100, 2)}%`,
                      background: isLow ? "#FF5A36" : "#2BBCB0",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span
                    className="text-[9px]"
                    style={{ color: "rgba(18,35,63,0.25)", fontFamily: "'DM Mono', monospace" }}
                  >
                    0{fluid.unit}
                  </span>
                  <span
                    className="text-[9px]"
                    style={{ color: "rgba(18,35,63,0.25)", fontFamily: "'DM Mono', monospace" }}
                  >
                    Max {fluid.maxVolume}{fluid.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
