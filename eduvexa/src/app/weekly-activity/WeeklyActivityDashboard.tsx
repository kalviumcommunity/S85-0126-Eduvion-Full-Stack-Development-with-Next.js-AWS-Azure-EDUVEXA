"use client";

import { useState } from "react";

export function WeeklyActivityDashboard() {
  const data = [
    { day: "Monday", value: 4200, details: "High productivity, 5 tasks completed." },
    { day: "Tuesday", value: 3600, details: "Team meeting, 4 tasks completed." },
    { day: "Wednesday", value: 3800, details: "Client call, 6 tasks completed." },
    { day: "Thursday", value: 3800, details: "Code review, 5 tasks completed." },
    { day: "Friday", value: 3600, details: "Documentation, 3 tasks completed." },
    { day: "Saturday", value: 3200, details: "Bug fixes, 2 tasks completed." },
    { day: "Sunday", value: 2900, details: "Planning, 1 task completed." },
  ];
  const max = Math.max(...data.map(d => d.value));
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="relative w-full h-64">
        <svg viewBox="0 0 700 260" className="absolute left-0 top-0 w-full h-full">
          {/* Grid lines and y-axis ticks */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = 40 + i * 36;
            const value = 5200 - i * 800;
            return (
              <g key={i}>
                <line x1="60" x2="680" y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x="50" y={y + 5} fontSize="12" fill="#9ca3af" textAnchor="end">{value}</text>
              </g>
            );
          })}
          {/* Bars */}
          {data.map((item, i) => {
            const barHeight = ((item.value / max) * 180) || 2;
            const y = 220 - barHeight;
            const x = 70 + i * 85;
            const isActive = selected === i;
            return (
              <g key={item.day}>
                <rect
                  x={x}
                  y={y}
                  width="50"
                  height={barHeight}
                  fill={isActive ? "#14b8a6" : "#38bdf8"}
                  opacity={isActive ? "0.9" : "0.7"}
                  rx="4"
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => setSelected(isActive ? null : i)}
                />
                {/* Value label on top of bar */}
                <text
                  x={x + 25}
                  y={y - 10}
                  fontSize="13"
                  fill={isActive ? "#14b8a6" : "#38bdf8"}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
          {/* X-axis labels */}
          {data.map((item, i) => (
            <text
              key={item.day}
              x={95 + i * 85}
              y={245}
              fontSize="13"
              fill="#6b7280"
              textAnchor="middle"
              transform={`rotate(-25,${95 + i * 85},245)`}
            >
              {item.day}
            </text>
          ))}
          {/* Y-axis label */}
          <text x="20" y="20" fontSize="13" fill="#9ca3af">Revenues</text>
        </svg>
      </div>
      {/* Details below chart */}
      {selected !== null && (
        <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200 text-cyan-900 shadow">
          <span className="font-semibold">{data[selected].day}:</span> {data[selected].details}
        </div>
      )}
    </div>
  );
}
