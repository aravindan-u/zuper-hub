import React, { useState, useRef, useEffect } from "react";
import { Send, Plus, Mic, Search, Settings, Paperclip, X, ChevronRight } from "lucide-react";

const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SEC = "#6B7280";
const BORDER = "#E5E7EB";
const ACCENT = "#FD5000";
const BG_LIGHT = "#F9F9F9";

export default function SensePage() {
  const [selectedThread, setSelectedThread] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const threads = [
    { id: 1, title: "Team performance analysis", timestamp: "2 hours ago", active: true },
    { id: 2, title: "Revenue tracking Q1", timestamp: "Yesterday", active: false },
    { id: 3, title: "Roofing metrics dashboard", timestamp: "2 days ago", active: false },
    { id: 4, title: "Customer feedback review", timestamp: "3 days ago", active: false },
    { id: 5, title: "Material cost optimization", timestamp: "5 days ago", active: false },
    { id: 6, title: "Safety compliance check", timestamp: "1 week ago", active: false },
    { id: 7, title: "Quote follow-up automation", timestamp: "1 week ago", active: false },
    { id: 8, title: "Customer satisfaction analysis", timestamp: "2 weeks ago", active: false },
    { id: 9, title: "Inventory status check", timestamp: "2 weeks ago", active: false },
    { id: 10, title: "Project timeline updates", timestamp: "3 weeks ago", active: false },
  ];

  const keyInsights = [
    { icon: "⚠️", title: "3 Quotes Stuck", desc: "Potential revenue: $84,000", action: "Review & follow up", color: "#DC2626" },
    { icon: "⏱️", title: "4 Jobs Missing SLA", desc: "Mostly re-roofing jobs", action: "View delays", color: "#D97706" },
    { icon: "📈", title: "Revenue Up 12%", desc: "Compared to last month", action: "View details", color: "#10B981" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: 280, borderRight: `1px solid ${BORDER}`, background: "#fff",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: "16px 14px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button style={{
              flex: 1, padding: "8px 12px", borderRadius: 6, border: `1px solid ${BORDER}`,
              background: BG_LIGHT, cursor: "pointer", fontSize: 12, fontWeight: 600,
              color: TEXT_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Plus size={14} />
              New
            </button>
            <button style={{
              width: 36, height: 36, borderRadius: 6, border: `1px solid ${BORDER}`,
              background: BG_LIGHT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: TEXT_SEC,
            }}>
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Thread List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {threads.map((thread, i) => (
            <button key={thread.id}
              onClick={() => setSelectedThread(i)}
              style={{
                width: "100%", padding: "12px 14px", textAlign: "left", border: "none",
                background: selectedThread === i ? "#F5F5F5" : "transparent",
                borderLeft: selectedThread === i ? `3px solid ${ACCENT}` : "3px solid transparent",
                cursor: "pointer", transition: "all 150ms ease",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: selectedThread === i ? 600 : 500, color: TEXT_PRIMARY, marginBottom: 4 }}>
                {thread.title}
              </div>
              <div style={{ fontSize: 11, color: TEXT_SEC }}>
                {thread.timestamp}
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <button style={{
            width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${BORDER}`,
            background: "transparent", cursor: "pointer", fontSize: 12, color: TEXT_SEC,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${BORDER}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, margin: 0 }}>
            {threads[selectedThread]?.title}
          </h2>
          <button style={{
            width: 32, height: 32, borderRadius: 6, border: "none",
            background: BG_LIGHT, cursor: "pointer", color: TEXT_SEC,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column" }}>
          {/* Key Insights Section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              📊 Analyzed 4 data points across Jobs, Customer, Organisation, and Quotes modules
            </div>
          </div>

          {/* AI Message */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: ACCENT,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>
              S
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 8 }}>
                Sense
              </div>
              <p style={{ margin: "0 0 16px 0", fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.6 }}>
                Here's your team performance breakdown. Crew A is leading with a 94% completion rate, while Crew C has dropped to 78% — mainly due to 2 members on leave. Your team utilisation is at 86%, up 4% from last month.
              </p>

              {/* Dashboard Card */}
              <div style={{
                borderRadius: 8, border: `1px solid ${BORDER}`,
                background: BG_LIGHT, overflow: "hidden", marginBottom: 12,
              }}>
                {/* Dashboard Header */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}` }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 2px 0" }}>
                    Performance Dashboard
                  </h4>
                  <p style={{ fontSize: 11, color: TEXT_SEC, margin: 0 }}>
                    Key metrics and trends across your business
                  </p>
                </div>

                {/* Metrics Grid */}
                <div style={{
                  padding: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                  borderBottom: `1px solid ${BORDER}`,
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: TEXT_SEC, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Active Members
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 3 }}>
                      18
                    </div>
                    <div style={{ fontSize: 10, color: "#DC2626", fontWeight: 600 }}>
                      -4 vs last period
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: TEXT_SEC, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Jobs / Member
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 3 }}>
                      5.2
                    </div>
                    <div style={{ fontSize: 10, color: "#DC2626", fontWeight: 600 }}>
                      -6.8 vs last period
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: TEXT_SEC, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Utilisation
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 3 }}>
                      86%
                    </div>
                    <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>
                      +4 vs last period
                    </div>
                  </div>
                </div>

                {/* Crew Performance */}
                <div style={{ padding: 14 }}>
                  <h5 style={{ fontSize: 12, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 3 }}>
                    Crew Performance
                  </h5>
                  <p style={{ fontSize: 10, color: TEXT_SEC, marginBottom: 12 }}>
                    Completion rate by crew
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { name: "Crew A", rate: 94, color: "#10B981", jobs: "14 jobs", revenue: "$128K" },
                      { name: "Crew B", rate: 87, color: "#F97316", jobs: "11 jobs", revenue: "$98K" },
                      { name: "Crew C", rate: 78, color: "#FBBF24", jobs: "9 jobs", revenue: "$72K" },
                      { name: "Crew D", rate: 81, color: "#6366F1", jobs: "12 jobs", revenue: "$134K" },
                    ].map((crew, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                          <span style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{crew.name}</span>
                          <div style={{ display: "flex", gap: 8, fontSize: 10, color: TEXT_SEC }}>
                            <span>{crew.jobs}</span>
                            <span style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{crew.revenue}</span>
                          </div>
                        </div>
                        <div style={{
                          height: 20, background: "#E5E5E5", borderRadius: 3,
                          overflow: "hidden", position: "relative",
                        }}>
                          <div style={{
                            height: "100%", width: `${crew.rate}%`, background: crew.color,
                            display: "flex", alignItems: "center", justifyContent: "flex-end",
                            paddingRight: 6, fontSize: 10, fontWeight: 700, color: "#fff",
                          }}>
                            {crew.rate}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "16px 24px", borderTop: `1px solid ${BORDER}`,
          display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0,
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            padding: "12px 14px", borderRadius: 8, border: `1px solid ${BORDER}`,
            background: "#fff",
          }}>
            <button style={{
              width: 28, height: 28, borderRadius: 4, border: "none",
              background: BG_LIGHT, cursor: "pointer", color: TEXT_SEC,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Plus size={14} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Send a message..."
              style={{
                flex: 1, border: "none", outline: "none", fontSize: 13,
                background: "transparent", color: TEXT_PRIMARY,
              }}
            />
            <button
              onClick={() => setIsListening(!isListening)}
              style={{
                width: 28, height: 28, borderRadius: 4, border: "none",
                background: isListening ? ACCENT : BG_LIGHT, cursor: "pointer",
                color: isListening ? "#fff" : TEXT_SEC,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Mic size={14} />
            </button>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: 6, border: "none",
            background: ACCENT, cursor: "pointer", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
