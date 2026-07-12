import { useState } from "react";
import { Outlet, useOutletContext, NavLink, Navigate, useNavigate } from "react-router";
import { Home, Clock, Activity, Pill, Lock, Unlock, Check, LogOut, ChevronRight, Shield } from "lucide-react";
import { useApp } from "./App";
import type { RootContext } from "./pillba-data";
import { PROFILES } from "./pillba-data";

export default function Root() {
  const { activeProfile, login, logout } = useApp();
  const [patientPermission, setPatientPermission] = useState(false);
  const [connected, setConnected] = useState(true);
  const navigate = useNavigate();

  const mode = activeProfile?.mode ?? null;
  const isPatientRestricted = mode === "patient" && !patientPermission;

  const context: RootContext = {
    mode: mode ?? "patient",
    patientPermission,
    setPatientPermission,
    connected,
    setConnected,
  };

  const handleLogin = (profile: typeof PROFILES[number]) => {
    login(profile);
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{
        background: "linear-gradient(135deg, #D8DFE8 0%, #E8ECF2 50%, #D4DBE5 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        className="w-full max-w-[390px] bg-[#F7F9FC] flex flex-col overflow-hidden"
        style={{
          minHeight: 844,
          borderRadius: 44,
          boxShadow:
            "0 48px 96px rgba(18,35,63,0.25), 0 12px 32px rgba(18,35,63,0.12), 0 0 0 1px rgba(18,35,63,0.07), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {/* Status bar */}
        <div className="bg-[#12233F] flex items-center justify-between px-8 pt-5 pb-3">
          <span className="text-white/55 text-xs font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>
            9:41
          </span>
          <div className="w-[88px] h-[26px] bg-black rounded-full" />
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px]">
              {[5, 8, 11, 13].map((h, i) => (
                <div key={i} className="w-[3px] rounded-[1px] bg-white/55" style={{ height: h }} />
              ))}
            </div>
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="white" strokeOpacity="0.5" />
              <rect x="19" y="3.5" width="2.5" height="5" rx="1.25" fill="white" fillOpacity="0.4" />
              <rect x="2" y="2" width="10" height="8" rx="1.5" fill="white" fillOpacity="0.7" />
            </svg>
          </div>
        </div>

        {/* App header */}
        <div className="bg-[#12233F] px-6 pb-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#FF5A36", boxShadow: "0 4px 12px rgba(255,90,54,0.45)" }}
                >
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <span
                  className="text-white font-extrabold text-2xl tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Pillba
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: connected ? "#2BBCB0" : "#f87171",
                    boxShadow: connected ? "0 0 8px #2BBCB0" : "0 0 6px #f87171",
                  }}
                />
                <span className="text-white/40 text-[11px]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {connected ? "PillbaUnit-01 · Connected" : "Connection Lost"}
                </span>
              </div>
            </div>

            {/* Profile chip or guest state */}
            {activeProfile ? (
              <div className="flex items-center gap-2">
                <div className="text-right mr-1">
                  <p className="text-white font-bold text-xs leading-tight">{activeProfile.name}</p>
                  <p
                    className="text-[10px] font-semibold mt-0.5"
                    style={{ color: activeProfile.color }}
                  >
                    {activeProfile.role}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base"
                  style={{ background: activeProfile.color + "25", color: activeProfile.color }}
                >
                  {activeProfile.initial}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  title="Switch profile"
                >
                  <LogOut className="w-3.5 h-3.5 text-white/45" />
                </button>
              </div>
            ) : (
              <div
                className="px-3 py-1.5 rounded-full text-white/35 text-[11px] font-semibold"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Not signed in
              </div>
            )}
          </div>
        </div>

        {/* Mode indicator strip — only when logged in */}
        {activeProfile && (
          <div
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold"
            style={{
              background: isPatientRestricted
                ? "rgba(43,188,176,0.09)"
                : mode === "caregiver"
                ? "rgba(255,90,54,0.07)"
                : "rgba(43,188,176,0.07)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isPatientRestricted ? "#2BBCB0" : mode === "caregiver" ? "#FF5A36" : "#2BBCB0" }}
            />
            <span
              style={{ color: isPatientRestricted ? "#2BBCB0" : mode === "caregiver" ? "#FF5A36" : "#2BBCB0" }}
            >
              {isPatientRestricted
                ? "Patient Mode — Limited Access"
                : mode === "caregiver"
                ? "Caregiver Mode — Full Administrative Access"
                : "Patient Mode — Full Access Granted"}
            </span>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {!activeProfile ? (
            <LoginScreen onSelect={handleLogin} />
          ) : isPatientRestricted ? (
            <PatientRestrictedView />
          ) : (
            <Outlet context={context} />
          )}
        </div>

        {/* Bottom nav — only when logged in and not restricted */}
        {activeProfile && !isPatientRestricted && <BottomNav />}
      </div>
    </div>
  );
}

export function usePillbaContext() {
  return useOutletContext<RootContext>();
}

// ── LOGIN / PROFILE SELECTION ─────────────────────────────────────
function LoginScreen({ onSelect }: { onSelect: (p: typeof PROFILES[number]) => void }) {
  return (
    <div className="flex flex-col px-6 py-8 min-h-full">
      {/* Branding */}
      <div className="text-center mb-10 mt-6">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto"
          style={{ background: "#FF5A36", boxShadow: "0 8px 24px rgba(255,90,54,0.4)" }}
        >
          <Pill className="w-9 h-9 text-white" />
        </div>
        <h1
          className="text-[#12233F] font-extrabold text-2xl mt-5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Welcome Back
        </h1>
        <p className="text-[#12233F]/45 text-sm mt-1.5">Select your profile to continue</p>
      </div>

      {/* Profile cards */}
      <div className="space-y-3">
        {PROFILES.map((profile) => (
          <button
            key={profile.mode}
            onClick={() => onSelect(profile)}
            className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.98] hover:opacity-90"
            style={{ background: "#12233F" }}
          >
            <div className="p-5 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl flex-shrink-0"
                style={{
                  background: profile.color + "20",
                  color: profile.color,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {profile.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-bold text-base">{profile.name}</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: profile.color + "22", color: profile.color }}
                  >
                    {profile.role}
                  </span>
                </div>
                <p className="text-white/38 text-xs">
                  {profile.mode === "caregiver"
                    ? "Full administrative access"
                    : "Medication schedule & dispense"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.18)" }} />
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "rgba(18,35,63,0.08)" }} />
        <span className="text-[#12233F]/28 text-[11px] font-semibold">DEVICE</span>
        <div className="flex-1 h-px" style={{ background: "rgba(18,35,63,0.08)" }} />
      </div>

      {/* Device info card */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "rgba(18,35,63,0.04)", border: "1px solid rgba(18,35,63,0.07)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#12233F" }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: "#2BBCB0", boxShadow: "0 0 6px #2BBCB0" }} />
        </div>
        <div>
          <p className="text-[#12233F] font-bold text-sm">PillbaUnit-01</p>
          <p className="text-[#12233F]/38 text-[11px]" style={{ fontFamily: "'DM Mono', monospace" }}>
            192.168.1.42 · v2.4.1 · Online
          </p>
        </div>
        <Shield className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: "rgba(18,35,63,0.2)" }} />
      </div>

      <p
        className="text-center text-[#12233F]/22 text-[10px] mt-auto pt-8"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Pillba v1.0 · Secure local session
      </p>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────
function BottomNav() {
  const tabs: { to: string; Icon: typeof Home; label: string }[] = [
    { to: "/dashboard", Icon: Home, label: "Dashboard" },
    { to: "/schedule", Icon: Clock, label: "Schedule" },
    { to: "/logs", Icon: Activity, label: "Logs" },
  ];

  return (
    <div
      className="flex justify-around items-center px-4 pt-3 pb-7"
      style={{ background: "#fff", borderTop: "1px solid rgba(18,35,63,0.06)" }}
    >
      {tabs.map(({ to, Icon, label }) => (
        <NavLink key={to} to={to} className="flex flex-col items-center gap-1.5 px-5 relative">
          {({ isActive }) => (
            <>
              {isActive && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-1 rounded-full"
                  style={{ background: "#FF5A36" }}
                />
              )}
              <Icon
                className="w-5 h-5 transition-colors"
                style={{ color: isActive ? "#FF5A36" : "rgba(18,35,63,0.22)" }}
              />
              <span
                className="text-[10px] font-bold transition-colors"
                style={{ color: isActive ? "#FF5A36" : "rgba(18,35,63,0.22)" }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

// ── PATIENT RESTRICTED VIEW ───────────────────────────────────────
function PatientRestrictedView() {
  const [shieldLocked, setShieldLocked] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [dispensing, setDispensing] = useState(false);
  const [dispensed, setDispensed] = useState(false);

  const handleDispense = () => {
    if (dispensing || dispensed) return;
    setDispensing(true);
    setTimeout(() => {
      setDispensing(false);
      setDispensed(true);
      setShieldLocked(false);
      setTimeout(() => {
        setDispensed(false);
        setShieldLocked(true);
      }, 5000);
    }, 2500);
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      <div className="text-center pt-2">
        <p className="text-[#12233F]/38 text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
          Good afternoon
        </p>
        <h2 className="text-[#12233F] font-extrabold text-4xl mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Eleanor
        </h2>
      </div>

      {/* Next dose display */}
      <div className="rounded-3xl p-6" style={{ background: "#12233F" }}>
        <p
          className="text-white/38 text-[10px] uppercase tracking-widest text-center"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Next Scheduled Dose
        </p>
        <div className="mt-4 text-center">
          <p className="font-bold leading-none" style={{ fontFamily: "'DM Mono', monospace", fontSize: 58, color: "#2BBCB0" }}>
            12:00
          </p>
          <p className="text-white/45 text-sm mt-2" style={{ fontFamily: "'DM Mono', monospace" }}>
            PM · Today
          </p>
        </div>
        <div className="mt-4 rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
          <p className="text-white font-bold text-base">Atorvastatin 20mg</p>
          <p className="text-white/32 text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
            1 tablet · Slot C
          </p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Clock className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.25)" }} />
          <p className="text-white/28 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>
            In 3 hours 42 minutes
          </p>
        </div>
      </div>

      {/* Passcode */}
      <div>
        <p
          className="text-center text-[#12233F]/38 text-[11px] uppercase tracking-widest mb-3"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Security Passcode (Optional)
        </p>
        <div className="flex justify-center gap-3 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background: passcode[i] ? "#12233F" : "#fff",
                border: passcode[i] ? "2px solid #12233F" : "2px solid rgba(18,35,63,0.10)",
              }}
            >
              {passcode[i] && <div className="w-3 h-3 rounded-full bg-white" />}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((key, i) => (
            <button
              key={i}
              onClick={() => {
                if (!key) return;
                if (key === "⌫") setPasscode((p) => p.slice(0, -1));
                else if (passcode.length < 4) setPasscode((p) => p + key);
              }}
              className="h-14 rounded-2xl font-bold text-xl transition-all active:scale-95"
              style={{
                background: key ? "#fff" : "transparent",
                color: "#12233F",
                border: key ? "1px solid rgba(18,35,63,0.08)" : "none",
                cursor: key ? "pointer" : "default",
                fontFamily: key === "⌫" ? "sans-serif" : "'DM Mono', monospace",
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Shield status */}
      <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(18,35,63,0.07)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: shieldLocked ? "#FF5A36" : "#2BBCB0" }}
            >
              {shieldLocked ? <Lock className="w-6 h-6 text-white" /> : <Unlock className="w-6 h-6 text-white" />}
            </div>
            <div>
              <p className="text-[#12233F] font-bold text-sm">Motorized Cup Shield</p>
              <p
                className="text-xs font-bold mt-0.5"
                style={{ color: shieldLocked ? "#FF5A36" : "#2BBCB0", fontFamily: "'DM Mono', monospace" }}
              >
                {shieldLocked ? "LOCKED · Cup protected" : "OPEN · Ready to collect"}
              </p>
            </div>
          </div>
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: shieldLocked ? "#FF5A36" : "#2BBCB0",
              boxShadow: shieldLocked ? "0 0 10px #FF5A36" : "0 0 10px #2BBCB0",
            }}
          />
        </div>
      </div>

      {/* Dispense button */}
      <button
        onClick={handleDispense}
        disabled={dispensing}
        className="w-full rounded-3xl py-7 text-white font-extrabold text-2xl transition-all active:scale-95 disabled:cursor-not-allowed"
        style={{
          fontFamily: "'Outfit', sans-serif",
          background: dispensed ? "#2BBCB0" : dispensing ? "#12233F" : "#FF5A36",
          boxShadow: dispensed
            ? "0 16px 44px rgba(43,188,176,0.48)"
            : dispensing
            ? "0 8px 24px rgba(18,35,63,0.25)"
            : "0 16px 44px rgba(255,90,54,0.48)",
        }}
      >
        {dispensing ? (
          <span className="flex items-center justify-center gap-3">
            <span
              className="inline-block w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
            />
            Dispensing…
          </span>
        ) : dispensed ? (
          <span className="flex items-center justify-center gap-3">
            <Check className="w-7 h-7" />
            Dose Released
          </span>
        ) : (
          "Dispense Now"
        )}
      </button>
    </div>
  );
}
