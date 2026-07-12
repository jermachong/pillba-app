import { useState } from "react";
import { AlertTriangle, Check, Activity, BarChart2, Bell, Phone, Trash2, Plus, MessageSquare } from "lucide-react";
import { EVENT_LOG, INIT_CONTACTS } from "../pillba-data";

export default function LogsPage() {
  const [alertWindow, setAlertWindow] = useState(15);
  const [contacts, setContacts] = useState(INIT_CONTACTS);
  const [addingContact, setAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  return (
    <div className="px-5 py-5 space-y-4">
      {/* Dual-Verification Event Ledger */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ boxShadow: "0 1px 4px rgba(18,35,63,0.07), 0 0 0 1px rgba(18,35,63,0.05)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[#12233F] font-bold text-base">Dual-Verification Ledger</h3>
            <p
              className="text-[#12233F]/35 text-[11px] mt-0.5"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              IR beam-break · HX711 load-cell
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
            style={{ background: "rgba(255,90,54,0.09)" }}
          >
            <AlertTriangle className="w-3 h-3" style={{ color: "#FF5A36" }} />
            <span className="text-[10px] font-bold" style={{ color: "#FF5A36" }}>
              1 Mismatch
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {EVENT_LOG.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-xl"
              style={{
                background: event.ok ? "#F7F9FC" : "rgba(255,90,54,0.05)",
                border: event.ok ? "1px solid transparent" : "1px solid rgba(255,90,54,0.20)",
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span
                  className="text-[10px]"
                  style={{ color: "rgba(18,35,63,0.38)", fontFamily: "'DM Mono', monospace" }}
                >
                  {event.ts}
                </span>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    background: event.ok ? "rgba(43,188,176,0.12)" : "rgba(255,90,54,0.14)",
                    color: event.ok ? "#2BBCB0" : "#FF5A36",
                  }}
                >
                  {event.ok ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <AlertTriangle className="w-2.5 h-2.5" />
                  )}
                  {event.ok ? "Verified" : "Mismatch"}
                </div>
              </div>
              <p className="text-[#12233F] text-xs font-semibold">{event.med}</p>
              <div className="flex gap-5 mt-2">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3" style={{ color: "rgba(18,35,63,0.22)" }} />
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(18,35,63,0.44)", fontFamily: "'DM Mono', monospace" }}
                  >
                    Beam: {event.beam} pills
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-3 h-3" style={{ color: "rgba(18,35,63,0.22)" }} />
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color: event.ok ? "rgba(18,35,63,0.44)" : "#FF5A36",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {event.actual} / {event.expected}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unresponsive Detection + Emergency Contacts */}
      <div className="rounded-2xl p-4" style={{ background: "#12233F" }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,90,54,0.18)" }}
          >
            <Bell className="w-4 h-4" style={{ color: "#FF5A36" }} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Unresponsive Detection</h3>
            <p
              className="text-white/35 text-[10px]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Sequential emergency step timeline
            </p>
          </div>
        </div>

        {/* Alert window slider */}
        <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between items-center mb-2">
            <p
              className="text-white/45 text-[10px] uppercase tracking-wider"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Collection Window
            </p>
            <div className="rounded-lg px-2.5 py-1" style={{ background: "#FF5A36" }}>
              <span
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {alertWindow}min
              </span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={alertWindow}
            onChange={(e) => setAlertWindow(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "#FF5A36" }}
          />
          <div className="flex justify-between mt-1">
            {["5 min", "60 min"].map((l) => (
              <span
                key={l}
                className="text-white/22 text-[9px]"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Step timeline */}
        <div className="space-y-2 mb-4">
          {[
            { step: 1, delay: "T+0", action: "Dose dispensed — motorized shield opens", color: "#2BBCB0" },
            { step: 2, delay: `T+${alertWindow}min`, action: "No collection detected → SMS blast to all contacts", color: "#FF5A36" },
            { step: 3, delay: `T+${alertWindow * 2}min`, action: "Second SMS blast + automated emergency advisory", color: "#FF5A36" },
          ].map((s) => (
            <div
              key={s.step}
              className="flex gap-3 items-start rounded-xl p-2.5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "22" }}
              >
                <span className="font-bold text-xs" style={{ color: s.color }}>
                  {s.step}
                </span>
              </div>
              <div>
                <p
                  className="text-[9px] font-semibold"
                  style={{ color: s.color, fontFamily: "'DM Mono', monospace" }}
                >
                  {s.delay}
                </p>
                <p className="text-white/75 text-xs mt-0.5">{s.action}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency contacts */}
        <p
          className="text-white/38 text-[10px] uppercase tracking-wider mb-2"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          SMS Blast Recipients
        </p>
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,90,54,0.15)" }}
              >
                <Phone className="w-4 h-4" style={{ color: "#FF5A36" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{c.name}</p>
                <p
                  className="text-white/32 text-[10px]"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {c.relation}
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: "#2BBCB0", fontFamily: "'DM Mono', monospace" }}
                >
                  {c.phone}
                </p>
              </div>
              <button
                onClick={() => setContacts((cs) => cs.filter((_, j) => j !== i))}
                className="p-1.5 transition-colors"
                style={{ color: "rgba(255,255,255,0.20)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#FF5A36")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.20)")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {addingContact ? (
          <div
            className="mt-3 rounded-xl p-3 space-y-2"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {(
              [
                { ph: "Full name", key: "name" as const },
                { ph: "Relation (e.g. Son, Primary MD)", key: "relation" as const },
                { ph: "+1 (555) 000-0000", key: "phone" as const },
              ] as const
            ).map((field) => (
              <input
                key={field.key}
                placeholder={field.ph}
                value={newContact[field.key]}
                onChange={(e) => setNewContact((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2BBCB0")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
              />
            ))}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (newContact.name) {
                    setContacts((cs) => [...cs, newContact]);
                    setNewContact({ name: "", relation: "", phone: "" });
                    setAddingContact(false);
                  }
                }}
                className="flex-1 rounded-xl py-2.5 text-white font-bold text-sm"
                style={{ background: "#FF5A36" }}
              >
                Add Contact
              </button>
              <button
                onClick={() => setAddingContact(false)}
                className="px-4 rounded-xl text-white text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.10)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingContact(true)}
            className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: "2px dashed rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.38)" }}
          >
            <Plus className="w-4 h-4" />
            Add Emergency Contact
          </button>
        )}
      </div>

      {/* SMS preview */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ boxShadow: "0 1px 4px rgba(18,35,63,0.07), 0 0 0 1px rgba(18,35,63,0.05)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4" style={{ color: "rgba(18,35,63,0.28)" }} />
          <h3 className="text-[#12233F] font-bold text-sm">SMS Blast Preview</h3>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: "#F7F9FC", borderLeft: "3px solid #2BBCB0" }}
        >
          <p
            className="text-[#12233F] text-xs leading-relaxed"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            🔔 <strong>Pillba Safety Alert:</strong> Eleanor Barnes has not collected her 12:00 PM dose (Atorvastatin 20mg) within {alertWindow} minutes. Please check in immediately.
            <span className="block mt-1.5" style={{ color: "rgba(18,35,63,0.30)" }}>
              — Pillba · PillbaUnit-01 · Auto-generated
            </span>
          </p>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
