import React, { useState } from "react";
import { Calendar, RefreshCw, Settings } from "lucide-react";

const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SEC = "#6B7280";
const BORDER = "#E5E7EB";
const ACCENT = "#E8522A";

// Simple line chart component
function LineChart({ data, height = 200, label = "" }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const y = height - ((d.value - min) / range) * (height - 40);
    const x = (i / (data.length - 1)) * 400;
    return { x, y, value: d.value };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100%" height={height} style={{ overflow: "visible" }}>
      <path d={pathData} fill="none" stroke={ACCENT} strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={ACCENT} />
      ))}
    </svg>
  );
}

// Simple horizontal bar chart
function HorizontalBarChart({ data, height = 150 }) {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
            <span style={{ fontWeight: 500, color: TEXT_PRIMARY }}>{item.label}</span>
            <span style={{ fontWeight: 600, color: TEXT_SEC }}>{item.value}</span>
          </div>
          <div style={{ width: "100%", height: 20, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${(item.value / maxValue) * 100}%`,
              background: item.color || ACCENT, transition: "width 400ms ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const RADAR_CARDS = [
  {
    id: 1,
    title: "Revenue MTD vs Target",
    subtitle: "Daily cumulative revenue against monthly target pace",
    type: "line",
    data: [
      { label: "1", value: 10 },
      { label: "7", value: 95 },
      { label: "14", value: 180 },
      { label: "21", value: 260 },
      { label: "28", value: 280 },
    ],
  },
  {
    id: 2,
    title: "Overdue Invoices",
    subtitle: "Invoice aging breakdown by overdue period",
    type: "bar",
    data: [
      { label: "0-30 days", value: 14200, color: "#FCD34D" },
      { label: "31-60 days", value: 11800, color: "#FBAD1C" },
      { label: "60+ days", value: 12200, color: "#DC2626" },
    ],
  },
  {
    id: 3,
    title: "Quote-to-Invoice Conversion",
    subtitle: "Monthly conversion rate trend over the last 8 months",
    type: "line",
    data: [
      { label: "Jul", value: 65 },
      { label: "Aug", value: 72 },
      { label: "Sep", value: 70 },
      { label: "Oct", value: 75 },
      { label: "Nov", value: 73 },
      { label: "Dec", value: 71 },
      { label: "Jan", value: 74 },
      { label: "Feb", value: 72 },
    ],
  },
  {
    id: 4,
    title: "Crew Utilisation",
    subtitle: "Weekly utilisation rate by crew — target 80%",
    type: "bar",
    data: [
      { label: "Crew A", value: 86, color: "#10B981" },
      { label: "Crew B", value: 82, color: "#10B981" },
      { label: "Crew C", value: 71, color: "#FBBF24" },
      { label: "Crew D", value: 64, color: "#FB923C" },
    ],
  },
];

export default function RadarPage() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div style={{ padding: "24px 40px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Radar
          </h1>
          <p style={{ fontSize: 14, color: TEXT_SEC }}>Business intelligence & KPI tracking</p>
        </div>

        {/* Top right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 6, border: `1px solid ${BORDER}`,
            background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY,
          }}>
            <Calendar size={16} />
            {timeRange} days
          </button>
          <button style={{
            width: 36, height: 36, borderRadius: 6, border: `1px solid ${BORDER}`,
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: TEXT_SEC,
          }}>
            <RefreshCw size={16} />
          </button>
          <button style={{
            width: 36, height: 36, borderRadius: 6, border: `1px solid ${BORDER}`,
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: TEXT_SEC,
          }}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {RADAR_CARDS.map(card => (
          <div key={card.id} style={{
            padding: 24, borderRadius: 8, border: `1px solid ${BORDER}`,
            background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            {/* Card header */}
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 4 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 12, color: TEXT_SEC }}>
                  {card.subtitle}
                </p>
              </div>
              <button style={{
                width: 32, height: 32, borderRadius: 6, border: "none",
                background: "#F3F4F6", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", color: TEXT_SEC,
              }}>
                ⋯
              </button>
            </div>

            {/* Card content */}
            <div style={{ minHeight: 180 }}>
              {card.type === "line" && <LineChart data={card.data} height={160} />}
              {card.type === "bar" && <HorizontalBarChart data={card.data} />}
            </div>

            {/* Card footer */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
              <span style={{ color: TEXT_SEC }}>Dec 11 - Mar 11</span>
              <button style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "none", border: "none", cursor: "pointer",
                color: TEXT_SEC, fontSize: 12, fontWeight: 500,
              }}>
                <RefreshCw size={13} />
                Updated just now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional insights section */}
      <div style={{ marginTop: 40, padding: 24, borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFBF7" }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 12 }}>
          💡 Insights & alerts
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>Overdue invoices trending up</div>
              <div style={{ fontSize: 12, color: TEXT_SEC, marginTop: 2 }}>12 invoices over 60 days — consider acceleration collection efforts</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>Crew A & B tracking to target</div>
              <div style={{ fontSize: 12, color: TEXT_SEC, marginTop: 2 }}>Both crews exceed 80% utilisation — strong production velocity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
