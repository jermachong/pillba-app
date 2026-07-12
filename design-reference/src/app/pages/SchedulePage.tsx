import { useState } from "react";
import { Check, Clock, ChevronDown, Plus, Shield, Camera } from "lucide-react";
import { usePillbaContext } from "../Root";
import { SCHEDULE } from "../pillba-data";

export default function SchedulePage() {
  const { mode, patientPermission, setPatientPermission } = usePillbaContext();
  const [expandAdd, setExpandAdd] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="px-5 py-5 space-y-4">
      {/* Next dose hero */}
      <div className="rounded-2xl p-5 flex justify-between items-center" style={{ background: "#2BBCB0" }}>
        <div>
          <p
            className="text-white/65 text-[10px] uppercase tracking-widest"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Next Dose
          </p>
          <h2
            className="text-white font-extrabold text-4xl mt-1 leading-none"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            12:00 PM
          </h2>
          <p className="text-white/75 text-xs mt-2">Atorvastatin 20mg · Slot C</p>
        </div>
        <div
          className="rounded-2xl px-4 py-3 text-center"
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          <p
            className="text-white/55 text-[9px] uppercase tracking-wider"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            IN
          </p>
          <p
            className="text-white font-bold text-2xl leading-none mt-0.5"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            3:42
          </p>
          <p
            className="text-white/55 text-[9px] mt-0.5"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            hours
          </p>
        </div>
      </div>

      {/* Dosing timeline */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ boxShadow: "0 1px 4px rgba(18,35,63,0.07), 0 0 0 1px rgba(18,35,63,0.05)" }}
      >
        <h3 className="text-[#12233F] font-bold text-base mb-4">Today's Timeline</h3>
        <div>
          {SCHEDULE.map((dose, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      dose.status === "dispensed"
                        ? "#2BBCB0"
                        : dose.next
                        ? "#FF5A36"
                        : "rgba(18,35,63,0.07)",
                  }}
                >
                  {dose.status === "dispensed" ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Clock
                      className="w-4 h-4"
                      style={{ color: dose.next ? "#fff" : "rgba(18,35,63,0.28)" }}
                    />
                  )}
                </div>
                {i < SCHEDULE.length - 1 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{ background: "rgba(18,35,63,0.07)", minHeight: 14 }}
                  />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between items-center">
                  <p className="text-[#12233F] font-bold text-sm">{dose.time}</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      background:
                        dose.status === "dispensed"
                          ? "rgba(43,188,176,0.12)"
                          : dose.next
                          ? "rgba(255,90,54,0.10)"
                          : "rgba(18,35,63,0.06)",
                      color:
                        dose.status === "dispensed"
                          ? "#2BBCB0"
                          : dose.next
                          ? "#FF5A36"
                          : "rgba(18,35,63,0.38)",
                    }}
                  >
                    {dose.status === "dispensed" ? "Dispensed" : dose.next ? "Next Up" : "Scheduled"}
                  </span>
                </div>
                <p className="text-[#12233F]/45 text-xs mt-0.5 leading-relaxed">
                  {dose.meds.join(" · ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add medication (caregiver only) */}
      {mode === "caregiver" && (
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 1px 4px rgba(18,35,63,0.07), 0 0 0 1px rgba(18,35,63,0.05)" }}
        >
          <button
            onClick={() => setExpandAdd((v) => !v)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#FF5A36", boxShadow: "0 3px 10px rgba(255,90,54,0.35)" }}
              >
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-[#12233F] font-bold text-sm">Add Medication</h3>
                <p className="text-[#12233F]/38 text-[11px]">Scan Rx label or enter manually</p>
              </div>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{
                color: "rgba(18,35,63,0.28)",
                transform: expandAdd ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {expandAdd && (
            <div
              className="px-4 pb-4 space-y-3"
              style={{ borderTop: "1px solid rgba(18,35,63,0.06)" }}
            >
              <div className="pt-3 space-y-1.5">
                <label className="text-[#12233F] text-xs font-bold">Medication Name</label>
                <input
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-[#12233F] placeholder-[#12233F]/25 focus:outline-none transition-colors"
                  style={{ background: "#F7F9FC", border: "1px solid rgba(18,35,63,0.08)" }}
                  placeholder="e.g. Atorvastatin 20mg"
                  onFocus={(e) => (e.target.style.borderColor = "#2BBCB0")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(18,35,63,0.08)")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[#12233F] text-xs font-bold">Compartment</label>
                  <select
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-[#12233F] focus:outline-none"
                    style={{ background: "#F7F9FC", border: "1px solid rgba(18,35,63,0.08)" }}
                  >
                    {["A", "B", "C", "D", "E", "F"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#12233F] text-xs font-bold">Frequency</label>
                  <select
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-[#12233F] focus:outline-none"
                    style={{ background: "#F7F9FC", border: "1px solid rgba(18,35,63,0.08)" }}
                  >
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times</option>
                    <option>As needed</option>
                  </select>
                </div>
              </div>

              {/* Camera preview */}
              <div className="space-y-1.5">
                <label className="text-[#12233F] text-xs font-bold">Scan Rx Label · 5MP Autofocus</label>
                <button
                  onClick={() => setShowCamera((v) => !v)}
                  className="w-full rounded-xl overflow-hidden transition-all"
                  style={{
                    border: showCamera ? "2px solid #2BBCB0" : "2px dashed rgba(18,35,63,0.12)",
                  }}
                >
                  {showCamera ? (
                    <div
                      className="relative h-40 flex items-center justify-center"
                      style={{ background: "linear-gradient(160deg, #0A1628 0%, #12233F 100%)" }}
                    >
                      <div className="flex flex-col items-center gap-3 w-full px-8">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ background: "#FF5A36" }}
                          />
                          <span
                            className="text-white/50 text-[10px]"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            5MP AF · ACTIVE
                          </span>
                        </div>
                        <div
                          className="w-full h-24 rounded-lg relative overflow-hidden flex items-center justify-center"
                          style={{ border: "1.5px solid rgba(43,188,176,0.6)" }}
                        >
                          {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 left-0 -rotate-90", "bottom-0 right-0 rotate-180"].map((pos, i) => (
                            <div
                              key={i}
                              className={`absolute ${pos} w-5 h-5`}
                              style={{
                                borderTop: "2.5px solid #2BBCB0",
                                borderLeft: "2.5px solid #2BBCB0",
                                borderRadius: "3px 0 0 0",
                              }}
                            />
                          ))}
                          <div
                            className="absolute w-full h-px animate-bounce"
                            style={{ background: "rgba(255,90,54,0.7)" }}
                          />
                        </div>
                        <p
                          className="text-white/40 text-[10px]"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          Align Rx label within frame
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-20 flex flex-col items-center justify-center gap-2">
                      <Camera className="w-6 h-6" style={{ color: "rgba(18,35,63,0.2)" }} />
                      <p className="text-[#12233F]/35 text-xs">Tap to open camera</p>
                    </div>
                  )}
                </button>
              </div>

              <button
                className="w-full rounded-xl py-3 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: "#FF5A36" }}
              >
                Save Medication Profile
              </button>
            </div>
          )}
        </div>
      )}

      {/* Patient permission toggle (caregiver only) */}
      {mode === "caregiver" && (
        <div
          className="bg-white rounded-2xl p-4"
          style={{ boxShadow: "0 1px 4px rgba(18,35,63,0.07), 0 0 0 1px rgba(18,35,63,0.05)" }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4" style={{ color: "rgba(18,35,63,0.35)" }} />
                <h3 className="text-[#12233F] font-bold text-sm">Patient Access Rights</h3>
              </div>
              <p className="text-[#12233F]/45 text-xs leading-relaxed">
                Grant Eleanor B. full dashboard access and manual dispense override.
              </p>
            </div>
            <button
              onClick={() => setPatientPermission(!patientPermission)}
              className="relative flex-shrink-0 mt-0.5 rounded-full transition-colors duration-200"
              style={{
                width: 52,
                height: 28,
                background: patientPermission ? "#2BBCB0" : "rgba(18,35,63,0.14)",
              }}
            >
              <div
                className="absolute top-1 rounded-full bg-white transition-transform duration-200"
                style={{
                  width: 20,
                  height: 20,
                  left: 4,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                  transform: patientPermission ? "translateX(24px)" : "translateX(0)",
                }}
              />
            </button>
          </div>
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            style={{
              background: patientPermission ? "rgba(43,188,176,0.09)" : "rgba(255,90,54,0.07)",
              color: patientPermission ? "#2BBCB0" : "#FF5A36",
            }}
          >
            {patientPermission ? (
              <>
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
                Full access granted — patient can view all data and manually dispense
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                Restricted — patient sees simplified dose view only
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
